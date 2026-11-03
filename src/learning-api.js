export const currentToken=()=>sessionStorage.getItem('knovine-classroom-session')||localStorage.getItem('knovine-device-session')||'';
export function savedWorkspaces(){const local=JSON.parse(localStorage.getItem('knovine-workspaces')||'[]'),session=JSON.parse(sessionStorage.getItem('knovine-workspaces')||'[]');return [...new Map([...local,...session].map(w=>[w.actor.id,w])).values()];}
export function selectWorkspace(token){sessionStorage.setItem('knovine-classroom-session',token);localStorage.setItem('knovine-device-session',token);window.dispatchEvent(new Event('knovine-session'));}
export async function learningRequest(path,body,token=currentToken()){
  let r,d;try{r=await fetch('/api/'+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});d=await r.json();}catch{throw Error('Could not reach your workspace. Please try again.');}
  if(!r.ok){const error=Error(d.error||'Could not complete the request.');error.status=r.status;throw error;}return d;
}
export function rememberWorkspace(d){
  const profiles=savedWorkspaces(),item={token:d.token,actor:d.actor,profile:d.profile,classId:d.classId||null};
  const list=JSON.stringify([...profiles.filter(p=>p.actor.id!==d.actor.id),item]);sessionStorage.setItem('knovine-workspaces',list);localStorage.setItem('knovine-workspaces',list);
  selectWorkspace(d.token);return item;
}
