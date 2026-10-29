# Meta model routes

Knovine has two explicit routes to Meta models. There is no automatic fallback and no arbitrary API-host setting. Provider errors leave the current learning record or lesson unchanged.

| Route | Model | Response contract | Live verification |
| --- | --- | --- | --- |
| Meta Model API (default) | `muse-spark-1.3` | JSON Schema | Pending billing activation |
| Baseten hackathon Model API | `meta-models/muse-spark-open-1026` | Named function arguments, validated locally | Pending an authorized Baseten key |

## Configure the server

For Meta, use the in-app key dialog or provide `MODEL_API_KEY` in the API process environment. `KNOVINE_MODEL_PROVIDER=meta` is the default. `META_MODEL` can select another model available to that Meta account.

For the optional Baseten route, set `KNOVINE_MODEL_PROVIDER=baseten` and supply `BASETEN_API_KEY` through the API process environment. Restart `npm run api`, then reload Knovine. Do not enter a Baseten key in the Meta key dialog. The Baseten route intentionally uses the hackathon-specific model slug, not the general catalog slug. A key configured in the environment is not proof of successful inference.

The app does not automatically load `.env` files. `.env.example` documents variable names only; never put real keys in source control, commands that will be shared, or a chat. Provider keys are distinct: a Meta key is never sent to Baseten, and a Baseten key is never sent to Meta. Changing providers is a deliberate operator action because it changes where learning context is sent. Use fictional records for testing this local prototype.

The selected provider, model, and label are available in `/api/status`. New successful responses retain `modelInfo` alongside their content. No credentials are returned by either endpoint.

## Why the Baseten request is different

Baseten documents tool calling for Muse Spark Open, but **not JSON mode or structured outputs**. Knovine therefore requests exactly one named function result: `submit_learning_turn` or `submit_lesson_proposal`. It does not execute a function supplied by the model. The returned arguments pass application validation before they can reach persistence or the teacher preview. See [Baseten feature support](https://docs.baseten.co/inference/model-apis/overview) and [function calling](https://docs.baseten.co/inference/function-calling).

The model boundary rejects refusals, unfinished completions, malformed JSON, unknown/multiple function calls, unknown fields, unsupported evidence labels, blanks, and overlong fields. It does not silently truncate a lesson or learning observation. These checks validate structure and completion, **not the truth of an interpretation or a learner’s mastery**. The teacher still reviews a proposed lesson before accepting it.

The workshop’s separation of model work, independent verification, and human sign-off informed this boundary: [Meta legal-agent workshop](https://github.com/meta-models/legal-agent-workshop). Knovine does not import that workshop’s legal data or claim a formal educational assessment.

## Verify before recording a live demo

1. Check `/api/status` for the intended provider and model.
2. Ask one fictional learner question. Confirm a complete response, saved original words, and the returned `modelInfo`.
3. With fictional class sharing enabled, request a lesson revision. Confirm it stays a draft until a teacher chooses **Save reviewed plan**.
4. Record real results only. A configured key, test fixture, example conversation, or local-rule suggestion is not a successful model call.

As of 29 October, automated tests cover both request formats and failure boundaries. Neither live route is certified by those tests. Existing review video v2 predates this provider update.
