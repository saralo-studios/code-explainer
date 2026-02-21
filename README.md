# Vibe Code Explainer (prototype)

This is a minimal Next.js single-page app that accepts pasted code and (eventually) will explain it using an AI backend.

Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 and paste code into the textarea.

Next steps
- Wire `pages/api/explain.js` to an AI provider (OpenAI, Anthropic, etc.) and update the handler.
