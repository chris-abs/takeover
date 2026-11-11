#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { writeArtifact } from './write-artifact.mjs';
import { npmCommand } from './npm-command.mjs';
const exec = promisify(execFile);
const exact = v => typeof v === 'string' && /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/.test(v);
const packageName = v => /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i.test(v);
const read = async p => { try { return await fs.readFile(p, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } };
function options(args) {
  const o = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--offline') o.offline = true;
    else if (['--repo', '--out', '--targets', '--timeout', '--concurrency'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--')) o[args[i++].slice(2)] = args[i];
    else throw new Error('Usage: collect-evidence.mjs --repo PATH --out FILE [--targets FILE] [--offline] [--timeout MS] [--concurrency N]');
  }
  if (!o.repo || !o.out) throw new Error('--repo and --out are required');
  o.timeout = Number(o.timeout || 20000); o.concurrency = Number(o.concurrency || 4);
  if (!Number.isInteger(o.concurrency) || o.concurrency < 1 || o.concurrency > 8 || !Number.isFinite(o.timeout) || o.timeout < 100 || o.timeout > 120000) throw new Error('Invalid timeout/concurrency');
  return o;
}
export async function collect(o) {
  const repo = await fs.realpath(o.repo);
  const manifestText = await read(path.join(repo, 'package.json'));
  if (!manifestText) throw new Error('No package.json in selected package directory');
  const manifest = JSON.parse(manifestText);
  const targets = o.targets ? JSON.parse(await fs.readFile(o.targets, 'utf8')) : {};
  for (const [n, v] of Object.entries(targets)) if (!packageName(n) || !(v === null || exact(v))) throw new Error('Targets must map package names to exact versions or null (remove)');
  const selectors = new Map(), versions = new Map();
  const add = (n, v) => { if (!packageName(n) || !exact(v)) return; if (!versions.has(n)) versions.set(n, new Set()); versions.get(n).add(v); };
  let lock = { kind: 'none', status: 'missing' };
  const npmLock = await read(path.join(repo, 'package-lock.json'));
  const yarnLock = await read(path.join(repo, 'yarn.lock'));
  const pnpmLock = await read(path.join(repo, 'pnpm-lock.yaml'));
  const warnings = [];
  const presentLocks = [npmLock !== null, yarnLock !== null, pnpmLock !== null].filter(Boolean).length;
  if (presentLocks > 1) warnings.push('multiple-lockfiles: select authoritative manager before using version evidence');
  if (npmLock !== null) {
    const d = JSON.parse(npmLock);
    lock = { kind: 'npm', status: 'parsed', sha256: hash(npmLock), lockfileVersion: d.lockfileVersion };
    if (d.packages) {
      for (const [location, p] of Object.entries(d.packages)) {
        const n = location.split('node_modules/').at(-1);
        add(n, p.version);
        if (location === `node_modules/${n}` && exact(p.version) && !p.link) selectors.set(n, p.version);
      }
    } else { lock.status = 'unsupported'; warnings.push('npm-lock-v1: lock evidence not parsed'); }
  } else if (yarnLock !== null) {
    lock = { kind: 'yarn', status: 'unsupported', sha256: hash(yarnLock) };
    if (/^# yarn lockfile v1\s*$/m.test(yarnLock)) {
      lock.status = 'parsed';
      // Read only selector/version records from Yarn classic. Never collect resolved URLs or credentials.
      for (const block of yarnLock.split(/\n(?=[^\s#\n])/)) {
        const m = block.match(/^([^\n]+):\r?\n[\s\S]*?^  version "([^"\n]+)"/m);
        if (!m || !exact(m[2])) continue;
        for (let selector of m[1].split(/,\s+/)) {
          selector = selector.replace(/^"|"$/g, '');
          const split = selector.indexOf('@', selector.startsWith('@') ? 1 : 0);
          if (split < 1) continue;
          add(selector.slice(0, split), m[2]); selectors.set(selector, m[2]);
        }
      }
    } else warnings.push('yarn-berry: use a supported lock parser before resolving current versions');
  } else if (pnpmLock !== null) {
    lock = { kind: 'pnpm', status: 'unsupported', sha256: hash(pnpmLock) };
    warnings.push('pnpm: current lock evidence requires a supported parser');
  }
  const packages = {};
  const records = [];
  const sectionNames = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
  for (const section of sectionNames) for (const [name, spec] of Object.entries(manifest[section] || {})) {
    if (!packageName(name)) { warnings.push('unsupported-package-name'); continue; }
    const p = packages[name] ||= { declarations: [], locked: [], installed: null, current: null, currentSource: null };
    p.declarations.push({ section, spec: safeSpec(spec) });
    if (/^(?:npm:|file:|link:|workspace:|git|https?:|ssh:|github:|bitbucket:|gitlab:|[./~])/i.test(spec) && !/^~\d/.test(spec)) { p.nonRegistry = true; warnings.push(`non-registry-or-alias:${name}`); }
    const pinned = presentLocks > 1 || p.nonRegistry ? null : selectors.get(lock.kind === 'npm' ? name : `${name}@${spec}`);
    if (pinned && !p.locked.includes(pinned)) p.locked.push(pinned);
  }
  for (const [name, p] of Object.entries(packages)) {
    const installed = await read(path.join(repo, 'node_modules', name, 'package.json'));
    if (installed) { try { const d = JSON.parse(installed); if (exact(d.version)) p.installed = d.version; } catch { warnings.push(`invalid-installed-manifest:${name}`); } }
    const declaredExact = p.declarations.map(x => x.spec).filter(exact);
    if (p.nonRegistry) continue;
    if (p.locked.length === 1) { p.current = p.locked[0]; p.currentSource = 'lock'; }
    else if (presentLocks === 0 && p.installed) { p.current = p.installed; p.currentSource = 'installed-only'; }
    else if (presentLocks === 0 && new Set(declaredExact).size === 1) { p.current = declaredExact[0]; p.currentSource = 'exact-declaration-only'; }
    if (p.installed && p.current && p.installed !== p.current) warnings.push(`stale-installed:${name}`);
  }
  const queue = [], seen = new Set();
  const enqueue = (name, version) => { const key = `${name}@${version}`; if (!seen.has(key)) { seen.add(key); queue.push({ name, version }); } };
  for (const [n, p] of Object.entries(packages)) if (p.current) enqueue(n, p.current);
  for (const [n, v] of Object.entries(targets)) if (v) enqueue(n, v);
  // Fetch peer closure only where an exact current/target choice is known. No implicit latest queries.
  while (queue.length) {
    const batch = queue.splice(0, o.concurrency);
    const results = await Promise.all(batch.map(async ({ name, version }) => {
      const base = { name, version, fetchedAt: new Date().toISOString(), source: 'npm-view' };
      if (o.offline) return { ...base, status: 'not-fetched', reason: 'offline' };
      try {
        const args = ['view', `${name}@${version}`, 'version', 'peerDependencies', 'peerDependenciesMeta', 'dependencies', 'engines', 'deprecated', '--json', '--silent'];
        const command = o.npmExecutable ? { file: o.npmExecutable, args } : await npmCommand(args);
        const { stdout } = await exec(command.file, command.args, { cwd: repo, timeout: o.timeout, maxBuffer: 2 * 1024 * 1024, env: { ...process.env, npm_config_update_notifier: 'false' } });
        const parsed = JSON.parse(stdout);
        const d = typeof parsed === 'string' && parsed === version ? { version: parsed } : parsed;
        if (!d || typeof d !== 'object' || Array.isArray(d) || d.version !== version) return { ...base, status: 'invalid-response' };
        return { ...base, status: 'verified-metadata', peerDependencies: cleanMap(d.peerDependencies), peerDependenciesMeta: Object.fromEntries(Object.entries(d.peerDependenciesMeta || {}).map(([n, x]) => [n, { optional: x.optional === true }])), dependencies: cleanMap(d.dependencies), engines: cleanMap(d.engines), deprecated: Boolean(d.deprecated) };
      } catch (e) {
        const error = `${e.stdout || ''} ${e.stderr || ''} ${e.message || ''}`;
        const reason = e.killed ? 'timeout' : /E401|E403|ENEEDAUTH/.test(error) ? 'authentication-or-access' : /E404|ETARGET/.test(error) ? 'not-found-or-not-visible' : /ENOTFOUND|EAI_AGAIN|ECONN|ENETUNREACH/.test(error) ? 'network' : 'lookup-failed';
        return { ...base, status: 'lookup-failed', reason }; // Never emit raw registry errors, URLs or tokens.
      }
    }));
    for (const record of results) {
      records.push(record);
      for (const n of Object.keys(record.peerDependencies || {})) {
        if (!packageName(n) || Object.hasOwn(packages, n)) continue;
        const choices = [...(versions.get(n) || [])];
        const selected = Object.hasOwn(targets, n) ? targets[n] : choices.length === 1 ? choices[0] : null;
        packages[n] = { declarations: [], locked: choices, installed: null, current: choices.length === 1 && presentLocks === 1 ? choices[0] : null, currentSource: choices.length === 1 && presentLocks === 1 ? 'lock-peer-candidate' : null, peerOnly: true, presence: choices.length === 0 && lock.status === 'parsed' && presentLocks === 1 ? 'absent-from-supported-lock' : 'unknown' };
        if (packages[n].current) enqueue(n, packages[n].current);
        if (selected) enqueue(n, selected);
      }
    }
  }
  let commit = null;
  try { commit = (await exec('git', ['rev-parse', 'HEAD'], { cwd: repo })).stdout.trim(); } catch { /* non-git packages supported */ }
  return { schema: 'modernisation-evidence/v1', collectedAt: new Date().toISOString(), repository: repo, commit, manifestSha256: hash(manifestText), node: process.version, lock, overrides: redact(manifest.overrides || {}), resolutions: redact(manifest.resolutions || {}), targets, packages, metadata: records, warnings, limitations: ['Peer closure only; not a full install solver or runtime compatibility proof.', 'Yarn classic selector/version and npm lock v2/v3 supported; unsupported or ambiguous locks stay unresolved.', 'Run separately per workspace/package manifest; hoisted workspace resolution is not inferred.'] };
}
function hash(s) { return createHash('sha256').update(s).digest('hex'); }
function safeSpec(s) { return typeof s === 'string' && !/https?:|git\+|\/\/|token|password/i.test(s) ? s : '[non-registry-or-redacted]'; }
function cleanMap(d = {}) { return Object.fromEntries(Object.entries(d).filter(([k, v]) => typeof v === 'string').map(([k, v]) => [k, safeSpec(v)])); }
function redact(x) { if (typeof x === 'string') return safeSpec(x); if (Array.isArray(x)) return x.map(redact); if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [safeSpec(k), redact(v)])); return x; }
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const o = options(process.argv.slice(2)); const result = await collect(o); await writeArtifact(o.out, result); console.log(`Evidence saved: ${o.out} (${Object.keys(result.packages).length} packages; ${result.metadata.filter(x => x.status !== 'verified-metadata').length} unverified metadata records)`); }
  catch (e) { console.error(e instanceof SyntaxError ? 'Collector failed: invalid JSON input' : e.code ? `Collector failed (${e.code})` : e.message); process.exitCode = 1; }
}
