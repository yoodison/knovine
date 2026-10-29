import http from 'node:http';
import { askMeta, proposeLesson } from './model.js';
import { modelConfig, modelKey } from './model-provider.js';
import { createStore } from './store.js';
import { createClassroom } from './classroom.js';
import { createDemoClassroom } from './demo.js';
import { createDemoBridge } from './demo-bridge.js';
import { startTunnel, tunnelStatus, stopTunnel } from './tunnel.js';
const port = Number(process.env.PORT || 4176), store=createStore();
const classroom=createClassroom(store);
const demoBridge=createDemoBridge(classroom);
const selectedModel=modelConfig();
let sessionKey=modelKey(selectedModel.provider);
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
const validHost = host => [`127.0.0.1:${port}`,`localhost:${port}`].includes(host);
http.createServer(async(req,res)=>{
  if(!validHost(req.headers.host)) return json(res,403,{error:'Host not allowed'});
  const url=new URL(req.url,'http://localhost');
  if(req.method!=='GET' && !['http://127.0.0.1:4175','http://localhost:4175'].includes(req.headers.origin)) return json(res,403,{error:'Origin not allowed'});
  try {
    const secret=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1] || '';
    if(url.pathname==='/api/classroom/me'&&req.method==='GET') return json(res,200,{actor:classroom.authenticate(secret),classes:classroom.getClasses(secret)});
    if(url.pathname==='/api/classroom/roster'&&req.method==='GET') return json(res,200,{students:classroom.roster(secret,url.searchParams.get('classId'))});
    if(url.pathname==='/api/classroom/lessons'&&req.method==='GET') return json(res,200,{lessons:classroom.getLessons(secret,url.searchParams.get('classId'))});
    if(url.pathname==='/api/classroom/observations'&&req.method==='GET') return json(res,200,{observations:classroom.listMine(secret)});
    if(url.pathname==='/api/tunnel/status'&&req.method==='GET') return json(res,200,await tunnelStatus());
    if(url.pathname==='/api/status'&&req.method==='GET') return json(res,200,{configured:Boolean(sessionKey),model:selectedModel.model,provider:selectedModel.provider,label:selectedModel.label});
    if(url.pathname==='/api/state'&&req.method==='GET') return json(res,200,{turns:store.listTurns(),observations:store.listObservations({includeExamples:true}),shared:store.isShared(),plans:store.listPlans()});
    if(req.method!=='POST') return json(res,404,{error:'Not found'});
    let raw=''; for await(const chunk of req){raw+=chunk;if(raw.length>80000)return json(res,413,{error:'Request too large'});}
    const body=JSON.parse(raw||'{}');
    if(url.pathname==='/api/demo/session') return json(res,200,demoBridge.start());
    if(url.pathname==='/api/demo/record') return json(res,200,await demoBridge.record(secret));
    if(url.pathname==='/api/demo/share') return json(res,200,demoBridge.share(secret,body.enabled));
    if(url.pathname==='/api/demo/classroom') return json(res,200,createDemoClassroom(classroom));
    if(url.pathname==='/api/tunnel/start') {if(body.scope==='student')classroom.authenticate(secret,'student');else if(body.scope!=='personal')throw new Error('INVALID_SCOPE');return json(res,200,startTunnel(body.key,body.scope==='student'?secret:null));}
    if(url.pathname==='/api/tunnel/stop') return json(res,200,stopTunnel());
    if(url.pathname==='/api/classroom/account') return json(res,200,classroom.createAccount(body.name,body.role));
    if(url.pathname==='/api/classroom/create') return json(res,200,{classroom:classroom.createClass(secret,body.title)});
    if(url.pathname==='/api/classroom/invite') return json(res,200,classroom.createInvite(secret,body.classId));
    if(url.pathname==='/api/classroom/join') return json(res,200,classroom.joinClass(secret,body.invite));
    if(url.pathname==='/api/classroom/share') return json(res,200,classroom.setSharing(secret,body.classId,body.enabled));
    if(url.pathname==='/api/classroom/observation') return json(res,200,{observation:classroom.addObservation(secret,body)});
    if(url.pathname==='/api/classroom/lesson') return json(res,200,{lesson:classroom.addLesson(secret,body.classId,body.title,body.content)});
    if(url.pathname==='/api/classroom/lesson/accept') return json(res,200,{lesson:classroom.acceptLesson(secret,body.id,body.content,body.reason)});
    if(url.pathname==='/api/classroom/lesson/propose') {
      const plan=classroom.getLesson(secret,body.id);
      const observations=classroom.roster(secret,plan.classId).flatMap(s=>s.observations).slice(0,12);
      if(!observations.length) return json(res,400,{error:'No learning observations are shared with this class yet.'});
      if(sessionKey) {const proposal=await proposeLesson({plan:plan.current,observations:observations.map(o=>({topic:o.topic,signal:o.signal,observation:o.summary,rawText:o.rawText}))},{apiKey:sessionKey,provider:selectedModel.provider});return json(res,200,{...proposal,source:'meta'});}
      const o=observations[0];return json(res,200,{reason:`Shared observation: ${o.summary}`,revisedPlan:`${plan.current}\n\n[Suggested addition — teacher review required]\nReview the question about “${o.topic}” and revisit the related concept.`,source:'template'});
    }
    if(url.pathname==='/api/key') {
      if(selectedModel.provider!=='meta') return json(res,400,{error:'This server uses Baseten. Configure BASETEN_API_KEY in the server environment and restart it. Do not enter a Meta key here.'});
      if(typeof body.key!=='string'||!body.key.trim()||body.key.length>500) return json(res,400,{error:'Please check your API key.'});
      const response=await fetch('https://api.meta.ai/v1/models',{headers:{Authorization:`Bearer ${body.key.trim()}`},signal:AbortSignal.timeout(15000)});
      if(!response.ok) return json(res,401,{error:'Meta could not verify the key. Check the key and account status.'});
      sessionKey=body.key.trim(); return json(res,200,{configured:true});
    }
    if(url.pathname==='/api/ask') {
      const question=body.question;
      if(typeof question!=='string'||!question.trim()||question.length>2000)return json(res,400,{error:'Please check your question.'});
      const all=store.listTurns().filter(t=>t.source!=='example'), history=all.slice(-4).flatMap(t=>[{role:'user',content:t.question},{role:'assistant',content:t.result.answer}]);
      const observations=store.listObservations().slice(0,8);
      const result=await askMeta({question,history,observations},{apiKey:sessionKey,provider:selectedModel.provider});
      return json(res,200,{turn:store.addTurn(question.trim(),result,'meta')});
    }
    if(url.pathname==='/api/example') {
      const question='I understand averages, but why do we need a confidence interval?';
      const result={answer:'An average summarizes your sample. But if you choose another sample, its average can change. A confidence interval uses that sampling variation to show a plausible range for the population average.\n\nFor example, the average height of 30 students may be 165 cm, but that does not mean the entire population has exactly that average. Start by comparing averages from several samples.',topic:'Confidence intervals',observation:'Asked why confidence intervals are needed after mentioning an understanding of averages.',signal:'question',path:['Sample mean','Sampling variability','Confidence intervals'],teachingSuggestion:'Compare the averages and intervals from several samples.'};
      return json(res,200,{turn:store.addTurn(question,result,'example')});
    }
    if(url.pathname==='/api/share') {if(typeof body.enabled!=='boolean')return json(res,400,{error:'Invalid share setting'});store.setShare(body.enabled);return json(res,200,{shared:store.isShared()});}
    if(url.pathname==='/api/plan') return json(res,200,{plan:store.putPlan(body)});
    if(url.pathname==='/api/plan/propose') {
      const plan=store.getPlan(body.id);if(!plan)return json(res,404,{error:'Lesson plan not found.'});
      const observations=store.isShared()?store.listObservations({includeExamples:true}).slice(0,12):[];
      if(!observations.length)return json(res,400,{error:'Turn on sharing first.'});
      if(sessionKey) {const proposal=await proposeLesson({plan:plan.current,observations:observations.map(({topic,signal,observation,rawText})=>({topic,signal,observation,rawText}))},{apiKey:sessionKey,provider:selectedModel.provider});return json(res,200,{...proposal,source:'meta'});}
      const o=observations[0], note=o.teachingSuggestion||`Review the learner’s question about “${o.topic}” and briefly revisit the related concept.`;
      return json(res,200,{reason:`Shared observation: ${o.observation}`,revisedPlan:`${plan.current}\n\n[Suggested addition — teacher review required]\n${note}`,source:'template'});
    }
    if(url.pathname==='/api/plan/accept') return json(res,200,{plan:store.acceptPlan(body.id,body.content,body.reason||'Teacher applied the reviewed changes')});
    return json(res,404,{error:'Not found'});
  } catch(err) {
    const msg=String(err?.message||'');
    if(msg==='UNAUTHORIZED')return json(res,401,{error:'Your session is unavailable. Start again on this device.'});
    if(msg==='FORBIDDEN')return json(res,403,{error:'You do not have access to this class.'});
    if(msg==='MODEL_KEY_MISSING')return json(res,503,{error:'Connect the configured model provider first.'});
    if(msg.startsWith('INVALID_')||err instanceof SyntaxError)return json(res,400,{error:'Please check your input.'});
    const known={
      MODEL_HTTP_401:'The model provider rejected the API key. Check the key and try again.',
      MODEL_HTTP_402:'Check billing or credits with the selected model provider.',
      MODEL_HTTP_403:'This account needs model access or billing setup.',
      MODEL_HTTP_429:'Model request limit reached. Try again shortly.',
      MODEL_OUTPUT_INCOMPLETE:'The model response was incomplete. Nothing was saved. Please try again.',
      MODEL_OUTPUT_REFUSED:'The model declined this request. Nothing was saved. Try rephrasing your question.',
      MODEL_OUTPUT_INVALID:'The model returned an unusable result. Nothing was saved. Please try again.'
    };
    console.error('Request failed:',Object.hasOwn(known,msg)?msg:'processing error');
    return json(res,502,{error:known[msg]||'Could not complete the request. Check your connection and input.'});
  }
}).listen(port,'127.0.0.1',()=>console.log(`Local API listening on http://127.0.0.1:${port}`));
