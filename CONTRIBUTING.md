# Contributing to SysDes

Thanks for taking the time to contribute. SysDes is a system design interview simulator — any improvement that makes it more useful for people preparing for interviews is welcome.

---

## Ways to contribute

- **Add a new design problem** — the most impactful contribution
- **Add a new infrastructure component** — with realistic specs
- **Fix a bug** — check open issues first
- **Improve the AI scoring** — better rubric rules, edge case handling
- **UI / UX improvements** — the canvas, panels, landing page
- **Docs** — clearer setup instructions, examples

---

## Getting started locally

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- A [Groq](https://console.groq.com) API key (free)

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/SysDes.git
cd SysDes

# 2. Frontend
cd frontend
cp .env.example .env   # add GROQ_API_KEY
npm install
npm run dev            # → http://localhost:3000

# 3. Backend (optional — only needed for auth + dashboard)
cd ../backend
cp .env.example .env   # fill in all values
npm install
npm run db:push        # one-time DB migration
npm run dev            # → http://localhost:4000
```

> The studio works fully without the backend. You only need the backend if you're working on auth, score saving, or the dashboard.

---

## Adding a design problem

Problems live in [`frontend/src/data/problems.ts`](frontend/src/data/problems.ts).

Each problem needs:

```ts
{
  id: "unique-kebab-id",
  title: "Problem Title",
  difficulty: "Easy" | "Medium" | "Hard",
  companies: ["Google", "Meta"],   // use existing tags
  tags: ["caching", "cdn"],
  description: "What the candidate needs to design.",
  constraints: [
    "100M DAU",
    "Read-heavy (95% reads)",
  ],
  hints: [
    "Start with a CDN for static assets.",
  ],
  referenceSolution: {
    nodes: [
      { componentId: "cdn",    x: 100, y: 80  },
      { componentId: "lb",     x: 300, y: 80  },
      { componentId: "app-server", x: 500, y: 80 },
    ],
    edges: [
      { source: "cdn", target: "lb" },
      { source: "lb",  target: "app-server" },
    ],
  },
}
```

Use component IDs from [`frontend/src/data/components.ts`](frontend/src/data/components.ts).

---

## Adding an infrastructure component

Components live in [`frontend/src/data/components.ts`](frontend/src/data/components.ts).

```ts
{
  id: "my-component",
  label: "My Component",
  category: "Compute",   // Networking | Compute | Storage | Messaging | Infrastructure
  icon: "⚙️",
  maxQPS: 10000,
  latencyMs: 5,
  scalable: true,
  description: "One sentence on what this does.",
  whenToUse: ["Use case 1", "Use case 2"],
  tradeoffs: ["Pro: ...", "Con: ..."],
  interviewTips: ["Mention X when asked about Y"],
}
```

---

## Pull request checklist

- [ ] Branch off `main`, name it `feat/...` or `fix/...`
- [ ] TypeScript — no `any`, no new TS errors (`npm run build` must pass in `backend/`)
- [ ] Existing UI still works — open the studio and run a simulation
- [ ] Commit messages follow the pattern already in the repo (`feat:`, `fix:`, `chore:`, `docs:`)
- [ ] One PR per feature / fix — keep it focused

---

## Reporting bugs

Open a [GitHub issue](https://github.com/subhm2004/SysDes/issues) with:

1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Browser + OS (for UI bugs)

---

## Project structure (quick reference)

```
frontend/src/
  data/
    problems.ts      ← add problems here
    components.ts    ← add components here
    concepts.ts      ← component reference cards
  engine/
    simulator.ts     ← traffic simulation logic
  scoring/           ← AI scoring rules per axis

backend/src/
  routes/            ← auth, scores, designs, ai
  db/schema.ts       ← Drizzle DB schema
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/subhm2004/SysDes/discussions) or file an issue — happy to help.
