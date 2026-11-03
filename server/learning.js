import {buildGraph,getPack,conceptId} from './knowledge.js';
import {randomUUID,createHash} from 'node:crypto';
import {z} from 'zod';
const startSchema=z.strictObject({mode:z.enum(['personal','school','academy']).default('personal'),role:z.enum(['student','teacher']).default('student'),packId:z.string().max(80).default('discovery'),name:z.string().max(80).optional(),title:z.string().max(80).optional(),invite:z.string().max(160).optional()});
const customSchema=z.strictObject({nodes:z.array(z.strictObject({id:z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),label:z.string().trim().min(1).max(120)})).min(1).max(500),edges:z.array(z.strictObject({source:z.string().max(100),target:z.string().max(100)})).max(1500)});
export function createLearning(store,classroom){
  const db=store.db;
  db.exec(`CREATE TABLE IF NOT EXISTS learning_profiles(user_id TEXT PRIMARY KEY REFERENCES classroom_accounts(id), mode TEXT NOT NULL, pack_id TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS class_learning_scopes(class_id TEXT PRIMARY KEY REFERENCES classrooms(id), mode TEXT NOT NULL, pack_id TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS learning_turns(id TEXT PRIMARY KEY,student_id TEXT NOT NULL REFERENCES classroom_accounts(id),class_id TEXT REFERENCES classrooms(id),question TEXT NOT NULL,result TEXT NOT NULL,created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS learning_graphs(scope_id TEXT PRIMARY KEY,graph_json TEXT NOT NULL);`);
  function profile(secret){const actor=classroom.authenticate(secret);return {actor,...(db.prepare('SELECT mode,pack_id AS packId FROM learning_profiles WHERE user_id=?').get(actor.id)||{mode:'personal',packId:'discovery'})};}
  function scope(secret,classId){const p=profile(secret);if(!classId)return {...p,classId:null};if(!classroom.getClasses(secret).some(c=>c.id===classId))throw Error('FORBIDDEN');const setting=db.prepare('SELECT mode,pack_id AS packId FROM class_learning_scopes WHERE class_id=?').get(classId);return {...p,...setting,classId};}
  function setProfile(secret,{mode,packId}){const p=profile(secret);if(!['personal','school','academy'].includes(mode))throw Error('INVALID_MODE');getPack(packId);db.prepare('INSERT INTO learning_profiles VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET mode=excluded.mode,pack_id=excluded.pack_id').run(p.actor.id,mode,packId);return profile(secret);}
  function setClassScope(secret,{classId,mode,packId}){classroom.getLessons(secret,classId);if(!['school','academy'].includes(mode))throw Error('INVALID_MODE');getPack(packId);db.prepare('INSERT INTO class_learning_scopes VALUES(?,?,?) ON CONFLICT(class_id) DO UPDATE SET mode=excluded.mode,pack_id=excluded.pack_id').run(classId,mode,packId);return scope(secret,classId);}
  function start(input){
    const parsed=startSchema.safeParse(input);if(!parsed.success)throw Error('INVALID_PROFILE');const {mode,role,packId,name,title,invite}=parsed.data;
    if(mode==='personal'&&role!=='student')throw Error('INVALID_PROFILE');getPack(packId);
    if(invite?.trim()){const hash=createHash('sha256').update(invite.trim()).digest('hex');if(!db.prepare('SELECT class_id FROM class_invites WHERE token_hash=? AND consumed_at IS NULL').get(hash))throw Error('INVALID_INVITE');}
    const account=classroom.createAccount(name?.trim()||(role==='teacher'?'Teacher':'Learner'),role);setProfile(account.token,{mode,packId});let classId=null;
    if(role==='teacher'){const c=classroom.createClass(account.token,title?.trim()||`${mode==='academy'?'Academy':'School'} class`);classId=c.id;setClassScope(account.token,{classId,mode,packId});}
    else if(invite?.trim())classId=classroom.joinClass(account.token,invite.trim()).classId;
    return {...account,profile:profile(account.token),classId};
  }

  function observations(secret,classId){classroom.authenticate(secret,'student');if(classId)scope(secret,classId);return classroom.listMine(secret).filter(o=>!classId||o.classId===classId).map(o=>({...o,observation:o.summary}));}
  function graph(secret,classId){const s=scope(secret,classId);const obs=s.actor.role==='teacher'?classroom.roster(secret,classId).flatMap(student=>student.observations.map(o=>({...o,observation:o.summary,student:student.name}))):observations(secret,classId);const extra=db.prepare('SELECT graph_json FROM learning_graphs WHERE scope_id=?').get(classId?`class:${classId}`:`personal:${s.actor.id}`);return buildGraph(s.packId,obs,extra?JSON.parse(extra.graph_json):undefined);}
  function importGraph(secret,classId,data){
    const s=scope(secret,classId);if(classId)classroom.getLessons(secret,classId);else classroom.authenticate(secret,'student');
    const checked=customSchema.safeParse(data);if(!checked.success)throw Error('INVALID_GRAPH');
    const ids=new Set(checked.data.nodes.map(n=>n.id));if(ids.size!==checked.data.nodes.length||checked.data.edges.some(e=>!ids.has(e.source)||!ids.has(e.target)||e.source===e.target))throw Error('INVALID_GRAPH');
    const scopeId=classId?`class:${classId}`:`personal:${s.actor.id}`,row=db.prepare('SELECT graph_json FROM learning_graphs WHERE scope_id=?').get(scopeId);
    const prior=row?JSON.parse(row.graph_json):{nodes:[],edges:[]},base=getPack(s.packId),known=new Map([...base.nodes,...prior.nodes].map(n=>[conceptId(n.label),n.id]));
    const nodes=[...prior.nodes],mapping=new Map();
    for(const node of checked.data.nodes){const normalized=conceptId(node.label);let id=known.get(normalized);if(!id){id='custom_'+createHash('sha256').update(normalized).digest('hex').slice(0,16);nodes.push({id,label:node.label,group:'custom',source:'course'});known.set(normalized,id);}mapping.set(node.id,id);}
    const edges=[...prior.edges];for(const edge of checked.data.edges){const source=mapping.get(edge.source),target=mapping.get(edge.target);if(source!==target&&!edges.some(e=>e.source===source&&e.target===target))edges.push({source,target,kind:'related',provenance:'User-defined course connection'});}
    if(nodes.length>500||edges.length>1500)throw Error('INVALID_GRAPH');
    db.prepare('INSERT INTO learning_graphs VALUES(?,?) ON CONFLICT(scope_id) DO UPDATE SET graph_json=excluded.graph_json').run(scopeId,JSON.stringify({nodes,edges}));return graph(secret,classId);
  }

  function state(secret,classId){const p=profile(secret);if(p.actor.role!=='student')throw Error('FORBIDDEN');const context=scope(secret,classId);return {profile:p,scope:context,classes:classroom.getClasses(secret),observations:observations(secret,classId),graph:graph(secret,classId),turns:db.prepare('SELECT id,question,result,created_at AS time FROM learning_turns WHERE student_id=? AND class_id IS ? ORDER BY created_at ASC,rowid ASC LIMIT 200').all(p.actor.id,classId||null).map(t=>({...t,result:JSON.parse(t.result),source:'meta'}))};}
  function saveTurn(secret,{question,result,classId}){const actor=classroom.authenticate(secret,'student');scope(secret,classId);db.exec('BEGIN IMMEDIATE');try{const observation=classroom.addObservation(secret,{classId,rawText:question,topic:result.topic,signal:result.signal,observation:result.observation,path:result.path,source:'meta'});const id=randomUUID(),time=new Date().toISOString();db.prepare('INSERT INTO learning_turns VALUES(?,?,?,?,?,?)').run(id,actor.id,classId||null,question,JSON.stringify(result),time);db.exec('COMMIT');return {id,question,result,time,observationId:observation.id,source:'meta'};}catch(e){db.exec('ROLLBACK');throw e;}}
  return {profile,scope,setProfile,setClassScope,start,state,observations,graph,saveTurn,importGraph};
}
