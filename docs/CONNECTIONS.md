# One learning context, across AI

Knovine is designed to preserve learning observations across the assistants a learner chooses, including Muse, ChatGPT, and Claude. A concept path, original learner words, and class-specific sharing travel through one application-owned state model. Reading a response is not proof of mastery.

## Current connection paths

| Experience | Path | Verified scope |
| --- | --- | --- |
| Learn inside Knovine | Muse Spark 1.3 through Meta Model API | Request construction and response validation tested. Successful live inference remains blocked by billing verification. |
| Optional in-app model route | Meta Muse Spark Open through Baseten | Tool-output adapter and rejection tests pass. Authorized key and live inference pending. [Setup](MODEL-PROVIDERS.md). |
| ChatGPT | Private Secure MCP Tunnel | Personal read/write previously verified. Student-scoped protocol tested; full ChatGPT classroom flow pending. |
| Claude | Local MCP STDIO server | Protocol tools tested through the SDK. Claude Desktop setup and app verification pending. |
| Muse agent | Planned Muse connector | Not connected or published. Requires the appropriate authenticated integration and platform verification. |

Muse the agent and Muse Spark the model are separate integration surfaces. The Muse row is marked **Planned**; connecting a Meta Model API key does not connect the Muse app.

## Muse

The intended experience is to learn in a Muse conversation while permitted tool calls read relevant learning context or save an observation. The same context can inform the learner’s map and, with class sharing enabled, the teacher’s next lesson.

Meta’s official [Muse Connector Platform](https://platform.muse.ai/) describes review and end-to-end testing before a connector is listed. [Meta AI Connectors](https://dev.meta.ai/products/connectors) is a separate program; this project has not claimed enrollment or publication in either directory. Do not expose the current unauthenticated loopback service to make it reachable from Muse.

## Claude

For a local personal experiment, run the server with an MCP client supporting STDIO:

```json
{
  "mcpServers": {
    "knovine": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/knovine/server/mcp.js"]
    }
  }
}
```

Replace the example paths with your own Node 22.13+ executable and checkout. Start with fictional data and follow your client’s current local-server setup instructions. No connection is created by selecting Claude in Knovine. The server exposes `get_learning_context`, `record_learning_observation`, and `get_learning_path` for personal observations.

Classroom mode requires a real local student session in the MCP child process environment (`KNOVINE_STUDENT_SESSION`). It adds `get_learning_classes` and restricts writes to that student’s enrolled classes. Do not publish a session token, paste it into a conversation, or reuse the personal mode for a classroom demonstration. The reproducible `?demo=1` harness exercises this scope without asking you to handle tokens.

## Sharing

Only explicit, permitted tool calls read or save records. No connector automatically captures all conversations. A student separately controls whether observations assigned to a particular class are visible to that class’s teacher.
