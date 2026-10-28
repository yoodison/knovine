import { spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const healthFile=resolve(root,'data/tunnel-health.url');
let child=null,lastExit=null,mode=null;
export function startTunnel(apiKey,studentSession) {
  if(typeof apiKey!=='string'||apiKey.length<20||apiKey.length>500)throw Error('INVALID_TUNNEL_KEY');
  if(child)throw Error('INVALID_TUNNEL_RUNNING');
  rmSync(healthFile,{force:true});
  mode=studentSession?'student':'personal';lastExit=null;
  const env={...process.env,CONTROL_PLANE_API_KEY:apiKey};
  if(studentSession)env.KNOVINE_STUDENT_SESSION=studentSession;else delete env.KNOVINE_STUDENT_SESSION;
  child=spawn(resolve(root,'data/bin/tunnel-client'),['run','--profile','knovine','--profile-dir',resolve(root,'data/tunnel-profile'),'--health.url-file',healthFile],{cwd:root,env,stdio:'ignore'});
  child.once('error',()=>{lastExit='startup_failed';child=null;});
  child.once('exit',(code)=>{lastExit=code===0?'stopped':'failed';child=null;});
  return {started:true,mode};
}
export async function tunnelStatus() {
  if(!child)return {running:false,ready:false,lastExit};
  try {const url=readFileSync(healthFile,'utf8').trim();if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(url))throw Error('bad health url');const response=await fetch(url+'/readyz',{signal:AbortSignal.timeout(1500)});return {running:true,ready:response.ok,mode};} catch{return {running:true,ready:false,mode};}
}
export function stopTunnel(){if(child)child.kill('SIGTERM');return {stopping:true};}

process.once('exit',()=>{if(child)child.kill('SIGTERM');});
