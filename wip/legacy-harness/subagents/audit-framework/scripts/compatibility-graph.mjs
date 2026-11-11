#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { writeArtifact } from './write-artifact.mjs';
export function analyse(evidence, semver, nodeVersion = evidence.node) {
  const metadata = new Map(evidence.metadata.map(x => [`${x.name}@${x.version}`, x]));
  const names = new Set([...Object.keys(evidence.packages), ...Object.keys(evidence.targets)]);
  const nodes = Object.fromEntries([...names].map(name => {
    const p = evidence.packages[name];
    return [name, { current: p?.current || null, selected: Object.hasOwn(evidence.targets, name) ? evidence.targets[name] : p?.current || null, peerOnly: Boolean(p?.peerOnly), explicitTarget: Object.hasOwn(evidence.targets, name), presence: p?.presence }];
  }));
  const edges = [], blockers = [], ordering = [], engines = [];
  const addBlocker = (kind, source, detail) => blockers.push({ kind, source, detail });
  const get = (n, v) => v ? metadata.get(`${n}@${v}`) : null;
  const satisfies = (version, range) => semver.valid(version) && semver.validRange(range) ? semver.satisfies(version, range) : null;
  for (const [name, n] of Object.entries(nodes)) {
    if (!n.selected) {
      if (!n.explicitTarget && !n.peerOnly) addBlocker('unresolved-current', name, 'No exact authoritative current version');
      continue;
    }
    if (evidence.packages[name]?.declarations?.length && !n.current) addBlocker('intermediate-unverified', name, 'Current exact version unresolved; selected target does not establish a safe upgrade boundary');
    const candidate = get(name, n.selected);
    if (candidate?.status !== 'verified-metadata') { addBlocker('metadata-unverified', name, `${n.selected}: ${candidate?.reason || candidate?.status || 'not-collected'}`); continue; }
    if (candidate.engines?.node) {
      const result = satisfies(semver.clean(nodeVersion), candidate.engines.node);
      engines.push({ name, selected: n.selected, range: candidate.engines.node, nodeVersion, state: result === null ? 'unverified' : result ? 'compatible' : 'conflict' });
      if (!result) addBlocker('node-engine', name, `Selected Node does not satisfy verified engine range or range is unsupported`);
    }
    const currentMeta = get(name, n.current);
    if (n.current !== n.selected && n.current && currentMeta?.status !== 'verified-metadata') addBlocker('intermediate-unverified', name, 'Current metadata missing; upgrade order cannot be established');
    for (const [peer, range] of Object.entries(candidate.peerDependencies || {})) {
      const optional = candidate.peerDependenciesMeta?.[peer]?.optional === true;
      const pn = nodes[peer];
      let state;
      if (!pn?.selected) state = optional && (!pn || pn.explicitTarget || pn.presence === 'absent-from-supported-lock') ? 'optional-absent' : pn?.peerOnly || pn && !pn.explicitTarget ? 'unverified' : 'conflict';
      else if (pn.peerOnly && !pn.explicitTarget) state = 'unverified'; // Lock presence alone does not prove peer placement/visibility.
      else { const result = satisfies(pn.selected, range); state = result === null ? 'unverified' : result ? 'compatible' : 'conflict'; }
      edges.push({ source: name, sourceVersion: n.selected, peer, selectedPeerVersion: pn?.selected || null, range, optional, state });
      if (!['compatible', 'optional-absent'].includes(state)) addBlocker(`peer-${state}`, name, `${peer} must satisfy ${range}`);
      // Determine ordering constraints for the specific current/candidate pair, not all possible bridge releases.
      if (state === 'compatible' && n.current !== n.selected && pn.current !== pn.selected) {
        const candidateAcceptsOldPeer = pn.current ? satisfies(pn.current, range) : null;
        if (candidateAcceptsOldPeer === false || pn.explicitTarget && pn.current === null) ordering.push({ before: peer, after: name, reason: 'candidate-source-requires-new-peer', range, sourceVersion: n.selected });
      }
    }
    // Also inspect current peer ranges: the old source might reject a new peer even when the candidate drops that peer.
    if (n.current && n.current !== n.selected && currentMeta?.status === 'verified-metadata') {
      for (const [peer, oldRange] of Object.entries(currentMeta.peerDependencies || {})) {
        const pn = nodes[peer];
        if (!pn || pn.current === pn.selected || !pn.selected || pn.peerOnly && !pn.explicitTarget) continue;
        if (satisfies(pn.selected, oldRange) === false) ordering.push({ before: name, after: peer, reason: 'current-source-rejects-new-peer', range: oldRange, sourceVersion: n.current });
      }
    }
  }
  for (const warning of evidence.warnings || []) if (/multiple-lockfiles|unsupported|berry|pnpm/.test(warning)) addBlocker('evidence-limitation', 'repository', warning);
  const changed = Object.entries(nodes).filter(([,n]) => n.selected && n.current !== n.selected).map(([name]) => name);
  const groups = stronglyConnected(changed, ordering).filter(g => g.length > 1).map(packages => ({ packages, state: 'coupled-for-selected-candidates', reasons: ordering.filter(e => packages.includes(e.before) && packages.includes(e.after)), limitation: 'A different bridge release may permit smaller commits; runtime/API coupling is not proven by peer ranges.' }));
  return { schema: 'modernisation-peer-graph/v1', repository: evidence.repository, evidenceCommit: evidence.commit, manifestSha256: evidence.manifestSha256, nodeVersion, nodes, peerEdges: edges, nodeEngines: engines, orderingConstraints: ordering, candidateGroups: groups, blockers, verdict: blockers.length ? 'blocked' : 'peer-constraints-satisfied', limitations: ['Checks selected peers and Node engines, not full dependency installation, hoisting, overrides or runtime APIs.', 'Use the repository package manager for eventual resolution; this graph never substitutes npm resolution for Yarn.', 'Ordering is conditional on recorded exact current/selected versions; zero edges is not proof of independent upgrade safety.'] };
}
function stronglyConnected(names, edges) {
  let count = 0; const index = new Map(), low = new Map(), active = new Set(), stack = [], groups = [];
  const adjacency = new Map(names.map(n => [n, []]));
  for (const e of edges) if (adjacency.has(e.before) && adjacency.has(e.after)) adjacency.get(e.before).push(e.after);
  function visit(n) {
    index.set(n, count); low.set(n, count++); stack.push(n); active.add(n);
    for (const next of adjacency.get(n)) { if (!index.has(next)) { visit(next); low.set(n, Math.min(low.get(n), low.get(next))); } else if (active.has(next)) low.set(n, Math.min(low.get(n), index.get(next))); }
    if (low.get(n) === index.get(n)) { const g = []; let next; do { next = stack.pop(); active.delete(next); g.push(next); } while (next !== n); groups.push(g); }
  }
  for (const n of names) if (!index.has(n)) visit(n);
  return groups;
}
async function main() {
  const opts = {};
  for (let i = 2; i < process.argv.length; i += 2) { const k = process.argv[i]; if (!['--evidence','--out','--node-version','--semver-from'].includes(k) || !process.argv[i + 1]) throw new Error('Usage: compatibility-graph.mjs --evidence FILE --out FILE [--node-version VERSION] [--semver-from DIRECTORY]'); opts[k.slice(2)] = process.argv[i + 1]; }
  if (!opts.evidence || !opts.out) throw new Error('--evidence and --out are required');
  const evidence = JSON.parse(await fs.readFile(opts.evidence, 'utf8'));
  if (evidence.schema !== 'modernisation-evidence/v1') throw new Error('Unsupported evidence schema');
  let semver;
  for (const dir of [opts['semver-from'], path.dirname(fileURLToPath(import.meta.url))].filter(Boolean)) {
    try { const require = createRequire(path.join(path.resolve(dir), 'package.json')); const pinned = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf8')).dependencies.semver; if (require('semver/package.json').version !== pinned) continue; semver = require('semver'); break; } catch { /* try next runtime */ }
  }
  if (!semver) throw new Error('Pinned semver runtime required: run prepare-tools.mjs and supply its tools directory with --semver-from; do not modify target repo dependencies');
  const result = analyse(evidence, semver, opts['node-version']);
  await writeArtifact(opts.out, result);
  console.log(`Graph saved: ${opts.out} (${result.peerEdges.length} edges; ${result.blockers.length} constraint diagnostics; ${result.candidateGroups.length} candidate coupled groups)`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e instanceof SyntaxError ? 'Graph failed: invalid JSON input' : e.message); process.exitCode = 1; });
