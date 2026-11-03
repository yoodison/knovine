// A deterministic clustered layout: the same scope stays still as evidence arrives.
export function layoutGraph(nodes,groups,edges){
  const domains=new Map(nodes.map(n=>[n.id,n.group]));
  const height=Math.max(1000,Math.ceil(groups.length/2)*490+100),positions=new Map(),anchors=new Map();
  groups.forEach((g,gi)=>{const members=nodes.filter(n=>n.group===g.id),cx=groups.length===1?720:390+(gi%2)*660,cy=groups.length===1?height/2:300+Math.floor(gi/2)*490;
    members.forEach((n,i)=>{const angle=i*2.399963,r=Math.sqrt(i+1)*29;positions.set(n.id,{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r});anchors.set(n.id,{x:cx,y:cy});});});
  for(let step=0;step<65;step++){
    const forces=new Map(nodes.map(n=>[n.id,{x:0,y:0}]));
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=positions.get(nodes[i].id),b=positions.get(nodes[j].id);if(!a||!b)continue;const dx=a.x-b.x,dy=a.y-b.y,d2=Math.max(36,dx*dx+dy*dy),force=Math.min(6,2100/d2);const d=Math.sqrt(d2),f=forces.get(nodes[i].id),g=forces.get(nodes[j].id);f.x+=dx/d*force;f.y+=dy/d*force;g.x-=dx/d*force;g.y-=dy/d*force;}
    for(const e of edges){const a=positions.get(e.source),b=positions.get(e.target);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy)),weight=(domains.get(e.source)===domains.get(e.target)?0.018:0.004);const strength=(d-70)*(weight||.012);forces.get(e.source).x+=dx/d*strength;forces.get(e.source).y+=dy/d*strength;forces.get(e.target).x-=dx/d*strength;forces.get(e.target).y-=dy/d*strength;}
    for(const n of nodes){const p=positions.get(n.id),a=anchors.get(n.id),f=forces.get(n.id);if(!p)continue;p.x=Math.min(1375,Math.max(65,p.x+f.x+(a.x-p.x)*.008));p.y=Math.min(height-65,Math.max(95,p.y+f.y+(a.y-p.y)*.008));}
  }
  return {positions,height};
}
