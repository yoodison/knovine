# Three-minute connected learning demo

[Watch the final demo](https://github.com/yoodison/knovine/releases/tag/hackathon-final). The video shows actual ChatGPT and Meta calls with a sample class. Waiting time is edited. Presentation-only prefixes and test labels are removed from the recording; source observations remain intact. Questions remain provisional evidence.

## 00:00 — Your learning, connected

AI can explain almost anything. But when a chat ends, what happens to what you learned? I am Minjun, a mathematics education student at Seoul National University. I built Knovine to turn everyday AI learning into context that stays useful for you, and, when you choose, for your teacher.

## 00:22 — Beyond another chat history

The problem is not a missing answer. It is the missing connection between one conversation and the next lesson. Knovine keeps the learner’s own words, the concepts involved, and the evidence behind each interpretation.

## 00:35 — Learn in the AI you already use

Here is the actual workflow. Using ChatGPT, I ask about turgor pressure. With permission, ChatGPT reads my existing class context through the private Knovine connector, answers the question, and records only my learning question. The original words and observation identifier are retained. An AI answer is never stored as proof that I understand it.

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

## Production and reuse

Remotion 4.0.540 provides the editable timeline. The MIT Stageshow Window component frames the recorded app. Argo 0.42.1 prepares chapters and review clips. Narration is a synthetic ElevenLabs voice, with quiet room tone and microphone styling; no real speaker was cloned. The public video title includes 11.ai attribution. The observed Free-plan recording is for non-commercial use; commercial/promotional reuse requires a newly generated asset under eligible rights. Source-code MIT licensing does not extend to generated audio rights.

Runtime records, keys, raw captures and generated audio are excluded from this repository. The learner-state idea predates the event; implementation and reused tools are recorded in [CONTRIBUTIONS.md](CONTRIBUTIONS.md). The external Muse agent connector is planned; the working in-app model is Muse Spark 1.3.
