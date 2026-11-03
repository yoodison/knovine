import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createStore } from './store.js';
import { createMcpServer } from './mcp-tools.js';
import { createClassroom } from './classroom.js';
import {createLearning} from './learning.js';
import {buildGraph} from './knowledge.js';
import {readFileSync} from 'node:fs';
const store = createStore();
let secret=process.env.KNOVINE_STUDENT_SESSION;
if(process.env.KNOVINE_PROFILE_FILE){try{secret=JSON.parse(readFileSync(process.env.KNOVINE_PROFILE_FILE,'utf8')).studentSession;if(typeof secret!=='string')throw Error();}catch{throw Error('Invalid local learner profile. Reconnect this learner in Knovine.');}}
let scoped={...store,getGraph:()=>buildGraph('discovery',store.listObservations())};
if(secret) {
  const classroom=createClassroom(store);
  classroom.authenticate(secret,'student');
  const learning=createLearning(store,classroom);
  scoped={listClasses:()=>classroom.getClasses(secret),listObservations:({classId}={})=>{if(classId)learning.scope(secret,classId);return classroom.listMine(secret).filter(o=>!classId||o.classId===classId).map(o=>({...o,observation:o.summary}));},observe:args=>classroom.addObservation(secret,args),getGraph:classId=>learning.graph(secret,classId)};
}
const server = createMcpServer(scoped);
await server.connect(new StdioServerTransport());
