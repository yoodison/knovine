# Validation record — 29 October 2026

## Submission review — 4 November 2026

- Current public-source checkout: 26 tests and production build passed again.
- Browser: Connections opened normally. A fresh isolated fictional classroom received a real MCP SDK write. Sharing off removed the teacher-visible observation; sharing on restored it.
- Browser: the teacher requested a clearly labeled local-rule proposal, edited the lesson, saved it, and inspected the retained original and revision reason.
- Real Meta Playground retry failed with `Billing verification failed`. No live inference success is claimed. An October 30 support reply identified missing team payment setup.
- Local review cut v3: a 180-second video track, English synthetic narration and captions, and explicit pre-existing-idea/event-implementation disclosure. Product footage is from October 29. Full FFmpeg decoding passed; browser playback advanced and paused without a video error. The English caption track was detected; its UI mode was disabled during that playback check.
- The actual submission form contains the updated English review answers. Final promotional consent remains unchecked; the form has not been submitted. Its video link still targets public v2 while the local replacement awaits review.
- Source license selection remains an owner-review item. A private MIT proposal is not a published license.

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

## Still pending or blocked

- A real request in Meta's official playground returned “Billing verification failed”. It is not recorded as an inference success.
- Successful live Meta learning and lesson-revision outputs remain unverified.
- The private ChatGPT tunnel is stopped. Full ChatGPT student-to-teacher end-to-end verification remains pending.
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
