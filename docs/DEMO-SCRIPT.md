# Three-minute working demo

Review build recorded on 29 October 2026. Real local application footage and synthetic English narration. All learner data is fictional. No live model inference is shown.

The timeline below transcribes the published **v2 review recording**. It has not been replaced by the submission-cut plan described at the end.

## Watch and reproduce

- [Review video and English captions](https://github.com/yoodison/knovine/releases/tag/demo-review-v2)
- Start the app using the README and open `http://127.0.0.1:4175/?demo=1`.
- The MCP client is real. The learner question is scripted. The lesson proposal is a labeled local rule, and the final revision is entered by a teacher.

## Timeline and narration

### 00:00 — Learning, connected.

Knovine keeps your learning connected across AI conversations, then turns shared evidence into a better next lesson.

### 00:08 — 01 / Start with curiosity

The vision is one learning map across Muse, ChatGPT, and Claude. Muse Spark also powers learning inside Knovine. The external Muse connector is marked Planned; it is separate from the model API. Here, a labeled example connects averages to sampling variability and confidence intervals. Follow the path or explore the map. Observations guide the next question without claiming mastery.

### 00:36 — 02 / Record through a real MCP client

Now watch the working connection. Alex is a fictional student in a fresh demo classroom. The question is about equivalent fractions. Clicking Record sends a real tool call through a separate MCP client, using a student scoped session. The server saves the observation in SQLite. The teacher’s workspace refreshes automatically, and the shared question appears. This demonstrates the protocol and classroom data flow, not a live ChatGPT conversation.

### 01:06 — 03 / Keep the evidence

The teacher opens Alex’s learning moment and sees the original words alongside the concept. A bigger denominator seems to mean a smaller amount. That is a useful place to start a conversation, but it does not establish a misconception or prove mastery. The teacher can check the learner’s reasoning before choosing what to do next.

### 01:28 — 04 / Let the learner choose

Sharing belongs to the learner. Here, the demo control turns off Alex’s sharing for this class. The teacher’s signal count returns to zero and the observation disappears. Turning sharing back on restores it. The underlying record remains private while sharing is off. Class ownership, duplicate protection, and this consent filter are enforced by application code and covered by tests.

### 01:53 — 05 / Turn a learning moment into a teaching action

Next, the teacher opens the existing lesson. The shared question stays beside the plan. Adapt lesson proposes a revision for review. In this recording, the suggestion is explicitly labeled as rule based because Meta is not connected. The Meta structured output workflow is implemented, but successful live inference is still pending.

### 02:13 — 06 / Review, revise, and save

The teacher makes the final decision. Here, the plan changes to begin with two identical rectangles. The class compares shaded parts, explains what changed and what stayed the same, and then connects the picture to equivalent fractions. An independent explanation becomes the exit check. Applying the reviewed changes saves the new plan. The original and revision history remain available. This closes the loop from a learner’s question to a concrete teaching action.

### 02:43 — A better next lesson.

The working core is evidence, consent, and teacher action. The source includes a reproducible demo and twelve passing tests. Meta inference and the full ChatGPT classroom flow remain verification gates before final submission. Knovine: your understanding, connected.
## What this proves

A student-scoped MCP client writes an observation to the persistent store. Per-class consent controls teacher visibility. The teacher can inspect evidence and save a reviewed revision while preserving the original plan.

## What it does not prove

The external ChatGPT classroom workflow and successful live Meta inference remain pending. Example conversations and concept maps are visibly fictional. This recording does not establish learning outcomes, a validated mastery score, production security, or a completed competition submission.

## Editing sources

The release includes an English SRT caption file. The updated three-minute deliverable is assembled locally with FFmpeg. The earlier 21st review project is retained as revision 1; its export path is capped at 900 frames (30 seconds). No hosted generation was used to bypass that limit.

[Earlier 21st review project (revision 1)](https://21st.dev/community/video/editor/dde6e1cd-3507-4774-afde-6441a9b75d99?host=codex). Requires the project owner’s access.

## Next recording: submission-cut plan, not yet recorded

Opening draft, subject to the contribution review: “The learner-state idea predates this event. This demo shows Knovine’s event build: learning evidence, class sharing, and teacher-reviewed lesson changes.”

Use the first 10 seconds to state that distinction. Show a real Meta-powered learning turn and saved concept path, then a real student-scoped MCP write, class sharing off/on, and a real Meta lesson proposal that a teacher edits and saves. Keep the narrative centered on one learner question changing the next lesson. Show the selected provider/model and the original evidence briefly; place technical setup in the README.

The main recording should use Meta models for runtime inference. External ChatGPT/Claude compatibility remains part of the product, but its inclusion in the judged runtime demonstration needs clarification because Discord guidance conflicts. A separate local MCP client can demonstrate the interoperability boundary without calling a non-Meta model. Do not label that client as ChatGPT or Muse.

Before recording: verify both live Meta workflows, finish the contribution inventory, resolve the external-runtime question if showing ChatGPT, and obtain the owner’s final review. Keep v2 available until a replacement genuinely demonstrates the claimed flow.
