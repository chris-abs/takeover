#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
const hash = s => createHash('sha256').update(s).digest('hex');
const within = (child, parent) => { const r = path.relative(parent,child); return !r || !path.isAbsolute(r) && r !== '..' && !r.startsWith('..' + path.sep); };
async function futureRealpath(file) {
  try { return await fs.realpath(file); }
  catch (e) { if(e.code!=='ENOENT')throw e;return path.join(await futureRealpath(path.dirname(file)),path.basename(file)); }
}
async function main() {
  const opts={};
  for(let i=2;i<process.argv.length;i++){
    const key=process.argv[i];
    if(!['--repo','--report','--cache-dir'].includes(key)||!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw Error('Usage: prepare-output.mjs --repo PATH [--report FILE.md] [--cache-dir EXTERNAL_DIRECTORY]');
    opts[key.slice(2)]=process.argv[++i];
  }
  if(!opts.repo)throw Error('--repo is required');
  const repo=await fs.realpath(opts.repo);
  const report=path.resolve(repo,opts.report||'docs/modernisation-assessment.md');
  if(!report.toLowerCase().endsWith('.md'))throw Error('The published report must be a Markdown file');
  const systemCache=process.platform==='darwin'?path.join(os.homedir(),'Library','Caches'):process.platform==='win32'?(process.env.LOCALAPPDATA||path.join(os.homedir(),'.cache')):(process.env.XDG_CACHE_HOME||path.join(os.homedir(),'.cache'));
  const base=await futureRealpath(path.resolve(opts['cache-dir']||path.join(systemCache,'repo-modernisation-assessor')));
  if(within(base,repo))throw Error('Investigation cache must be outside the assessed repository');
  const name=path.basename(repo).replace(/[^a-z0-9._-]/gi,'-')||'repo';
  const group=path.join(base,'runs',name+'-'+hash(repo).slice(0,12));
  await fs.mkdir(group,{recursive:true,mode:0o700});
  const workDirectory=await fs.mkdtemp(path.join(group,'run-'));
  const result={schema:'modernisation-run-locations/v1',createdAt:new Date().toISOString(),repository:repo,report,outputDirectory:path.dirname(report),workDirectory,cacheDirectory:base,publicationPolicy:'Publish only the assessment Markdown and optional cleanup Markdown; keep raw data, configs, logs, tarballs and probe code in workDirectory.'};
  await fs.writeFile(path.join(workDirectory,'run.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
