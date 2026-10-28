# Knovine

**Your understanding, connected.**

A local learner-state and classroom prototype. Learning observations retain the learner's words and a suggested concept path. A connected AI can read/write observations through MCP. Students control per-class sharing; teachers inspect evidence, propose lesson changes, and review them before saving.

[Watch the three-minute working demo](https://github.com/yoodison/knovine/releases/tag/demo-review-v1) · [Validation](docs/VALIDATION.md)

## Run locally

Requires Node.js 22.13+ with `node:sqlite` support, npm, and a browser.

```sh
npm ci
npm run api
# In another terminal:
npm run dev
```

Open http://127.0.0.1:4175. Choose **Try an example** for a clearly labeled fictional conversation or **Classroom → Preview a sample class** for a fictional teacher workspace. Previewing the conversation does not add records to the database. The sample classroom creates a separate local demo teacher, class, and fictional students without changing existing classes.

```sh
npm test
npm run build
```

## Reproduce the working demo

Open **http://127.0.0.1:4175/?demo=1** and select **Start isolated demo**. This creates a separate fictional teacher, student, class, and text lesson.

1. Select **Record through MCP**. A separate MCP SDK client sends a real student-scoped tool call. The live teacher iframe shows one observation after its next refresh.
2. Open **Alex (demo)** to inspect the original question.
3. Turn sharing off: the observation disappears from the teacher. Turn it on: it returns.
4. Open **Next lesson → Adapt to shared learning**. Without Meta, the suggestion is explicitly labeled as a local rule.
5. Edit the suggested lesson, choose **Apply reviewed changes**, then open **Original plan & revision history**.

The demo control may only act on its newly created fictional learner. A repeated tool call deduplicates the record. Its in-memory authorization ends when the API restarts. The harness is an engineering demonstration, not an automatic ChatGPT agent or simulated Meta response.

## Meta integration

**Connections → Meta → Connect** accepts an existing Meta Model API key. It is sent to Meta for verification and held only in server process memory. Restarting the API requires entering it again. Alternatively, provide `MODEL_API_KEY` through the server environment. `META_MODEL` defaults to `muse-spark-1.3`. The app does not automatically load `.env` files.

The model receives the question and recent observations to produce validated JSON: explanation, concept, evidence type, observation, suggested path, and provisional teacher suggestion. A second structured workflow proposes lesson revisions. Questions and AI answers are not evidence of verified mastery.

**Current live status, 29 October 2026:** Meta's official playground rejected the verification request with “Billing verification failed”. Request construction/output validation are tested, but successful live Meta inference is still pending. Without a connected key, the teacher preview uses a visibly labeled local rule.

## Classroom and connector

Create a local teacher or student workspace under Classroom. A teacher creates a class and issues a single-use invite. A student joins and explicitly enables sharing. Only observations assigned to that class are visible to its teacher. Class views refresh every four seconds. Lesson changes preserve the original and revision history.

Run `node /absolute/path/server/mcp.js` as an MCP STDIO server. Personal tools are `get_learning_context`, `record_learning_observation`, and `get_learning_path`. Student-scoped mode additionally exposes `get_learning_classes`. Set `KNOVINE_STUDENT_SESSION` only in the child process environment from an authenticated local student session. Use the returned class ID when recording a class observation. Never copy tokens into chat or source control.

The optional ChatGPT integration uses an OpenAI Secure MCP Tunnel in a private workspace. A local tunnel client and private profile are intentionally excluded from the source archive. On the configured development computer, open Connections → ChatGPT → Set up connection, select the record scope, enter the tunnel-only key and start. This connection lasts only while the local server and tunnel are running. A fresh installation must configure its own tunnel and runtime according to [OpenAI's tunnel documentation](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).

Personal-mode ChatGPT read/write was verified on 28 October. Student-scoped MCP read/write and class isolation are tested through the SDK. The full ChatGPT student-to-teacher flow is still pending. Tool calls with permission are supported; automatic capture of every external AI conversation is not.

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
