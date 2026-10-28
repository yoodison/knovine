// Local development transport only. Do not expose publicly: there is no user auth.
import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createStore } from './store.js';
import { createMcpServer } from './mcp-tools.js';

const port=Number(process.env.MCP_PORT||4177), store=createStore();
http.createServer(async(req,res)=>{
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host) || req.headers.origin) {res.writeHead(403).end();return;}
  if(req.url!=='/mcp'){res.writeHead(404).end();return;}
  if(req.method!=='POST'){res.writeHead(405,{'Content-Type':'application/json'}).end(JSON.stringify({jsonrpc:'2.0',error:{code:-32000,message:'Method not allowed'},id:null}));return;}
  const server=createMcpServer(store), transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
  try {await server.connect(transport);res.on('close',()=>{transport.close();server.close();});await transport.handleRequest(req,res);} catch {if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'}).end(JSON.stringify({jsonrpc:'2.0',error:{code:-32603,message:'Internal error'},id:null}));}
}).listen(port,'127.0.0.1',()=>console.log(`Local MCP HTTP listening on http://127.0.0.1:${port}/mcp`));
