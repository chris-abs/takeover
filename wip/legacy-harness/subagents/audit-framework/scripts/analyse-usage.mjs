#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { writeArtifact } from './write-artifact.mjs';
const exec = promisify(execFile);
const hash = s => createHash('sha256').update(s).digest('hex');
const read = async p => { try { return await fs.readFile(p, 'utf8'); } catch(e) { if(e.code === 'ENOENT') return null; throw e; } };
const options = {};
for(let i=2;i<process.argv.length;i++) {
  const key=process.argv[i];
  if(!['--repo','--out','--config','--tools'].includes(key) || !process.argv[i+1] || process.argv[i+1].startsWith('--')) throw new Error('Usage: analyse-usage.mjs --repo PATH --out FILE --config EXTERNAL.json --tools EXTERNAL_RUNTIME');
  options[key.slice(2)]=process.argv[++i];
}
for(const key of ['repo','out','config','tools']) if(!options[key]) throw new Error(`Missing --${key}`);
const repo=await fs.realpath(options.repo), tools=await fs.realpath(options.tools), config=await fs.realpath(options.config);
const within = (child,parent) => child===parent || child.startsWith(parent+path.sep);
if(within(tools,repo) || within(config,repo)) throw new Error('Tool installation and assessment configuration must be outside the assessed repo');
if(!config.endsWith('.json')) throw new Error('Use a JSON assessment configuration');
const configText=await fs.readFile(config,'utf8');
JSON.parse(configText);
const expected=JSON.parse(await fs.readFile(new URL('./package.json',import.meta.url),'utf8')).dependencies.knip;
const knipRoot=path.join(tools,'node_modules','knip');
const knipPackage=JSON.parse(await fs.readFile(path.join(knipRoot,'package.json'),'utf8'));
if(knipPackage.version!==expected) throw new Error(`Expected skill-pinned Knip ${expected}; external runtime has ${knipPackage.version}`);
const bin=typeof knipPackage.bin==='string' ? knipPackage.bin : knipPackage.bin.knip;
const cli=path.resolve(knipRoot,bin);
async function git(args) { try { return (await exec('git',args,{cwd:repo,maxBuffer:32*1024*1024})).stdout; } catch { return null; } }
async function identity() {
  const manifest=await read(path.join(repo,'package.json'));
  if(!manifest) throw new Error('No package.json in target repo');
  const locks={};
  for(const file of ['yarn.lock','package-lock.json','pnpm-lock.yaml']) {const value=await read(path.join(repo,file)); if(value!==null) locks[file]=hash(value);}
  const diff=await git(['diff','HEAD','--no-ext-diff','--no-textconv']);
  return {head:(await git(['rev-parse','HEAD']))?.trim() ?? null, status:(await git(['status','--porcelain']))?.trim() ?? null, trackedDiffSha256:diff===null?null:hash(diff),manifestSha256:hash(manifest),locks};
}
const before=await identity();
const runs={};
for(const mode of ['full','production']) {
  const args=[cli,'--directory',repo,'--config',config,'--reporter','json','--no-progress','--no-exit-code',...(mode==='production'?['--production']:[])];
  let stdout='', exitCode=0, failure=null;
  try { ({stdout}=await exec(process.execPath,args,{cwd:repo,env:{...process.env,NO_COLOR:'1'},timeout:180000,maxBuffer:64*1024*1024})); }
  catch(e) { stdout=e.stdout || ''; exitCode=Number.isInteger(e.code)?e.code:null; failure=e.killed?'timeout':'execution-failed'; }
  let findings=null;
  if(!failure) {try { findings=JSON.parse(stdout); if(!findings || !Array.isArray(findings.issues)) throw new Error('Unsupported JSON'); } catch {failure='invalid-or-unsupported-json';}}
  const counts={};
  for(const issue of findings?.issues ?? []) for(const [kind,items] of Object.entries(issue)) if(kind!=='owners' && Array.isArray(items)) counts[kind]=(counts[kind] || 0)+items.length;
  runs[mode]={status:failure?'blocked':'analysed',exitCode,failure,counts,findings};
  console.log(`${mode}: ${runs[mode].status}; ${JSON.stringify(counts)}`);
}
const after=await identity();
const result={schema:'modernisation-usage/v1',assessedAt:new Date().toISOString(),repository:repo,node:process.version,knip:expected,config:{path:config,sha256:hash(configText),content:JSON.parse(configText)},inputs:before,inputsAfter:after,trackedInputsUnchanged:JSON.stringify(before)===JSON.stringify(after),runs,limitations:['Findings are candidates, not deletion approval.','Production-only findings may be used by tests or tooling.','Standard JSON findings are not a full import graph.','Configuration plugins can evaluate project configuration; analysis does not enable fixes or caching.','Untracked file contents and installed dependency contents are not fingerprinted; rerun after changes.']};
await writeArtifact(options.out,result);
if(Object.values(runs).some(x=>x.status==='blocked') || !result.trackedInputsUnchanged) process.exitCode=2;
