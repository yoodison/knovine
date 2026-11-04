import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {createStore} from '../server/store.js';
import {createClassroom} from '../server/classroom.js';
import {createLearning} from '../server/learning.js';
import {createLocalConnector} from '../server/connector.js';

test('downloaded local configuration scopes a real MCP client to the learner and carries course graphs',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'knovine-profile-')),db=join(dir,'learning.sqlite'),store=createStore(db),c=createClassroom(store),l=createLearning(store,c);
  const t=l.start({mode:'school',role:'teacher',packId:'math'}),s=l.start({mode:'school',invite:c.createInvite(t.token,t.classId).invite}),stranger=l.start({mode:'school',role:'teacher'});
  const exported=createLocalConnector(c,s.token,{directory:join(dir,'profiles')}),config=exported.config.mcpServers.knovine;
  assert.ok(!JSON.stringify(exported).includes(s.token));assert.equal(statSync(config.env.KNOVINE_PROFILE_FILE).mode&0o777,0o600);
  assert.throws(()=>createLocalConnector(c,t.token,{directory:join(dir,'profiles')}),/UNAUTHORIZED/);
  const client=new Client({name:'universal-client-test',version:'1'}),transport=new StdioClientTransport({command:config.command,args:config.args,env:{...process.env,...config.env,KNOVINE_STUDENT_SESSION:stranger.token,KNOVINE_DB:db},stderr:'pipe'});
  try{
    await client.connect(transport);
    const graph=await client.callTool({name:'get_knowledge_graph',arguments:{classId:t.classId}});
    assert.equal(graph.structuredContent.nodes.length,155);
    const written=await client.callTool({name:'record_learning_observation',arguments:{classId:t.classId,rawText:'How can two fractions be equal?',topic:'Equivalent fractions',signal:'question',observation:'Asked about equivalent representations.',externalId:'from-client',path:['Fractions','Equivalent fractions']}});
    assert.ok(!written.isError);assert.equal(c.roster(t.token,t.classId)[0].observations.length,0);
    c.setSharing(s.token,t.classId,true);assert.equal(c.roster(t.token,t.classId)[0].observations.length,1);
    const context=await client.callTool({name:'get_learning_context',arguments:{classId:t.classId}});assert.equal(context.structuredContent.observations.length,1);
    c.addObservation(s.token,{rawText:'A private question',topic:'Private topic',signal:'question',observation:'Private learning only.',path:['Private start','Private topic']});
    const paths=await client.callTool({name:'get_learning_path',arguments:{classId:t.classId}});assert.equal(paths.structuredContent.paths.length,1);assert.equal(paths.structuredContent.paths[0].topic,'Equivalent fractions');
    const deniedPaths=await client.callTool({name:'get_learning_path',arguments:{classId:stranger.classId}});assert.equal(deniedPaths.isError,true);
    const denied=await client.callTool({name:'get_knowledge_graph',arguments:{classId:stranger.classId}});assert.equal(denied.isError,true);
    const updated=await client.callTool({name:'get_knowledge_graph',arguments:{classId:t.classId,topic:'Equivalent fractions'}});assert.equal(updated.structuredContent.nodes[0].state,'question');
    c.setSharing(s.token,t.classId,false);assert.equal(c.roster(t.token,t.classId)[0].observations.length,0);
  }finally{await client.close();store.close();rmSync(dir,{recursive:true,force:true});}
});
