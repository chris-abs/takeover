#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { npmCommand } from './npm-command.mjs';
const exec = promisify(execFile);
const hash = s => createHash('sha256').update(s).digest('hex');
const within = (child, parent) => { const r = path.relative(parent, child); return !r || (!r.startsWith('..' + path.sep) && r !== '..' && !path.isAbsolute(r)); };
async function read(file) { try { return await fs.readFile(file, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
async function futureRealpath(file) {
  try { return await fs.realpath(file); }
  catch (e) { if (e.code !== 'ENOENT') throw e; return path.join(await futureRealpath(path.dirname(file)), path.basename(file)); }
}
async function main() {
  const opts = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (!['--repo', '--cache-dir'].includes(key) || !process.argv[i + 1] || process.argv[i + 1].startsWith('--')) throw Error('Usage: prepare-tools.mjs --repo PATH [--cache-dir EXTERNAL_DIRECTORY]');
    opts[key.slice(2)] = process.argv[++i];
  }
  if (!opts.repo) throw Error('--repo is required');
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (!(major === 20 && minor >= 19 || major === 22 && minor >= 12 || major >= 23)) throw Error('Tooling requires Node 20.19.x or Node 22.12+; use an available compatible runtime without changing the app runtime');
  const repo = await fs.realpath(opts.repo);
  const manifestText = await fs.readFile(new URL('./package.json', import.meta.url), 'utf8');
  const lockText = await fs.readFile(new URL('./package-lock.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(manifestText);
  const digest = hash(manifestText + lockText + process.platform + process.arch + major).slice(0, 24);
  const userKey = hash(os.homedir()).slice(0, 12);
  const base = path.resolve(opts['cache-dir'] || path.join(os.tmpdir(), 'repo-modernisation-' + userKey));
  const tools = await futureRealpath(path.join(base, 'tools-' + digest));
  if (within(tools, repo)) throw Error('Choose a tool cache outside the assessed repository');
  const markerFile = path.join(tools, 'runtime.json');
  const markerText = await read(markerFile);
  const marker = markerText ? JSON.parse(markerText) : null;
  if (marker && (marker.schema !== 'modernisation-tool-runtime/v1' || marker.digest !== digest)) throw Error('Tool cache identity does not match the bundled runtime');
  if (!marker) {
    try { if ((await fs.readdir(tools)).length) throw Error('Tool cache directory is not managed by this skill; choose another cache directory'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  async function versionsMatch() {
    if (!marker?.installed || await read(path.join(tools, 'package-lock.json')) !== lockText || await read(path.join(tools, 'package.json')) !== manifestText) return false;
    for (const [name, version] of Object.entries(manifest.dependencies)) {
      const data = await read(path.join(tools, 'node_modules', name, 'package.json'));
      if (!data || JSON.parse(data).version !== version) return false;
    }
    return true;
  }
  let reused = await versionsMatch();
  if (!reused) {
    await fs.mkdir(tools, { recursive: true, mode: 0o700 });
    await fs.writeFile(path.join(tools, 'package.json'), manifestText);
    await fs.writeFile(path.join(tools, 'package-lock.json'), lockText);
    await fs.writeFile(markerFile, JSON.stringify({ schema: 'modernisation-tool-runtime/v1', digest, installed: false }) + '\n');
    const command = await npmCommand(['ci', '--ignore-scripts', '--no-audit', '--no-fund']);
    process.stderr.write('Preparing external pinned assessment tools...\n');
    try { await exec(command.file, command.args, { cwd: tools, timeout: 180000, maxBuffer: 2 * 1024 * 1024 }); }
    catch (e) {
      const raw = String(e.stderr || '') + String(e.stdout || '');
      const reason = e.killed ? 'timeout' : /E401|E403|ENEEDAUTH/.test(raw) ? 'authentication-or-access' : /ENOTFOUND|EAI_AGAIN|ECONN|ENETUNREACH/.test(raw) ? 'network' : 'installation-failed';
      throw Error('Tool preparation failed: ' + reason + '; diagnose execution/network access using references/execution.md (raw npm errors omitted)');
    }
    for (const [name, version] of Object.entries(manifest.dependencies)) {
      const data = JSON.parse(await fs.readFile(path.join(tools, 'node_modules', name, 'package.json'), 'utf8'));
      if (data.version !== version) throw Error('Prepared tool version differs from bundled pin: ' + name);
    }
    await fs.writeFile(markerFile, JSON.stringify({ schema: 'modernisation-tool-runtime/v1', digest, installed: true }) + '\n');
  }
  console.log(JSON.stringify({ schema: 'modernisation-tool-runtime/v1', tools, reused, node: process.version, versions: manifest.dependencies }));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
