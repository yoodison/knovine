// Fixed destinations prevent a model/key setting from redirecting learner data.
export function modelConfig(provider = process.env.KNOVINE_MODEL_PROVIDER || 'meta') {
  if (provider === 'meta') return {
    provider, model: process.env.META_MODEL || 'muse-spark-1.3',
    label: 'Muse Spark', endpoint: 'https://api.meta.ai/v1/chat/completions'
  };
  if (provider === 'baseten') return {
    provider, model: 'meta-models/muse-spark-open-1026',
    label: 'Muse Spark Open', endpoint: 'https://inference.baseten.co/v1/chat/completions'
  };
  throw new Error('MODEL_PROVIDER_UNSUPPORTED');
}

export function modelKey(provider, env = process.env) {
  return (provider === 'baseten' ? env.BASETEN_API_KEY : env.MODEL_API_KEY) || '';
}

export async function structuredCompletion({ name, schema, messages }, options = {}) {
  const config = modelConfig(options.provider);
  const apiKey = options.apiKey ?? modelKey(config.provider);
  if (!apiKey) throw new Error('MODEL_KEY_MISSING');
  const toolName = `submit_${name}`;
  // Muse Spark Open supports tools, but not JSON mode/structured outputs.
  // Function arguments are data only: no model-selected code is executed.
  const format = config.provider === 'baseten'
    ? { max_tokens: 2400, tools: [{ type: 'function', function: {
      name: toolName, description: 'Return the requested result for application validation. This does not save or approve it.', parameters: schema
    } }], tool_choice: { type: 'function', function: { name: toolName } }, parallel_tool_calls: false }
    : { max_completion_tokens: 2400, response_format: { type: 'json_schema', json_schema: { name, strict: true, schema } } };
  const response = await (options.fetcher || fetch)(config.endpoint, {
    method: 'POST', signal: AbortSignal.timeout(55000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: config.model, messages, ...format })
  });
  if (!response.ok) throw new Error(`MODEL_HTTP_${response.status}`);
  let json;
  try { json = await response.json(); } catch { throw new Error('MODEL_OUTPUT_INVALID'); }
  if (json?.choices?.length !== 1 || !json.choices[0]) throw new Error('MODEL_OUTPUT_INVALID');
  const { message, finish_reason: finish } = json.choices[0];
  if (!message || message.refusal || finish === 'content_filter') throw new Error('MODEL_OUTPUT_REFUSED');
  if (finish !== (config.provider === 'baseten' ? 'tool_calls' : 'stop')) throw new Error('MODEL_OUTPUT_INCOMPLETE');
  let content;
  if (config.provider === 'baseten') {
    const calls = message.tool_calls;
    if (!Array.isArray(calls) || calls.length !== 1 || calls[0]?.type !== 'function' || calls[0]?.function?.name !== toolName) throw new Error('MODEL_OUTPUT_INVALID');
    content = calls[0].function.arguments;
  } else {
    if (message.tool_calls?.length) throw new Error('MODEL_OUTPUT_INVALID');
    content = message.content;
  }
  if (typeof content !== 'string' || content.length > 60000) throw new Error('MODEL_OUTPUT_INVALID');
  try { return { data: JSON.parse(content), modelInfo: { provider: config.provider, model: config.model } }; }
  catch { throw new Error('MODEL_OUTPUT_INVALID'); }
}
