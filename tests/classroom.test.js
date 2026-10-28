import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../server/store.js';
import { createClassroom } from '../server/classroom.js';

test('class records require per-class enrollment, sharing, and teacher ownership',()=>{
  const store=createStore(':memory:'), c=createClassroom(store);
  const t=c.createAccount('교사','teacher').token, t2=c.createAccount('다른 교사','teacher').token;
  const s=c.createAccount('학생','student').token, s2=c.createAccount('다른 학생','student').token;
  const a=c.createClass(t,'수학').id, b=c.createClass(t2,'과학').id;
  const inv=c.createInvite(t,a).invite;c.joinClass(s,inv);assert.throws(()=>c.joinClass(s2,inv),/INVALID_INVITE/);
  c.joinClass(s,c.createInvite(t2,b).invite);
  const obs=(classId,topic,externalId)=>c.addObservation(s,{classId,topic,signal:'question',rawText:`${topic} 질문`,observation:`${topic} 관찰`,path:[topic],externalId});
  obs(a,'분수','a');obs(b,'원자','b');obs(undefined,'개인','c');
  assert.equal(c.roster(t,a)[0].observations.length,0);
  c.setSharing(s,a,true);assert.deepEqual(c.roster(t,a)[0].observations.map(o=>o.topic),['분수']);
  assert.equal(c.roster(t2,b)[0].observations.length,0);
  assert.throws(()=>c.roster(t,b),/FORBIDDEN/);
  assert.throws(()=>c.addObservation(s2,{classId:a,topic:'x',signal:'question',rawText:'x',observation:'x'}),/FORBIDDEN/);
  assert.equal(obs(a,'분수','a').duplicate,true);
  c.setSharing(s,a,false);assert.equal(c.roster(t,a)[0].observations.length,0);
  assert.throws(()=>c.listMine('bad'),/UNAUTHORIZED/);store.close();
});

test('lesson revisions require the owner and preserve the original',()=>{
  const store=createStore(':memory:'),c=createClassroom(store);
  const t=c.createAccount('교사','teacher').token,other=c.createAccount('다른 교사','teacher').token;
  const id=c.createClass(t,'수학').id,l=c.addLesson(t,id,'분수 수업','기존 수업');
  assert.throws(()=>c.acceptLesson(other,l.id,'변경','이유'),/FORBIDDEN/);
  const revised=c.acceptLesson(t,l.id,'검토한 수업','질문을 반영함');
  assert.equal(revised.original,'기존 수업');assert.equal(revised.current,'검토한 수업');assert.equal(revised.versions.length,1);store.close();
});

test('student-scoped MCP writes only that student and shares only with the chosen class',async()=>{
  const {mkdtempSync,rmSync}=await import('node:fs'),{tmpdir}=await import('node:os'),{join,resolve}=await import('node:path');
  const {Client}=await import('@modelcontextprotocol/sdk/client/index.js'),{StdioClientTransport}=await import('@modelcontextprotocol/sdk/client/stdio.js');
  const dir=mkdtempSync(join(tmpdir(),'knovine-class-mcp-')),file=join(dir,'state.sqlite'),store=createStore(file),c=createClassroom(store);
  const teacher=c.createAccount('교사','teacher').token,student=c.createAccount('학생','student').token,other=c.createAccount('다른 학생','student').token;
  const classId=c.createClass(teacher,'수학').id;c.joinClass(student,c.createInvite(teacher,classId).invite);c.setSharing(student,classId,true);
  const client=new Client({name:'classroom-test',version:'1'}),transport=new StdioClientTransport({command:process.execPath,args:[resolve('server/mcp.js')],env:{...process.env,KNOVINE_DB:file,KNOVINE_STUDENT_SESSION:student},stderr:'pipe'});
  try{await client.connect(transport);const result=await client.callTool({name:'record_learning_observation',arguments:{classId,rawText:'분수가 왜 필요한가요?',topic:'분수',signal:'question',observation:'분수의 필요성을 질문함'}});assert.equal(result.isError,undefined);assert.equal(c.roster(teacher,classId)[0].observations[0].topic,'분수');assert.equal(c.listMine(other).length,0);const context=await client.callTool({name:'get_learning_context',arguments:{}});assert.equal(context.structuredContent.observations.length,1);}
  finally{await client.close();store.close();rmSync(dir,{recursive:true,force:true});}
});
