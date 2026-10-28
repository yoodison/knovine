import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../server/store.js';
import {createClassroom} from '../server/classroom.js';
import {createDemoClassroom} from '../server/demo.js';

test('sample class stays separate from existing classrooms and labels every raw example',()=>{
 const store=createStore(':memory:'),c=createClassroom(store);
 try{
  const existing=c.createAccount('Existing teacher','teacher');
  const existingClass=c.createClass(existing.token,'Existing class');
  const demo=createDemoClassroom(c);
  assert.deepEqual(c.getClasses(existing.token).map(x=>x.id),[existingClass.id]);
  assert.throws(()=>c.roster(existing.token,demo.classId),/FORBIDDEN/);
  const roster=c.roster(demo.token,demo.classId);
  assert.equal(roster.length,3);
  assert.ok(roster.every(s=>s.name.includes('(sample)')&&s.observations.every(o=>o.rawText.startsWith('[Fictional example]'))));
  assert.equal(c.getLessons(demo.token,demo.classId).length,1);
 }finally{store.close()}
});
