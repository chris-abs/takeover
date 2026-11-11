#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
const exec = promisify(execFile);
export function revealCommand(report, platform = process.platform, env = process.env) {
  if (platform === 'darwin') return { file: 'open', args: ['-R', report] };
  if (platform === 'win32') return { file: 'explorer.exe', args: [path.dirname(report)] };
  if (platform === 'linux' && (env.DISPLAY || env.WAYLAND_DISPLAY)) return { file: 'xdg-open', args: [path.dirname(report)] };
  return null;
}
async function main() {
  if (process.argv.length !== 4 || process.argv[2] !== '--report') throw Error('Usage: reveal-output.mjs --report SAVED_REPORT_FILE');
  const report = await fs.realpath(process.argv[3]);
  if (!(await fs.stat(report)).isFile()) throw Error('Save and verify the report file before revealing its folder');
  const directory = path.dirname(report), command = revealCommand(report);
  if (!command) {
    console.log(JSON.stringify({ report, directory, status: 'not-available', reason: 'No supported desktop file manager; return the report and output-folder links.' }));
    return;
  }
  try {
    await exec(command.file, command.args, { timeout: 10000, maxBuffer: 64 * 1024 });
    console.log(JSON.stringify({ report, directory, status: 'reveal-requested' }));
  } catch {
    // Opening a desktop folder is a convenience, never a report-completion gate.
    console.log(JSON.stringify({ report, directory, status: 'not-opened', reason: 'Desktop launch unavailable or denied; return the report and output-folder links.' }));
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e.message); process.exitCode = 1; });
