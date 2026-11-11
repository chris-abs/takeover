import fs from 'node:fs/promises';
import path from 'node:path';

async function present(file) {
  try { return (await fs.stat(file)).isFile(); }
  catch (e) { if (['ENOENT', 'ENOTDIR'].includes(e.code)) return false; throw e; }
}

// Use npm's JavaScript CLI where possible, including Windows npm.cmd installs.
// Running the CLI through the current Node avoids shell quoting and .cmd execution.
export async function npmCommand(args, { env = process.env, platform = process.platform } = {}) {
  if (env.npm_execpath && path.basename(env.npm_execpath) === 'npm-cli.js' && await present(env.npm_execpath)) {
    return { file: process.execPath, args: [env.npm_execpath, ...args] };
  }
  const key = Object.keys(env).find(k => k.toLowerCase() === 'path');
  const dirs = (env[key] || '').split(platform === 'win32' ? ';' : path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    const launcher = path.resolve(dir, platform === 'win32' ? 'npm.cmd' : 'npm');
    if (!await present(launcher)) continue;
    const real = await fs.realpath(launcher);
    if (/\.[cm]?js$/i.test(real)) return { file: process.execPath, args: [real, ...args] };
    for (const cli of [path.join(dir, 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.resolve(dir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')]) {
      if (await present(cli)) return { file: process.execPath, args: [cli, ...args] };
    }
    if (platform !== 'win32') return { file: launcher, args };
  }
  throw new Error('npm CLI not found on PATH; discover or enable an existing Node/npm installation');
}
