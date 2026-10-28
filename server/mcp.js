import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createStore } from './store.js';
import { createMcpServer } from './mcp-tools.js';
import { createClassroom } from './classroom.js';
const store = createStore();
const secret=process.env.KNOVINE_STUDENT_SESSION;
let scoped=store;
if(secret) {
  const classroom=createClassroom(store);
  classroom.authenticate(secret,'student');
  scoped={listClasses:()=>classroom.getClasses(secret),listObservations:()=>classroom.listMine(secret).map(o=>({...o,observation:o.summary,source:'external'})),observe:args=>classroom.addObservation(secret,args)};
}
const server = createMcpServer(scoped);
await server.connect(new StdioServerTransport());
