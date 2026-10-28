import React, {useState} from 'react';
import {ArrowLeft, ArrowRight, ChevronRight, Sparkles} from 'lucide-react';
import TunnelPanel from './TunnelPanel.jsx';

export const aiProviders = [
  {id:'muse', name:'Muse', mark:'m', note:'Planned'},
  {id:'chatgpt', name:'ChatGPT', mark:'g', note:'Private connector'},
  {id:'claude', name:'Claude', mark:'c', note:'Local setup'},
];

export default function AIConnections({initial='', configured, onMeta}) {
  const [selected, setSelected] = useState(initial);
  return <div className="ai-connections">
    {!selected ? <>
      <button className="in-app-model" onClick={onMeta}>
        <Sparkles size={18}/><span><b>Learn here with Muse Spark</b><small>{configured?'API key verified':'Connect Meta to begin'}</small></span><ArrowRight size={17}/>
      </button>
      <p className="connection-section-label">Or bring your AI</p>
      <div className="provider-list">{aiProviders.map(p=><button key={p.id} onClick={()=>setSelected(p.id)}>
        <span className={'provider-mark '+p.id}>{p.mark}</span><b>{p.name}</b><small>{p.note}</small><ChevronRight size={17}/>
      </button>)}</div>
    </> : <>
      <button className="quiet-button back-to-providers" onClick={()=>setSelected('')}><ArrowLeft size={15}/> All connections</button>
      {selected==='muse'&&<section className="provider-detail">
        <div className="provider-title"><span className="provider-mark muse">m</span><h3>Muse</h3><span className="tag">Planned</span></div>
        <h2>Learn in Muse.<br/>Keep the connections.</h2>
        <p>A shared learning map, wherever your curiosity takes you.</p>
        <details><summary>Connection status</summary><p>The external Muse connector is planned and is not connected yet. The goal is to read and save permitted learning observations from Muse conversations.</p><a href="https://platform.muse.ai/" target="_blank" rel="noreferrer">Muse Connector Platform <ArrowRight size={14}/></a></details>
        <button className="outline" onClick={onMeta}>Use Muse Spark here <ArrowRight size={15}/></button>
      </section>}
      {selected==='chatgpt'&&<TunnelPanel/>}
      {selected==='claude'&&<section className="provider-detail">
        <div className="provider-title"><span className="provider-mark claude">c</span><h3>Claude</h3><span className="tag">Setup required</span></div>
        <h2>Your next conversation.<br/>With more context.</h2>
        <p>Use Knovine’s local MCP tools with Claude Desktop.</p>
        <details><summary>Setup guide</summary><p>Configure the local server using the guide below. The MCP tools have been tested; Claude app verification is still pending. No connection is created by opening this screen.</p><a href="https://github.com/yoodison/knovine/blob/main/docs/CONNECTIONS.md#claude" target="_blank" rel="noreferrer">Open setup guide <ArrowRight size={14}/></a></details>
      </section>}
    </>}
    <details className="connection-privacy"><summary>Your sharing, your choice</summary><p>Only permitted tool calls read or save observations. Connecting an AI does not automatically import every conversation. Classroom sharing is controlled separately.</p></details>
  </div>;
}
