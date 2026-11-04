# Validation record — latest check 5 November 2026

## Current check — 5 November 2026

- Official Meta Playground: a fresh request now succeeded with `muse-spark-1.3-contributor`. The UI showed 6.1 seconds, 20 input tokens and 41 output tokens. Earlier billing-failure entries below are historical.
- App-side verification is now complete for standard `muse-spark-1.3`: five real in-app tutoring turns persisted, reusing prior ChatGPT learner words. The teacher received ten total observations: five Meta turns, four real ChatGPT writes, and one older manual fictional record. ChatGPT read back the latest Meta observation ID and original words without writing another record.
- The teacher generated a revised 45-minute lesson and a new 30-minute lesson from a short outline using Meta. Both proposals stayed unsaved until review; both were edited, accepted, and retained their originals plus one revision after browser reload.
- The first full lesson request returned incomplete output; the app refused to save it. The provider now gives reasoning and lesson output enough bounded headroom. Subsequent live requests succeeded.
- A tutoring answer contained a water-potential sign error. The model explicitly corrected its own earlier wording on follow-up. Teacher review refined the plans; these checks verify application behavior, not educational accuracy or measured learning.
- The tunnel now checks successful remote polling rather than treating local startup as authenticated readiness. A real invalid-key incident was recovered, followed by a successful ChatGPT web readback and another fresh remote MCP read.
- Current suite: 37 tests and production build passed, including newest-evidence selection and tunnel authentication-state regressions.
- Added `classId` to the MCP learning-path schema. A real MCP regression check confirms course paths exclude personal paths and reject another class. The latest 37 tests and the production build pass.
- After sign-in and user-entered runtime key setup, the private tunnel reported ready in student scope. ChatGPT web read existing learner context and saved three new observations through the Knovine plugin.
- The three ChatGPT-returned observation IDs matched a fresh MCP read-back. The course map grew from 5 concepts / 4 links to 6 concepts / 5 links, with a new Water potential node. Osmosis changed from question to provisional learner explanation while retaining its earlier question.
- The teacher saw four total moments including one older record. Sharing off reduced teacher-visible moments to zero and removed the conversation-created node from the teacher graph; sharing on restored four moments and the six-node scope. The learner retained four moments, including in the private 159-concept map after browser reload.
- This uses fictional learner statements and real ChatGPT model/tool execution. No manual-import endpoint or demo bridge was used for these three writes.
- No Claude extension was installed. The user selected ChatGPT-only verification.
- A subsequent video-production pass recorded a new real ChatGPT write (`bbb5a393-2c20-425d-b48f-ec9b5c33f136`), its seven-concept/ten-connection course map, another Meta learning turn, and a third teacher-reviewed plan. Sharing off/on changed the teacher view from ten moments to zero and back. Final competition submission remains pending.

## Submission review — 4 November 2026

- Current public-source checkout: 26 tests and production build passed again.
- Browser: Connections opened normally. A fresh isolated fictional classroom received a real MCP SDK write. Sharing off removed the teacher-visible observation; sharing on restored it.
- Browser: the teacher requested a clearly labeled local-rule proposal, edited the lesson, saved it, and inspected the retained original and revision reason.
- Real Meta Playground retry failed with `Billing verification failed`. No live inference success is claimed. An October 30 support reply identified missing team payment setup.
- Local review cut v3: a 180-second video track, English synthetic narration and captions, and explicit pre-existing-idea/event-implementation disclosure. Product footage is from October 29. Full FFmpeg decoding passed; browser playback advanced and paused without a video error. The English caption track was detected; its UI mode was disabled during that playback check.
- The actual submission form contains the updated English review answers. Final promotional consent remains unchecked; the form has not been submitted. Its video link still targets public v2 while the local replacement awaits review.
- The owner approved MIT licensing on November 4. The approved LICENSE is included in the public source and source archive.

## Discord-informed provider and verification update

- Current local suite: **26 tests passed**, plus production build. Earlier 12-test results below describe the published v2 snapshot.
- Added a Baseten adapter for the hackathon Meta Muse Spark Open slug. Verified its endpoint, separate-key selection, function-call request shape, and result parsing with controlled fixtures; no live provider request was made by these tests.
- Rejected truncated completions, refusals, malformed results, unknown/multiple tool calls, invalid evidence labels, blank and oversized fields. Failure cases left the in-memory test database empty or the original lesson unchanged.
- Provider failures do not switch providers automatically. Newly accepted results retain provider/model provenance.
- Source packaging now lists public documents explicitly, excluding private submission notes even when run from the development checkout.
- Live model inference and full ChatGPT classroom verification are still pending. The published v2 video is unchanged.

## Passed

- Unit and protocol suite: 12 tests passed. Includes real SDK calls to the local MCP server, per-class ownership, consent filtering, duplicate-write handling, persistence, preservation of original lesson plans, and isolation of sample classrooms.
- Source archive extracted to a clean temporary directory: `npm ci --ignore-scripts --no-audit --no-fund`, production build, and the same 12 tests passed.
- Browser: a sample class was created through the UI, a lesson change was generated as a **local rule**, reviewed, saved, and displayed with its retained original/history.
- Browser: a separate fictional student joined through a single-use invite and enabled sharing. A readback of the teacher roster showed the newly joined student, for four fictional students in total.
- Browser: example conversation, optional concept path, example map, concept-to-question navigation, and missing-key prompt worked.
- Browser: a modal closed with Escape and returned focus to its trigger. An unsent question was preserved.
- Browser: 390px layout checked; document width matched the viewport on learner and teacher screens. Temporary viewport overrides were cleared.
- 21st review: one informational hardcoded-color finding, no reported accessibility findings. This automated review is not a full accessibility audit.
- Source archive uses an explicit allowlist. Runtime data, keys, tunnel profiles, build output, node_modules, and screenshots are excluded. A common-credential-pattern scan reported zero matches; this is not a comprehensive security audit.

- Recorded browser proof: a fresh fictional learner observation was written by a separate MCP client, appeared in the teacher iframe, disappeared with sharing off, and returned with sharing on. The teacher edited and saved a lesson; the original and revision history remained visible.
- Demo bridge test: a real MCP subprocess write, deduplication, unrelated-teacher rejection, and sharing off/on all passed.

## Operational state and remaining checks

- The earlier Meta billing failure no longer blocks the tested app: five live standard-model tutoring turns and three teacher lesson proposals succeeded on November 5.
- Meta and private ChatGPT connections are configured in the tested local session. API keys remain memory-only; an API restart requires reconnecting. No key is included in source, screenshots, or the archive.
- The private ChatGPT student-to-teacher workflow passed on November 5. Continued access requires the local server and authorized private tunnel to remain running.
- Public app deployment and final competition submission remain pending.
- Repository and video publication are tracked separately in the README.

The local sample classroom is fictional. It must not be used as evidence of a live model response, real student progress, or measured educational impact.

## Multi-assistant and minimal interface revision

- Home includes Muse, ChatGPT, and Claude, with Muse agent labeled Planned and in-app Muse Spark configured separately. No new connector or live-model capability is claimed.
- Browser checks: provider chooser, Muse-to-model setup, existing ChatGPT setup, example conversation, path disclosure, concept map, and teacher reviewed revision all functioned.
- Home fits a 1280x720 desktop and 390x844 phone viewport with no horizontal overflow. Mobile concepts use a vertical layout; navigation bounds stay inside the viewport. Temporary emulation was cleared.
- Real MCP demonstration re-recorded: observation reached the teacher, sharing off/on removed/restored it, and a revised lesson saved with its original.
- 12 tests and production build passed. 21st review reported two informational color-token findings, no reported accessibility findings; this does not constitute a full accessibility audit.
- Revision 2 video adds the Muse/ChatGPT/Claude direction and uses the updated UI.

## Personal / school / academy platform revision

- 34 tests and production build passed. Added per-learner platform state, 155-concept math / 52-skill English scopes, additive custom course imports, latest-evidence labels, and a real learner-bound MCP configuration round trip.
- Browser: personal entry took one click with no subject requirement. Choosing math opened 155 concepts; an explicitly imported fictional Gemini learning question appeared as original evidence for Equivalent fractions. Concept selection, zoom/fit, a Fractions-to-Equivalent-fractions route, and source links worked.
- Browser: an academy teacher created a biology class and a five-concept custom scope. A new invited learner inherited it and could not edit it. An explicitly imported fictional Claude question became visible to the teacher and course graph after class sharing was enabled.
- The shared MCP test reads the large course scope, records a real tool observation, reads its context, denies another teacher's class, and observes sharing off/on. Actual Claude/Gemini host applications remain pending; the subsequent November 5 entry above records the completed ChatGPT classroom flow.
- Fresh Meta Playground request still returned Billing verification failed. The team's Billing iframe still displayed no payment methods. The reported card registration is not treated as an inference success.
- Existing SQLite records were backed up privately before additive schema changes. Earlier personal records remain accessible from the legacy workspace. Local profiles are retained on the device; this is not production authentication.
- 21st catalog lookup returned HTTP 401. Existing Composer/Dialog patterns were reused. Local 21st review was run; informational findings and final responsive evidence are recorded in the handoff.
- No video work or final competition submission was performed in this revision.

- Responsive check: 390px viewport had no horizontal overflow on the course map; viewport emulation was reset. The local MCP config downloaded successfully and referenced a private learner binding without embedding its bearer token. A new browser tab restored the selected device profile and its learning record.
