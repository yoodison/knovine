// The client's /readyz checks local startup, not control-plane authentication.
// Track completed polls so an invalid key cannot appear as a connected tunnel.
export function createPollMonitor() {
  let counts=new Map(),state={ready:false,error:null};
  return metrics=>{
    const next=new Map();
    for(const line of metrics.split('\n')){
      if(!line.startsWith('http_client_request_duration_seconds_count{')||!line.includes('/poll"'))continue;
      const status=Number(line.match(/http_response_status_code="(\d+)"/)?.[1]);
      const count=Number(line.slice(line.lastIndexOf(' ')+1));
      if(Number.isFinite(status)&&Number.isFinite(count))next.set(status,(next.get(status)||0)+count);
    }
    const changed=[...next].filter(([status,count])=>count>(counts.get(status)||0)).map(([status])=>status);
    counts=next;
    if(changed.some(status=>status===401||status===403))state={ready:false,error:'OpenAI rejected the tunnel key or its permissions. Stop the tunnel and enter your tunnel-only key again.'};
    else if(changed.some(status=>status>=400))state={ready:false,error:'The tunnel could not reach OpenAI. Check the connection and try again.'};
    else if(changed.some(status=>status>=200&&status<300))state={ready:true,error:null};
    return {...state};
  };
}
