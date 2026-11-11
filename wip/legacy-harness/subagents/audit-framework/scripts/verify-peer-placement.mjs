#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { writeArtifact } from './write-artifact.mjs';
const o={};
for(let i=2;i<process.argv.length;i++){const k=process.argv[i];if(!['--repo','--graph','--tools','--out'].includes(k)||!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw Error('Usage: verify-peer-placement.mjs --repo PATH --graph FILE --tools EXTERNAL_RUNTIME --out FILE');o[k.slice(2)]=process.argv[++i];}
for(const k of ['repo','graph','tools','out'])if(!o[k])throw Error('Missing --'+k);
const repo=await fs.realpath(o.repo),tools=await fs.realpath(o.tools);
if(tools===repo||tools.startsWith(repo+path.sep))throw Error('Tool runtime must be external');
const requireTool=createRequire(path.join(tools,'package.json')),semver=requireTool('semver');
const expected=JSON.parse(await fs.readFile(new URL('./package.json',import.meta.url),'utf8')).dependencies.semver;
if(requireTool('semver/package.json').version!==expected)throw Error('Use the skill-pinned semver runtime');
const read=async p=>{try{return JSON.parse(await fs.readFile(p,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}};
const graph=await read(o.graph);if(graph?.schema!=='modernisation-peer-graph/v1')throw Error('Unsupported peer graph');
const hash=s=>createHash('sha256').update(s).digest('hex');
if(hash(await fs.readFile(path.join(repo,'package.json')))!==graph.manifestSha256)throw Error('Manifest differs from graph evidence');
const atRoot=createRequire(path.join(repo,'package.json'));
async function locate(req,name){
 // Node package search paths allow metadata inspection even when exports hides package.json.
 for(const dir of req.resolve.paths(name)||[]){const file=path.join(dir,name,'package.json'),p=await read(file);if(p?.name===name)return {file,version:p.version};}
 return null;
}
const observations=[];
for(const edge of graph.peerEdges){
 const source=await locate(atRoot,edge.source);
 const row={source:edge.source,selectedSource:edge.sourceVersion,installedSource:source?.version??null,peer:edge.peer,range:edge.range,optional:edge.optional,graphState:edge.state};
 if(!source||source.version!==edge.sourceVersion){observations.push({...row,state:'source-not-comparable',reason:source?'Installed consumer differs from selected version':'Consumer not installed'});continue;}
 const peer=await locate(createRequire(source.file),edge.peer);
 if(!peer){observations.push({...row,state:edge.optional?'optional-absent':'required-peer-missing',installedPeer:null});continue;}
 const valid=semver.valid(peer.version)&&semver.validRange(edge.range);
 observations.push({...row,installedPeer:peer.version,peerManifest:path.relative(repo,peer.file),state:!valid?'unsupported-range':semver.satisfies(peer.version,edge.range)?'observed-compatible':'observed-conflict'});
}
const counts={};for(const x of observations)counts[x.state]=(counts[x.state]||0)+1;
await writeArtifact(o.out,{schema:'modernisation-peer-placement/v1',assessedAt:new Date().toISOString(),repository:repo,graphCommit:graph.evidenceCommit,manifestSha256:graph.manifestSha256,node:process.version,semver:expected,counts,observations,limitations:['Reads package metadata from Node consumer-relative search paths; does not execute packages.','An installed matching consumer is an observation of this installed tree, not proof of the future Yarn resolution.','Bundler aliases, export conditions and runtime contracts need separate verification.','Optional absence is not a blocker; an installed incompatible optional peer requires feature/context review, not automatic dismissal.','No compatibility exception or target-met verdict is granted by this script.']});
console.log('Consumer-relative peer observations: '+JSON.stringify(counts));
