import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../server/store.js';
import {createClassroom} from '../server/classroom.js';
import {createLearning} from '../server/learning.js';
import {catalog,buildGraph,conceptId,findPath} from '../server/knowledge.js';
const observation={rawText:'Why is one half two quarters?',topic:'Equivalent fractions',signal:'question',observation:'Learner asked about equivalent representations.',path:['Fractions','Equivalent fractions']};
function setup(){const store=createStore(':memory:'),classroom=createClassroom(store),learning=createLearning(store,classroom);return {store,classroom,learning};}
test('large subject maps keep scope separate from assessed knowledge',()=>{
  const info=catalog();assert.ok(info.find(p=>p.id==='math').conceptCount>=150);assert.ok(info.find(p=>p.id==='english').conceptCount>=50);
  const empty=buildGraph('math');assert.equal(empty.observedCount,0);assert.ok(empty.nodes.every(n=>n.state==='unobserved'));
  const withQuestion=buildGraph('math',[{id:'e1',...observation}]);assert.equal(withQuestion.observedCount,1);assert.equal(withQuestion.nodes.find(n=>n.id===conceptId('Equivalent fractions')).state,'question');assert.equal(withQuestion.nodes.find(n=>n.id===conceptId('Fractions')).state,'unobserved');
  const path=findPath(empty,conceptId('Fractions'),conceptId('Equivalent fractions'));assert.deepEqual(path,['fractions','equivalentfractions']);
});
test('personal onboarding starts empty and keeps each learner isolated when scope changes',()=>{
  const {store,classroom,learning:l}=setup();try{
    const a=l.start({mode:'personal'}),b=l.start({mode:'personal',packId:'math'});
    assert.equal(l.state(a.token).graph.nodes.length,0);
    l.importGraph(a.token,null,{nodes:[{id:'f',label:'Fractions'},{id:'x',label:'My extra concept'}],edges:[{source:'f',target:'x'}]});
    classroom.addObservation(a.token,observation);
    assert.equal(l.state(a.token).graph.observedCount,1);assert.equal(l.state(b.token).observations.length,0);
    l.setProfile(a.token,{mode:'personal',packId:'math'});assert.equal(l.state(a.token).observations.length,1);
    const graph=l.state(a.token).graph;assert.ok(graph.nodes.length>=150);assert.equal(graph.nodes.filter(n=>n.label==='Fractions').length,1);assert.ok(graph.edges.some(e=>e.source==='fractions'&&graph.nodes.find(n=>n.id===e.target)?.label==='My extra concept'));
    assert.throws(()=>l.start({mode:'personal',role:'teacher'}),/INVALID_PROFILE/);
  }finally{store.close();}
});
test('school and academy course scopes inherit to members, obey consent, and reject cross-class access',()=>{
  const {store,classroom:c,learning:l}=setup();try{
    for(const mode of ['school','academy']){
      const t=l.start({mode,role:'teacher',packId:'math',title:mode+' class'}),other=l.start({mode,role:'teacher',packId:'english'});
      const s=l.start({mode,invite:c.createInvite(t.token,t.classId).invite});
      c.addObservation(s.token,{...observation,classId:t.classId});
      assert.equal(l.state(s.token,t.classId).graph.id,'math');assert.equal(l.graph(t.token,t.classId).observedCount,0);
      c.setSharing(s.token,t.classId,true);assert.equal(l.graph(t.token,t.classId).observedCount,1);
      c.setSharing(s.token,t.classId,false);assert.equal(l.graph(t.token,t.classId).observedCount,0);
      assert.throws(()=>l.graph(other.token,t.classId),/FORBIDDEN/);
      assert.throws(()=>l.setClassScope(s.token,{classId:t.classId,mode,packId:'english'}),/UNAUTHORIZED/);
      assert.throws(()=>c.addObservation(s.token,{...observation,classId:other.classId}),/FORBIDDEN/);
    }
  }finally{store.close();}
});
test('teacher-approved custom scope reaches the class and learner evidence attaches by label',()=>{
  const {store,classroom:c,learning:l}=setup();try{
    const t=l.start({mode:'academy',role:'teacher',title:'Biology'}),s=l.start({mode:'academy',invite:c.createInvite(t.token,t.classId).invite});
    const data={nodes:[{id:'cell',label:'Cells'},{id:'membrane',label:'Cell membranes'}],edges:[{source:'cell',target:'membrane'}]};
    l.importGraph(t.token,t.classId,data);assert.ok(l.graph(s.token,t.classId).nodes.some(n=>n.label==='Cells'));
    c.addObservation(s.token,{...observation,classId:t.classId,topic:'Cells',path:['Cells','Cell membranes']});
    const g=l.graph(s.token,t.classId);assert.equal(g.nodes.find(n=>n.label==='Cells').state,'question');assert.equal(g.nodes.filter(n=>n.label==='Cells').length,1);
    assert.throws(()=>l.importGraph(s.token,t.classId,data),/UNAUTHORIZED/);
    assert.throws(()=>l.importGraph(t.token,t.classId,{...data,edges:[{source:'cell',target:'missing'}]}),/INVALID_GRAPH/);
    assert.equal(l.graph(s.token,t.classId).nodes.length,2);
    l.importGraph(t.token,t.classId,{nodes:[{id:'cell',label:'Osmosis'}],edges:[]});assert.equal(l.graph(s.token,t.classId).nodes.length,3);assert.ok(l.graph(s.token,t.classId).nodes.some(n=>n.label==='Cells'));
  }finally{store.close();}
});
test('in-app model turns and MCP observations share the learner store without leaking private moments to teachers',()=>{
  const {store,classroom:c,learning:l}=setup();try{
    const t=l.start({mode:'school',role:'teacher'}),s=l.start({mode:'school',invite:c.createInvite(t.token,t.classId).invite});
    const result={...observation,answer:'Both represent the same amount.',teachingSuggestion:'Ask for a drawing.',modelInfo:{provider:'meta',model:'muse-spark-1.3'}};
    l.saveTurn(s.token,{question:observation.rawText,result});assert.equal(l.state(s.token).turns.length,1);
    l.saveTurn(s.token,{question:observation.rawText,result,classId:t.classId});assert.equal(l.state(s.token,t.classId).turns.length,1);
    c.setSharing(s.token,t.classId,true);assert.equal(c.roster(t.token,t.classId)[0].observations.length,1);assert.equal(l.state(s.token).observations.length,2);
    assert.equal(l.state(s.token).observations[0].source,'meta');
  }finally{store.close();}
});
test('duplicate observations cannot silently move between private learning and a class',()=>{
  const {store,classroom:c,learning:l}=setup();try{
    const t=l.start({mode:'school',role:'teacher'}),s=l.start({mode:'school',invite:c.createInvite(t.token,t.classId).invite});
    c.addObservation(s.token,{...observation,externalId:'fixed'});
    assert.throws(()=>c.addObservation(s.token,{...observation,externalId:'fixed',classId:t.classId}),/INVALID_DUPLICATE_SCOPE/);
    assert.equal(l.state(s.token,t.classId).observations.length,0);
  }finally{store.close();}
});

test('the newest evidence is shown without erasing the earlier question',()=>{
  const graph=buildGraph('math',[{id:'old',...observation,createdAt:'2026-10-01T00:00:00Z'},{id:'new',...observation,signal:'learner_explanation',rawText:'Both have the same shaded area.',createdAt:'2026-11-01T00:00:00Z'}]);
  const node=graph.nodes.find(n=>n.id===conceptId('Equivalent fractions'));assert.equal(node.state,'explained');assert.equal(node.evidence.length,2);assert.equal(node.evidence[0].id,'new');
});
