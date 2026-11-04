# Knovine

**Your learning, connected.**

Turn everyday AI conversations into learner-owned context and a better next lesson.

[Watch the 3-minute demo](https://github.com/yoodison/knovine/releases/tag/hackathon-final) · [Verified behavior](docs/VALIDATION.md) · [Connections](docs/CONNECTIONS.md) · [Development and reuse](docs/CONTRIBUTIONS.md)

## The connected learning loop

1. **Learn in the AI you use.** ChatGPT can read authorized learner context and save the learner's original question through Knovine's private MCP connector. Muse Spark also powers learning inside Knovine.
2. **See how ideas connect.** A persistent concept map keeps the original evidence, suggested connections and next learning paths. Personal study can start with an empty map or a subject guide.
3. **Make the next lesson more informed.** Learners choose what to share with a class. The teacher inspects those questions, generates a complete lesson with Meta, and reviews and edits it before saving. Originals and revision history remain available.

Personal, school and academy entry paths share the same learner-state layer. Included subject guides cover 155 mathematics concepts and 52 English skills. Teachers can define a course's own concept scope.

### What the demo shows

Actual ChatGPT calls, persistent learner/class records, in-app Muse Spark 1.3 explanations, a teacher-reviewed Meta lesson, and sharing controls. The course map grows with a turgor-pressure question linked to osmosis and water potential.

The recorded case uses a sample class. Application code enforces access and saving; model output is reviewed evidence, never an automatic mastery score. The external Muse agent connector is planned, separate from the working in-app Muse Spark model.

## Run the app

Requires Node.js 22.13+ with `node:sqlite` support, npm, and a browser.

```sh
npm ci
npm run api
```

In another terminal:

```sh
npm run dev
```

Open **http://127.0.0.1:4175**. Choose **For myself → Start learning**, or create/join a school or academy class. Records persist in `data/learning.sqlite`. Use sample data: this is a local development implementation, not a hosted school service.

```sh
npm test
npm run build
```

The integration check passes **37 tests and the production build**. Provider setup and host-specific verification are documented below.

## Reproduce a fresh protocol demo

`/?demo=1` is a separate, isolated engineering harness for MCP recording, duplicate protection and sharing changes. Its **Record through MCP** button sends an actual student-scoped SDK call. It does not simulate a ChatGPT conversation or a Meta response. For the recorded live-client flow, configure the ChatGPT tunnel and Meta key described below.

## AI connections

The connection chooser includes Muse, ChatGPT, Claude, and Gemini. **Muse the agent is a planned connector**, separate from in-app Muse Spark. ChatGPT uses the existing private tunnel; Claude Desktop and Gemini CLI can use the downloaded local MCP config. A permitted manual learning-moment import works with any AI. Host-specific verification is tracked in [connection paths](docs/CONNECTIONS.md); a UI entry does not mean a client is connected.

## Meta integration

**Connections → Learn here with Muse Spark → Connect** accepts an existing Meta Model API key. It is sent to Meta for verification and held only in server process memory. Restarting the API requires entering it again. Alternatively, provide `MODEL_API_KEY` through the server environment. `META_MODEL` defaults to `muse-spark-1.3`. The app does not automatically load `.env` files.

The model receives the question and recent observations to produce validated JSON: explanation, concept, evidence type, observation, suggested path, and provisional teacher suggestion. A second structured workflow proposes lesson revisions. Questions and AI answers are not evidence of verified mastery.

An explicit **Baseten → Meta Muse Spark Open** route is also implemented for an issued hackathon key. It uses validated function arguments because that model does not support JSON Schema output. Both routes reject incomplete or unusable responses before saving. See [provider configuration and live verification steps](docs/MODEL-PROVIDERS.md). This alternative has not yet been verified with a live key.

**Current live status, 5 November 2026:** Knovine now uses real `muse-spark-1.3` inference through Meta Model API. Five in-app learning turns persisted in the same learner store as four authorized ChatGPT observations. Muse Spark reused the ChatGPT-saved learner words; ChatGPT then read a new Meta-sourced record with the same observation ID. The teacher received ten moments (including one older manual test record), generated three lesson plans, reviewed/edited them, and saved them with their originals and revision history retained. A new ChatGPT question about turgor pressure grew the test course map to seven concepts and ten connections. The 37-test suite and production build pass. These checks use a fictional learner, not measured student outcomes. See [validation](docs/VALIDATION.md).

## Classroom and connector

Create a local teacher or student workspace under Classroom. A teacher creates a class and issues a single-use invite. A student joins and explicitly enables sharing. Only observations assigned to that class are visible to its teacher. Class views refresh every four seconds. Lesson changes preserve the original and revision history.

Run `node /absolute/path/server/mcp.js` as an MCP STDIO server. Personal tools are `get_learning_context`, `record_learning_observation`, and `get_learning_path`. Student-scoped mode additionally exposes `get_learning_classes`. Set `KNOVINE_STUDENT_SESSION` only in the child process environment from an authenticated local student session. Use the returned class ID when recording a class observation. Never copy tokens into chat or source control.

The optional ChatGPT integration uses an OpenAI Secure MCP Tunnel in a private workspace. A local tunnel client and private profile are intentionally excluded from the source archive. On the configured development computer, open Connections → ChatGPT → Connect ChatGPT, select the record scope, enter the tunnel-only key and start. This connection lasts only while the local server and tunnel are running. A fresh installation must configure its own tunnel and runtime according to [OpenAI's tunnel documentation](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).

Personal-mode ChatGPT read/write was verified on 28 October. The full student-scoped ChatGPT flow was verified on 5 November using a fictional learner and actual ChatGPT web tool calls. Read-back IDs matched the stored observations, the learner map, and the teacher classroom. Course isolation also remains covered by the SDK suite. Tool calls with permission are supported; automatic capture of every external AI conversation is not.

`npm run mcp:http` exposes an optional loopback-only experimental transport on port 4177. It is not an authenticated public remote server.

## Boundaries

- Runs on one computer with SQLite. Preserve `data/learning.sqlite` when updating.
- Classroom sessions are local bearer sessions, not production authentication. Session recovery is not implemented.
- Personal APIs and local MCP are not intended for public exposure or real student records.
- Lesson input is text. PPT/PDF editing, institutional deployment, validated forgetting models and measured learning gains are future work.
- Public source and a demonstration video are provided; no public app deployment is claimed.

## Project guide

| Document | Purpose |
| --- | --- |
| [Platform](docs/PLATFORM.md) | Personal, school and academy paths; concept guides |
| [Connections](docs/CONNECTIONS.md) | ChatGPT and compatible MCP client setup |
| [Model providers](docs/MODEL-PROVIDERS.md) | Meta and optional adapter configuration |
| [Validation](docs/VALIDATION.md) | Live checks, tests and remaining boundaries |
| [Demo](docs/DEMO-SCRIPT.md) | Three-minute story and recording notes |
| [Contributions](docs/CONTRIBUTIONS.md) | Development history, reused tools and licenses |

`python3 scripts/package_submission.py` creates a source-only ZIP in `output/`. Databases, credentials, tunnel profiles, captures, generated audio, dependencies and build output are excluded.

## License

[MIT](LICENSE). Copyright (c) 2026 Minjun Yoo. Dependencies and third-party media retain their own licenses.
