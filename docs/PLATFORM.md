# Knovine platform: a shared learner context

Updated 5 November 2026. This revision implements the broader personal/school/academy direction. It does not create or plan a new video.

## Entry and identity

Personal learners can start with one click. A subject is optional: Discovery starts empty and grows from learning observations. School and academy entry adds a learner/teacher choice, an optional display name, and a course name or optional class invite. Teachers receive a class; learners joining through an invite inherit that class's scope. A personal learner can also join a class later without replacing their account.

These are local device workspaces, not production school authentication. The browser retains local bearer profiles; SQLite retains the underlying records. The current tab takes precedence over the last device profile, so separate local tabs can represent separate fictional learners. Do not use real student records in this prototype. Existing earlier personal records remain available at `/?legacy=1`; they are not silently assigned to a newly created learner.

## Scope, evidence, and sharing

| Layer | What it represents | Who controls it |
| --- | --- | --- |
| Concept scope | The concepts and proposed connections available to explore | Learner for personal scope; teacher for a course |
| Learner evidence | Original learner words, provisional signal, source, date, and suggested connections | The individual learner |
| Class visibility | Observations explicitly associated with one class and shared with that teacher | Learner consent plus enrollment/teacher ownership checks |

The private learner view can read that learner's observations across contexts. A class view selects its class-specific records. Teachers receive only records assigned to their own class while sharing is enabled. Switching a subject does not erase observations. The latest observation changes the displayed evidence label while older evidence remains available; neither a question nor an explanation is an assessed mastery result.

In-app Meta turns now use the same student-owned observation table as learner-scoped MCP. The model receives the original words in prior evidence and the selected concept inventory. Application code validates output before saving a turn. The selected class determines where that new observation is assigned; no model can choose another learner or bypass sharing.

## Larger maps

- Mathematics: **155 concepts, 153 suggested connections**, organized into Numbers & operations, Patterns & relationships, Geometry & measurement, and Data & chance.
- English communication: **52 concepts, 48 related connections**, organized into expression, comprehension, language resources, and interaction.
- Discovery: no starting concepts; observations and user-defined scope grow the graph.
- User-defined course: paste one concept per line, `Cells > Cell membranes`, or a validated node/edge JSON object. Up to 500 custom concepts and 1,500 custom connections; repeated imports add to the prior custom scope rather than replacing it. The request size is also bounded by the API.

The math inventory is an original concept guide informed by the MOE's four-domain framework and general prealgebra topics. It includes foundation and extension concepts. It is **not a canonical, exhaustive, officially validated curriculum graph**. Local grade/year requirements remain teacher-reviewable. Language links describe related skills, not a compulsory prerequisite order. Imported scope remains user-authored.

References: [Korean MOE — 2022 curriculum changes](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=340&boardSeq=93073&lev=0&searchType=null&statusYN=W), [OpenStax Prealgebra 2e](https://openstax.org/details/books/prealgebra-2e).

The graph supports search, domain/evidence filters, zoom, pan, fit, concept evidence panels, related-idea navigation, and a suggested route from a chosen starting concept to a destination. Wikipedia links open a search for the selected concept; no Wikipedia graph import or automatic ontology completeness is claimed.

## Across AI clients

The shared MCP contract is `get_learning_classes`, `get_knowledge_graph`, `get_learning_context`, `get_learning_path`, and `record_learning_observation`. Read class context with an explicit class ID. Record only learner-authorized words; a connected tool does not capture all chats automatically.

| Surface | Working implementation | Remaining host setup |
| --- | --- | --- |
| Knovine | Contextual Meta request, learner-owned persistence and graph overlay | Working Meta key/account needed for live inference |
| Compatible local MCP client | Downloadable learner-scoped STDIO config; real SDK round trip verified | Import settings in the chosen client |
| Claude Desktop | Local configuration download | Actual Claude application verification pending |
| Gemini CLI | Compatible STDIO config and guide | Actual Gemini CLI verification pending; consumer Gemini website is separate |
| ChatGPT | Live web read/write → learner map → teacher classroom verified on November 5 | Keep the private tunnel/runtime running; a new installation needs its own authorized setup |
| Muse agent | Planned connector surface, distinct from Muse Spark | Platform access and host verification pending |
| Any AI conversation | Explicit paste/import of a learner-approved learning moment | No external integration required for this manual fallback |

For Claude or Gemini CLI, open **Connections → the client → Connect this learner account → Download local MCP config**. Merge the `mcpServers` entry into existing client settings; do not overwrite unrelated settings. The config points to a private `data/connectors/` binding file, with file mode 0600 and directory mode 0700. Its JSON does not contain the bearer token. The binding stays local and must not be published. It grants the same learner scope as the in-app account; teachers cannot export a learner binding.

[Gemini CLI's MCP configuration documentation](https://geminicli.com/docs/tools/mcp-server/) describes the compatible local `command` / `args` / `env` configuration. That documentation is not proof that a particular user's client is connected.

## Current validation

34 tests and a production build pass. Tests cover larger empty scopes, per-learner isolation, school and academy membership, class consent, custom scope authorization, repeated imports, newest evidence, persistence, real MCP configuration execution, and rejection of a different class. Browser checks cover one-click personal entry, subject selection, concept evidence/path exploration, an academy teacher-created custom course, invitation/join, external learning capture, consent, and teacher visibility.

On November 5, a fresh official Playground request succeeded using `muse-spark-1.3-contributor`. The earlier billing failure is resolved for that tested team/project. The local app still needs an API key before its own live inference can be verified. The authenticated private ChatGPT tunnel is now running in learner scope, and the web-to-map-to-classroom flow has been verified. No fake model result is substituted.

The live ChatGPT check used a fictional biology learner. ChatGPT read prior context, saved an osmosis question, then saved a learner explanation and a new water-potential question. All three returned IDs matched the stored records. The course map grew from five concepts to six; Osmosis retained its question and gained a provisional explanation. The teacher saw four moments including one older record. Sharing off removed all teacher-visible evidence and the discovered concept; sharing on restored them. The learner retained all four moments and their 159-concept personal scope after page reload. This verifies this permitted private workflow, not passive collection of every chat.

## Design continuity

The revision reuses the existing 21st-derived `Composer`, native `Dialog`, classroom controls, quiet light tokens, and typography. The graph has an original deterministic clustered layout. A fresh 21st catalog search returned HTTP 401; no new catalog component or hosted generation is claimed. The local 21st review reported two informational color-token findings in the initial platform review and no fixes. Responsive and interaction checks are documented separately in the validation record.
