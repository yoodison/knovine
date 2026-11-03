import React,{useState} from 'react';
import {Download} from 'lucide-react';
import {learningRequest} from './learning-api.js';
export default function LocalMcpSetup(){
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
  async function download(){setBusy(true);setError('');try{const d=await learningRequest('learning/connector',{});const url=URL.createObjectURL(new Blob([JSON.stringify(d.config,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='knovine-mcp-config.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setSaved(true);}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <details className="local-mcp-setup"><summary>Connect this learner account</summary><p>This local configuration lets your MCP client read and write this learner’s records. Keep it private. Class sharing is controlled separately.</p><button className="outline" onClick={download} disabled={busy}><Download size={14}/>{busy?'Preparing…':'Download local MCP config'}</button>{saved&&<p role="status">Configuration downloaded. Merge its mcpServers entry into your client settings and restart the client. This does not connect the consumer website.</p>}{error&&<p className="error" role="alert">{error}</p>}</details>;
}
