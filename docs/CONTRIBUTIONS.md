# Contributions and reuse

Knovine is a separate local hackathon implementation of a persistent learner-context platform. This repository contains its React interface, Node/SQLite application, MCP tools, classroom-sharing workflow, teacher revision workflow, and reproducible fictional demonstration.

## Scope of this repository

The files were assembled and verified during the October 2026 hackathon development work. The first public commit is a publication snapshot, not a claim that every line was written on the commit date. The learner-state idea predates this repository. Earlier Nodi and Geuneulro applications, their runtime data, and their repositories are not included or presented as newly built here.

For the final video, introduce the earlier learner-state concept separately from the implementation shown. The event kickoff was 26 October 2026 at noon US Eastern (27 October, 01:00 KST). Local file-creation timestamps inspected for the application entry points, model adapter, classroom, MCP server, and package manifest begin on 28 October KST. These observations support the development timeline but are not a line-by-line authorship audit. The final contribution inventory still requires review before submission.

Work completed on 29 October after the review-v2 snapshot includes a dedicated Baseten Muse Spark Open adapter, model-response failure checks, additional persistence-boundary tests, and an explicit public-document allowlist in the source packager. The v2 recording does not show these changes. Source publication and video publication are tracked separately.

## Reused tools and references

- React and Vite: UI and development/build tooling.
- Model Context Protocol SDK and Zod: protocol implementation and validation.
- Node SQLite: persistent local state.
- Lucide React: icons.
- Alwurts Chat Input on 21st.dev: resizing textarea and submit composition adapted in `src/Composer.jsx`. See its source comment and [design references](DESIGN.md).
- Mobbin screens: interaction references, not copied screen assets.
- Codex: AI-assisted implementation, tests, writing, and review.
- Demo: recordings of the actual local application with fictional learner data. English synthetic narration uses the macOS Samantha voice. Title cards and assembly were authored locally; the 21st editor is a review/editing companion.

Third-party packages retain their own licenses. No ownership of third-party designs or code is asserted. Public visibility is not a production-readiness or educational-validity claim.
