import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createStore} from '../server/store.js';
import {createClassroom} from '../server/classroom.js';
import {createDemoBridge} from '../server/demo-bridge.js';

test('demo sends a real MCP write and preserves isolation, deduplication and sharing',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'knovine-bridge-'));
 const before=process.env.KNOVINE_DB;process.env.KNOVINE_DB=join(directory,'demo.sqlite');
 const store=createStore(),c=createClassroom(store),bridge=createDemoBridge(c);
 try{
  const d=bridge.start(),other=c.createAccount('Unrelated teacher','teacher');
  assert.throws(()=>bridge.share(other.token,false),/FORBIDDEN/);
  assert.equal(c.roster(d.token,d.classId)[0].observations.length,0);
  const result=await bridge.record(d.token);
  assert.equal(result.tool,'record_learning_observation');
  assert.equal(c.roster(d.token,d.classId)[0].observations.length,1);
  await bridge.record(d.token);
  assert.equal(c.roster(d.token,d.classId)[0].observations.length,1);
  bridge.share(d.token,false);assert.equal(c.roster(d.token,d.classId)[0].observations.length,0);
  bridge.share(d.token,true);assert.equal(c.roster(d.token,d.classId)[0].observations.length,1);
 }finally{store.close();if(before===undefined)delete process.env.KNOVINE_DB;else process.env.KNOVINE_DB=before;rmSync(directory,{recursive:true,force:true});}
});
