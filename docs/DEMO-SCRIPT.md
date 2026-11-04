# Current three-minute demo review

Prepared 5 November 2026 for owner review. The new cut uses actual ChatGPT and Meta calls with a fictional learner. The public v2 recording predates this implementation; the new video is not yet published.

The story follows one authorized turgor-pressure question from ChatGPT into the learner map, a Meta explanation using the same context, and a teacher-reviewed lesson. Recording waits are edited for pace. Questions and explanations are provisional evidence, not measured mastery.

## 00:00 — Your learning, connected

AI can explain almost anything. But when a chat ends, what happens to what you learned? I am Minjun, a mathematics education student at Seoul National University. I built Knovine to turn everyday AI learning into context that stays useful for you, and, when you choose, for your teacher.

## 00:22 — Beyond another chat history

The problem is not a missing answer. It is the missing connection between one conversation and the next lesson. Knovine keeps the learner’s own words, the concepts involved, and the evidence behind each interpretation.

## 00:35 — Learn in the AI you already use

Here is the actual workflow, using a fictional student. In ChatGPT, I ask about turgor pressure. With permission, ChatGPT reads my existing class context through the private Knovine connector, answers the question, and records only my learning question. The original words and observation identifier are retained. An AI answer is never stored as proof that I understand it.

## 01:00 — A map that grows with you

Back in Knovine, that new concept appears in the knowledge map. I can open it, read the evidence, and follow its connections to water potential and osmosis. Personal learning can begin with an empty map. Courses can use a larger subject guide or a teacher-defined scope. This is a map of learning evidence, not a percentage claiming to measure everything I know.

## 01:22 — Continue with Muse Spark

I can also keep learning inside Knovine. Meta’s Muse Spark uses the same prior observations to start from my earlier explanation. Its response is validated before the new learning record is saved. Learning can continue across assistants without rebuilding the learner context from scratch.

## 01:40 — From a question to the next lesson

Now the teacher sees the question shared with this class. Instead of guessing what to revisit, I can inspect the actual words. I add a short lesson outline and choose Draft with AI. Muse Spark proposes a complete lesson with a reason tied to the shared evidence, including activities, differentiated prompts, and an exit question. I review the proposal, edit the wording, and save it. The original plan and revision history stay available.

## 02:08 — The learner stays in control

The learner controls class sharing. Turning it off removes these observations from the teacher’s view while keeping the personal learning record. Application code enforces that boundary. The model helps interpret evidence; it does not decide who can access it or assign a mastery score.

## 02:25 — Make the next explanation count

The working local build connects real ChatGPT tool calls, persistent learner maps, and real Meta-generated teacher plans. The broader vision is one learner-owned context layer across the AI tools people choose, with Muse agent integration planned. The learner-state idea came first; this hackathon implementation makes the feedback loop work. Knovine turns a useful question into a better next explanation, and a more informed next lesson.

## Production and disclosure

Remotion 4.0.540 provides the editable timeline and render. The MIT Stageshow Window component frames actual captured product screens. Argo 0.42.1 handles imported-video chapter/review artifacts. A custom synthetic ElevenLabs English voice is used; no real speaker is cloned. The end card identifies 11.ai. The current Free-plan narration is for non-commercial review; commercial use requires eligible rights at generation time. Runtime data, keys, raw captures and generated audio are excluded from the public source archive.

The learner-state idea predates the event. The implementation and reused tools are disclosed in CONTRIBUTIONS.md. Muse agent remains planned; the working Meta model is in-app Muse Spark 1.3. The competition form remains unsubmitted for owner review.
