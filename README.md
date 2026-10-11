# utkarshkhanna.in

Personal portfolio of Utkarsh Khanna, Generative AI Data Engineer. Concept: **Latent Space**: the
site is a walk through a model's embedding space. A particle field starts as noise in the hero,
converges into a different structure for each section, and collapses to a single bright point at
Contact.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict)
- Tailwind CSS v4 with design tokens as CSS variables (`app/globals.css`)
- Motion for UI overlays · GSAP ScrollTrigger for the pinned work gallery · Lenis smooth scroll
- Raw WebGL particle field (`components/effects/ParticleField.tsx`), loaded after first paint
- "Ask my portfolio" RAG chatbot: build-time index + Claude API (`app/api/chat/route.ts`)

## Run it

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY to enable the chatbot
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Rebuilds the RAG index, starts the dev server               |
| `npm run build`     | Rebuilds the RAG index, production build                    |
| `npm run lint`      | ESLint                                                      |
| `npm run typecheck` | `tsc --noEmit`                                              |
| `npm run format`    | Prettier                                                    |
| `npm run todos`     | Lists every `[TODO]` placeholder still in the content files |
| `npm run rag:index` | Chunks `/content` into `content/.generated/rag-index.json`  |

## Editing content

Everything visible on the site lives in `/content/*.ts`. Those files are the single source of
truth for the pages, the ⌘K palette, the terminal **and** the chatbot's knowledge base. Missing
facts are written as `todo("…")`: they show highlighted in `next dev`, are hidden in production
builds (unless `NEXT_PUBLIC_SHOW_TODOS=1`), and are never indexed by the chatbot.

## Chatbot

- Retrieval: BM25 over ~40 content chunks; set `VOYAGE_API_KEY` to add dense embeddings at build
  time (hybrid search with reciprocal-rank fusion).
- Generation: Claude (`CHAT_MODEL`, default `claude-opus-5-5`) with a strict grounding prompt,
  streamed as NDJSON with citations back to site sections. Server-side refusal fallback is enabled.
- Guardrails: per-IP rate limits, 500-character questions, 8-turn history cap, API key server-only.
- Without a key (or when the API fails) the widget shows a friendly message and the email address.

## Easter eggs

`⌘K` / `Ctrl+K` command palette · `` ` `` terminal (try `sudo hire utkarsh`) · the Konami code.
