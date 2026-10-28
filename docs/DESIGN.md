# Knovine interaction direction

29 October 2026: the user requested a more immersive and dramatically simpler experience.

- Start in a focused learning space with one question composer. No persistent sidebar, empty metrics, or parallel context panels.
- Keep three destinations: Learn, My map, Classroom. Put model and connector setup behind Connections.
- Reveal the suggested learning path from a conversation only on demand. Keep evidence one click away.
- Use a calm paper background, readable green ink, a serif emphasis in the welcome sentence, and restrained motion.
- Let a reviewer preview a clearly labeled fictional classroom in one click. Classroom setup remains available without dominating the screen.
- Lead the teacher experience with shared learning signals. Show individual evidence in expandable rows; place lesson editing in its own Next lesson tab.
- Refresh class observations every four seconds while the classroom is mounted. Clear stale records when changing classes. Retain the teacher's editable proposal separately from polling results.
- Preserve existing records, personal lesson drafts, invitations, per-class sharing, and teacher revision history.
- Native dialog handles keyboard focus, Escape and return focus. Composer supports Enter, Shift+Enter and IME composition. Reduced-motion preference disables animation.

## Grounded references and adaptation

- [Searchable conversation screen on Mobbin](https://mobbin.com/screens/5b1c6193-7557-47b2-9c17-f5fb0d2e10d2): reviewed its quiet conversation area and restrained composer as a structural reference, not an education workflow.
- [Plane AI start screen on Mobbin](https://mobbin.com/screens/c02b60e7-2633-460e-844f-bec457ac0d1f): reviewed the single central prompt and suggestions as an entry pattern, not a classroom design.
- [Alwurts Chat Input on 21st](https://21st.dev/@Alwurts/components/chat-input): retrieved source through the 21st connector. Adapted the resizing textarea and submit composition into src/Composer.jsx using the existing React/CSS stack, with IME and loading guards. The 21st CLI catalog search returned an authentication error; the connected 21st plugin supplied the source successfully.

No hosted AI design generation, paid upgrade, or Sites deployment was used. The existing working React product was edited in place.
