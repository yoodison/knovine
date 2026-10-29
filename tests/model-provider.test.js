import test from 'node:test';
import assert from 'node:assert/strict';
import { askMeta, proposeLesson, normalizeOutput } from '../server/model.js';
import { modelConfig, modelKey } from '../server/model-provider.js';
import { createStore } from '../server/store.js';

const turn={answer:'Compare equal-sized wholes.',topic:'Equivalent fractions',observation:'Asked how fractions can be equal.',signal:'question',path:['Equal parts','Equivalent fractions'],teachingSuggestion:'Ask the learner to draw both fractions.'};
const tool=(name,data)=>({type:'function',function:{name,arguments:JSON.stringify(data)}});
const reply=choice=>async()=>({ok:true,json:async()=>({choices:[choice]})});

test('Baseten uses the hackathon Muse model, tool arguments, and its own credential',async()=>{
  let request;
  const output=await askMeta({question:'Why is one half two quarters?'},{provider:'baseten',apiKey:'baseten-test',fetcher:async(url,opts)=>{
    request={url,headers:opts.headers,body:JSON.parse(opts.body)};
    return {ok:true,json:async()=>({choices:[{finish_reason:'tool_calls',message:{tool_calls:[tool('submit_learning_turn',turn)]}}]})};
  }});
  assert.equal(request.url,'https://inference.baseten.co/v1/chat/completions');
  assert.equal(request.headers.Authorization,'Bearer baseten-test');
  assert.equal(request.body.model,'meta-models/muse-spark-open-1026');
  assert.equal(request.body.max_tokens,2400);
  assert.equal(request.body.response_format,undefined);
  assert.equal(request.body.tools[0].function.strict,undefined);
  assert.equal(request.body.tool_choice.function.name,'submit_learning_turn');
  assert.equal(output.signal,'question');
  assert.deepEqual(output.modelInfo,{provider:'baseten',model:'meta-models/muse-spark-open-1026'});
  assert.equal(modelKey('baseten',{MODEL_API_KEY:'meta-only'}),'');
  assert.equal(modelKey('meta',{BASETEN_API_KEY:'baseten-only'}),'');
  assert.throws(()=>modelConfig('arbitrary-host'),/MODEL_PROVIDER_UNSUPPORTED/);
});

test('Baseten teacher proposals are validated data, not instructions to save a plan',async()=>{
  const output=await proposeLesson({plan:'Compare fractions.',observations:[{topic:turn.topic}]},{provider:'baseten',apiKey:'test',fetcher:reply({finish_reason:'tool_calls',message:{tool_calls:[tool('submit_lesson_proposal',{reason:'A shared question needs a visual check.',revisedPlan:'Compare equal-sized rectangles, then fractions.'})]}})});
  assert.match(output.revisedPlan,/rectangles/);
  assert.equal(output.modelInfo.provider,'baseten');
});

for(const [name,provider,choice] of [
  ['truncated valid JSON','meta',{finish_reason:'length',message:{content:JSON.stringify(turn)}}],
  ['refusal with valid JSON','meta',{finish_reason:'stop',message:{content:JSON.stringify(turn),refusal:'Refused'}}],
  ['missing completion status','meta',{message:{content:JSON.stringify(turn)}}],
  ['malformed JSON','meta',{finish_reason:'stop',message:{content:'{bad'}}],
  ['invented mastery','meta',{finish_reason:'stop',message:{content:JSON.stringify({...turn,signal:'mastered'})}}],
  ['unrequested tool','baseten',{finish_reason:'tool_calls',message:{tool_calls:[tool('approve_lesson',turn)]}}],
  ['multiple tool calls','baseten',{finish_reason:'tool_calls',message:{tool_calls:[tool('submit_learning_turn',turn),tool('submit_learning_turn',turn)]}}],
  ['truncated tool arguments','baseten',{finish_reason:'length',message:{tool_calls:[tool('submit_learning_turn',turn)]}}],
  ['plain text instead of tool result','baseten',{finish_reason:'stop',message:{content:JSON.stringify(turn)}}]
]) test(`rejects ${name} before persisting learner evidence`,async()=>{
  const store=createStore(':memory:');
  try {
    await assert.rejects(async()=>{
      const result=await askMeta({question:'Why?'},{provider,apiKey:'test',fetcher:reply(choice)});
      store.addTurn('Why?',result,'meta');
    },/MODEL_OUTPUT_/);
    assert.equal(store.listTurns().length,0);
    assert.equal(store.listObservations().length,0);
  } finally {store.close();}
});

test('validation rejects blank, unknown and overlong fields instead of silently clipping evidence',()=>{
  for(const invalid of [{...turn,answer:' '},{...turn,confidence:1},{...turn,path:['']},{...turn,observation:'a'.repeat(401)}]) assert.throws(()=>normalizeOutput(invalid),/MODEL_OUTPUT_INVALID/);
});

test('provider errors never trigger an automatic alternate-provider request',async()=>{
  let calls=0;
  await assert.rejects(askMeta({question:'Why?'},{provider:'meta',apiKey:'test',fetcher:async()=>{calls++;return {ok:false,status:402};}}),/MODEL_HTTP_402/);
  assert.equal(calls,1);
});

test('invalid teacher output leaves the original plan and revision history intact',async()=>{
  const store=createStore(':memory:'),plan=store.putPlan({title:'Fractions',content:'Original plan.'});
  try {
    await assert.rejects(async()=>{
      const result=await proposeLesson({plan:plan.current,observations:[]},{provider:'meta',apiKey:'test',fetcher:reply({finish_reason:'stop',message:{content:JSON.stringify({reason:' ',revisedPlan:'New plan.'})}})});
      store.acceptPlan(plan.id,result.revisedPlan,result.reason);
    },/MODEL_OUTPUT_INVALID/);
    assert.equal(store.getPlan(plan.id).current,'Original plan.');
    assert.equal(store.getPlan(plan.id).versions.length,0);
  } finally {store.close();}
});
