# Knovine

**Your understanding, connected.**

A local learner-state platform for personal study, schools, and academies. Start with a question or choose a subject scope; keep learning evidence across compatible AI clients; connect selected observations to a teacher's next lesson. Students control per-class sharing, and teachers review proposed changes before saving.

**November 4 platform revision:** one-click personal onboarding; school/academy learner and teacher paths; a 155-concept mathematics guide and a 52-skill English guide; user-defined course graphs; and learner-scoped MCP configuration downloads. See [platform behavior and verified boundaries](docs/PLATFORM.md). The earlier review video predates this interface revision.

[Earlier review video (v2; predates live integration)](https://github.com/yoodison/knovine/releases/tag/demo-review-v2) · [Validation](docs/VALIDATION.md)

## Run locally

Requires Node.js 22.13+ with `node:sqlite` support, npm, and a browser.

```sh
npm ci
npm run api
# In another terminal:
npm run dev
```

Open http://127.0.0.1:4175. Choose **For myself → Start learning** to begin without a fixed subject, or select a subject first. School and academy users can create a class or join with an invite. Local browser profiles retain their learning records; use fictional data. Earlier local records remain at `/?legacy=1`. The isolated fictional protocol demonstration remains at `/?demo=1`.

```sh
npm test
npm run build
```

## Reproduce the working demo

Open **http://127.0.0.1:4175/?demo=1** and select **Start isolated demo**. This creates a separate fictional teacher, student, class, and text lesson.

1. Select **Record through MCP**. A separate MCP SDK client sends a real student-scoped tool call. The live teacher iframe shows one observation after its next refresh.
2. Open **Alex (demo)** to inspect the original question.
3. Turn sharing off: the observation disappears from the teacher. Turn it on: it returns.
4. Open **Next lesson → Adapt lesson**. Or add a lesson, enter a short outline and choose **Draft with AI** after Meta is connected and a learner moment is shared. Review and edit the complete proposal before saving. Without Meta, adaptation is explicitly labeled as a local rule.
5. Edit the suggested lesson, choose **Save reviewed plan**, then open **Original plan & revision history**.

The demo control may only act on its newly created fictional learner. A repeated tool call deduplicates the record. Its in-memory authorization ends when the API restarts. The harness is an engineering demonstration, not an automatic ChatGPT agent or simulated Meta response.

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

- Runs on one computer with SQLite in `data/learning.sqlite`; preserve this folder when updating.
- Local classroom bearer sessions are held in browser session storage. This is not production authentication and session recovery is not implemented.
- Personal API and local MCP are not suitable for public exposure. Do not deploy this server to the internet or enter real student records.
- Lesson input is text. PPT/PDF editing, school integration, formal mastery assessment, validated forgetting models, and learning-outcome evidence are not implemented.
- No public app deployment or final competition submission has been completed. The source is public for review.

## Review artifacts

- [Three-minute demo and narration](docs/DEMO-SCRIPT.md)
- [Contribution and reuse notes](docs/CONTRIBUTIONS.md)
- [Design direction and references](docs/DESIGN.md)
- `python3 scripts/package_submission.py` creates a source-only ZIP in `output/`; it excludes local databases, credentials, tunnel profiles, screenshots, node_modules, and build output.

## License

[MIT](LICENSE). Copyright (c) 2026 Minjun Yoo. Third-party dependencies retain their own licenses.
