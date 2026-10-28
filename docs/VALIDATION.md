# Validation record — 29 October 2026

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
