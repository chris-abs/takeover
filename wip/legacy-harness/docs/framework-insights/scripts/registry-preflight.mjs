#!/usr/bin/env node
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { npmCommand } from './npm-command.mjs';
import { writeArtifact } from './write-artifact.mjs';
const exec = promisify(execFile);
const exactSpec = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+@\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/i;
async function main() {
  const opts = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (!['--repo','--public','--private','--out','--timeout'].includes(key) || !process.argv[i + 1] || process.argv[i + 1].startsWith('--')) throw Error('Usage: registry-preflight.mjs --repo PATH --public PACKAGE@EXACT [--private PACKAGE@EXACT] --out FILE [--timeout MS]');
    opts[key.slice(2)] = process.argv[++i];
  }
  if (!opts.repo || !opts.public || !opts.out) throw Error('--repo, --public and --out are required');
  for (const key of ['public','private']) if (opts[key] && !exactSpec.test(opts[key])) throw Error('Preflight packages must use names and exact registry versions');
  const timeout = Number(opts.timeout || 20000);
  if (!Number.isInteger(timeout) || timeout < 100 || timeout > 20000) throw Error('Use a preflight deadline from 100 to 20000 milliseconds; keep the default for live diagnosis');
  const repo = await fs.realpath(opts.repo);
  const probes = [];
  for (const kind of ['public','private']) {
    if (!opts[kind]) continue;
    const spec = opts[kind], version = spec.slice(spec.lastIndexOf('@') + 1), started = Date.now();
    let result;
    try {
      const args = ['view',spec,'version','peerDependencies','engines','--json','--silent','--fetch-retries=0','--fetch-timeout=' + Math.max(100,Math.min(15000,timeout))];
      const command = await npmCommand(args);
      const { stdout } = await exec(command.file, command.args, { cwd: repo, timeout, maxBuffer: 2 * 1024 * 1024, env: { ...process.env, npm_config_update_notifier: 'false' } });
      const data = JSON.parse(stdout);
      if ((typeof data === 'string' ? data : data?.version) !== version) throw Error('Unexpected metadata version');
      result = { kind, package: spec, status: 'success', version };
    } catch (e) {
      const raw = String(e.stdout || '') + String(e.stderr || '') + String(e.message || '');
      const reason = e.killed || /ETIMEDOUT|ETIMEOUT|ERR_SOCKET_TIMEOUT|timed out/i.test(raw) ? 'timeout' : /E401|E403|ENEEDAUTH/.test(raw) ? 'authentication-or-access' : /E404|ETARGET/.test(raw) ? 'not-found-or-not-visible' : /ENOTFOUND|EAI_AGAIN|ECONN|ENETUNREACH|FETCH_ERROR/.test(raw) ? 'network' : /npm CLI not found|ENOENT/.test(raw) ? 'tool-unavailable' : 'invalid-response-or-execution';
      result = { kind, package: spec, status: 'failed', reason };
    }
    result.durationMs = Date.now() - started;
    probes.push(result);
    console.log(kind + ' preflight: ' + result.status + (result.reason ? ' (' + result.reason + ')' : '') + ' in ' + result.durationMs + ' ms');
  }
  const success = probes.every(p => p.status === 'success');
  await writeArtifact(opts.out, { schema: 'modernisation-registry-preflight/v1', assessedAt: new Date().toISOString(), repository: repo, node: process.version, timeoutMs: timeout, status: success ? 'success' : 'failed', probes, nextAction: success ? 'Run collection in this same execution/network context.' : 'Diagnose the recorded cause; for timeout/network failures in restricted execution, retry using available network-enabled execution before asking for user intervention. Never poll a completed preflight indefinitely.' });
  if (!success) process.exitCode = 2;
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
