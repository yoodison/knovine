import test from 'node:test';
import assert from 'node:assert/strict';
import { askMeta, normalizeOutput, proposeLesson } from '../server/model.js';
const result = { answer: 'A', topic: 'T', observation: 'O', signal: 'question', path: ['A', 'B'], teachingSuggestion: 'Check' };
test('passes prior evidence and constrained schema to Meta without treating a question as mastery', async () => {
  let sent;
  const output = await askMeta({ question: 'Why?', history: [], observations: [{ topic: 'T', signal: 'possible_confusion', observation: 'uncertain' }] }, { apiKey: 'test', fetcher: async (url, options) => { sent = { url, body: JSON.parse(options.body) }; return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(result) } }] }) }; } });
  assert.equal(output.signal, 'question'); assert.equal(sent.url, 'https://api.meta.ai/v1/chat/completions'); assert.equal(sent.body.response_format.type, 'json_schema'); assert.match(sent.body.messages[1].content, /uncertain/);
});
test('rejects invented mastery and invalid structured output', () => { assert.throws(() => normalizeOutput({ ...result, signal: 'mastered' })); assert.throws(() => normalizeOutput({ ...result, path: ['A', null] })); });
test('fails clearly without a key', async () => { await assert.rejects(askMeta({ question: 'x' }, { apiKey: '' }), /META_KEY_MISSING/); });
test('teacher proposal sends the original plan and relevant learner observations using Meta structured output', async () => {
  let sent;
  const result=await proposeLesson({plan:'목표: 비율을 설명한다',observations:[{topic:'분수',signal:'question',rawText:'분수는 왜 쓰나요?'}]}, {apiKey:'test',fetcher:async (url,opts)=>{sent=JSON.parse(opts.body);return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({reason:'개념 확인',revisedPlan:'목표: 비율을 설명한다\n분수 복습'})}}]})};}});
  assert.equal(sent.response_format.json_schema.name,'lesson_proposal');assert.match(sent.messages[1].content,/분수는 왜 쓰나요/);assert.match(result.revisedPlan,/분수 복습/);
});
