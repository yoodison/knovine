import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { createStore } from '../server/store.js';

test('external MCP write is durable, deduplicated and visible to the same local service', async () => {
  const dir=mkdtempSync(join(tmpdir(),'knovine-')), file=join(dir,'state.sqlite');
  const store=createStore(file); const client=new Client({name:'integration-test',version:'1'});
  const transport=new StdioClientTransport({command:process.execPath,args:[resolve('server/mcp.js')],env:{...process.env,KNOVINE_DB:file},stderr:'pipe'});
  try {
    await client.connect(transport);
    const tools=await client.listTools(); assert.deepEqual(tools.tools.map(t=>t.name).sort(),['get_learning_context','get_learning_path','record_learning_observation']);
    const args={rawText:'왜 비율이 달라지죠?',topic:'비율',signal:'question',observation:'비율이 달라지는 이유를 질문함',path:['분수','비율'],externalId:'test-event-1'};
    const first=await client.callTool({name:'record_learning_observation',arguments:args});
    assert.equal(first.isError,undefined);
    const second=await client.callTool({name:'record_learning_observation',arguments:args});
    assert.equal(second.structuredContent.observation.duplicate,true);
    const records=store.listObservations(); assert.equal(records.length,1);assert.equal(records[0].signal,'question');assert.equal(records[0].rawText,args.rawText);
    const context=await client.callTool({name:'get_learning_context',arguments:{topic:'비율'}});assert.equal(context.structuredContent.observations.length,1);
    const path=await client.callTool({name:'get_learning_path',arguments:{topic:'비율'}});assert.deepEqual(path.structuredContent.paths[0].path,['분수','비율']);
  } finally {await client.close();store.close();rmSync(dir,{recursive:true,force:true});}
});

test('teacher plan preserves the baseline and revisions, and sharing defaults off',()=>{
  const store=createStore(':memory:');
  try {assert.equal(store.isShared(),false);store.setShare(true);assert.equal(store.isShared(),true);const p=store.putPlan({title:'비율',content:'목표: 비율을 설명한다.'});const updated=store.acceptPlan(p.id,'목표: 비율을 설명한다.\n복습: 분수','학습 단서를 반영');assert.equal(updated.baseline,'목표: 비율을 설명한다.');assert.match(updated.current,/복습/);assert.equal(updated.versions.length,1);store.setShare(false);assert.equal(store.isShared(),false);} finally {store.close();}
});

test('local streamable HTTP exposes the same tools, writes state and rejects browser origins',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'knovine-http-')),file=join(dir,'state.sqlite');
  const probe=net.createServer(); await new Promise(r=>probe.listen(0,'127.0.0.1',r)); const port=probe.address().port; await new Promise(r=>probe.close(r));
  const child=spawn(process.execPath,[resolve('server/mcp-http.js')],{env:{...process.env,KNOVINE_DB:file,MCP_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  const client=new Client({name:'http-integration-test',version:'1'});const transport=new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`));
  try {
    await new Promise((resolveReady,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('server startup timeout')),6000);child.stdout.on('data',chunk=>{output+=chunk;if(output.includes('listening')){clearTimeout(timer);resolveReady();}});child.on('exit',code=>{clearTimeout(timer);reject(new Error(`server exit ${code}`));});});
    await client.connect(transport); const names=(await client.listTools()).tools.map(t=>t.name);assert.ok(names.includes('record_learning_observation'));
    const r=await client.callTool({name:'record_learning_observation',arguments:{rawText:'What is a fraction?',topic:'fractions',signal:'question',observation:'Asked about fractions'}});assert.equal(r.structuredContent.observation.source,'external');
    const store=createStore(file);try{assert.equal(store.listObservations().length,1);}finally{store.close();}
    const blocked=await fetch(`http://127.0.0.1:${port}/mcp`,{method:'POST',headers:{Origin:'https://untrusted.example'}});assert.equal(blocked.status,403);
  } finally {await client.close();child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));rmSync(dir,{recursive:true,force:true});}
});
