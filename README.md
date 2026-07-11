<div align="center">

<a href="https://system-dec.vercel.app">
  <img src="public/banner.svg" alt="SysDes — System Design Interview Simulator" width="900"/>
</a>

<br/><br/>

[![SysDes](https://img.shields.io/badge/SysDes-Interview_Simulator-22d3ee?style=for-the-badge)](https://system-dec.vercel.app)
[![By Shubham](https://img.shields.io/badge/by-Shubham-7c3aed?style=for-the-badge)](https://github.com/subhm2004)
[![Live](https://img.shields.io/badge/Live_Demo-▶_Try_Now-22c55e?style=for-the-badge)](https://system-dec.vercel.app)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow_v12-FF0072?style=for-the-badge)](https://reactflow.dev)

<br/>

### SysDes — System Design Interview Simulator

**Design · Simulate · Evaluate · Track**

*Stop reading articles. Practice like it's the real interview.*

[🚀 Live Demo](https://system-dec.vercel.app) · [Quick Start](#quick-start) · [Features](#features) · [35 Problems](#35-design-problems) · [Tech Stack](#tech-stack) · [API](#backend-api)

</div>

---

## What is SysDes?

Most system design prep is **passive** — articles, YouTube videos, blog posts. You read, you nod, you forget.

**SysDes is active.** It's a full-stack interview simulator where you:

1. **Pick a problem** — 35 real interview questions from Google, Meta, Amazon, Netflix, Stripe and more
2. **Design on a canvas** — drag 36 infrastructure components, wire them up with typed edges
3. **Run traffic simulation** — push up to 500K req/s through your diagram and watch bottlenecks light up in real time
4. **Get scored by AI** — Groq LLaMA 3.3 70B evaluates your design across 5 axes like a FAANG interviewer
5. **Track your progress** — every score is saved to your personal dashboard with radar charts and streak tracking

Think of it as a **flight simulator for system design rounds.**

---

## At a Glance

| | | | | |
|:---:|:---:|:---:|:---:|:---:|
| **36** | **35** | **5** | **500K** | **∞** |
| Components | Design problems | Score axes | Max QPS | Practice sessions |
| DNS → cache → queues → DB | Easy → Expert | 100-point rubric | CDN tier | Saved to your dashboard |

---

## Features

### 🧩 36 Infrastructure Components

Everything you need to build interview-grade diagrams, organized by layer:

| Layer | Components |
|-------|-----------|
| **Networking** | DNS, CDN, Load Balancer, API Gateway, Rate Limiter, Reverse Proxy, Origin Shield |
| **Compute** | App Server, Auth Service, WebSocket Server, Task Scheduler, Stream Processor, Notification Service |
| **Storage** | SQL DB, NoSQL DB, Cache / Redis, Object Storage, Search / Elasticsearch, Graph DB, Time-Series DB, Data Warehouse, File Store, Vector DB, Geospatial Index |
| **Messaging** | Message Queue (Kafka), Pub/Sub |
| **Infrastructure** | Service Mesh, Monitoring, Service Discovery, Distributed Lock, Circuit Breaker, Coordination Service, Config Service, ID Generator, Sharded Counter |
| **Wildcard** | Custom Component — double-click to rename anything |

Every component ships with **benchmark-backed specs** so your capacity estimates stay grounded:

| Component | Max QPS | p99 Latency |
|-----------|---------|-------------|
| Load Balancer | 1,000,000 | 1 ms |
| Cache / Redis | 100,000 | 1 ms |
| CDN | 500,000 | 15 ms |
| Kafka | 100,000 | 5 ms |
| NoSQL (DynamoDB) | 50,000 | 3 ms |
| SQL Database | 10,000 | 8 ms |
| Elasticsearch | 20,000 | 10 ms |
| Object Storage (S3) | 25,000 | 75 ms |

---

### ⚡ Traffic Simulation Engine

Run production-scale load through your diagram and watch it propagate in real time:

- **Kahn's topological sort** — correct fan-in QPS propagation, not a rough estimate
- **Smart fan-out** — load balancers split traffic evenly across downstream nodes
- **Per-node live metrics** — QPS received, utilization %, p99 latency, health status on every node
- **Bottleneck detection** — overloaded nodes turn red and cascade the signal downstream
- **Cycle detection** — warns you before simulation starts if your graph has circular dependencies
- **Load dial** — sweep from ~1K to 500K req/s with a configurable ramp-up duration

The engine implements a proper topological simulation — not just a visual toy. Fan-in QPS is summed correctly across multiple upstream nodes before a node's utilization is calculated.

---

### 🤖 5-Axis AI Scoring

Hit **Evaluate** and get an interviewer-style score from Groq LLaMA 3.3 70B — the same model used by top AI platforms:

| Axis | What it checks | Max |
|------|----------------|-----|
| **Scalability** | Load balancers, horizontal scale, caching layer, async processing paths | 20 |
| **Availability** | No single points of failure, redundancy, monitoring, circuit breakers | 20 |
| **Latency** | CDN at the edge, cache-before-DB, minimal hops in critical paths | 20 |
| **Cost Efficiency** | Right-sized components, sensible persistence mix, avoiding waste | 20 |
| **Trade-offs** | Coherent design choices, depth vs. breadth, articulated rationale | 20 |

**Verdict bands:**

| Score | Verdict | What it means |
|-------|---------|---------------|
| 86 – 100 | 🏆 Architect Level | Ready to pass a senior/staff round |
| 71 – 85 | ✅ Excellent | Strong candidate, minor gaps |
| 51 – 70 | 👍 Good | Solid fundamentals, needs polish |
| 31 – 50 | 📝 Decent | Core ideas present, missing depth |
| 0 – 30 | 🔧 Needs Work | Revisit the fundamentals |

Every evaluation result is **automatically saved** to your account — no manual action needed.

---

### 📊 Progress Dashboard

Your personal practice analytics at `/dashboard` — sign in once and every Evaluate you run is tracked forever:

- **4 stat cards** — Total attempts, best score ever, current practice streak, problems attempted
- **Radar chart** — Pentagon SVG showing your average per axis across all sessions, updated after every run
- **Recent activity feed** — Last 10 evaluations with problem name, verdict, score, and timestamp
- **Problem progress table** — Best score per problem, attempt count, last played, sorted by recency

The dashboard is auth-gated — sign in with Google to unlock it. The rest of the studio works without an account.

---

### 🎯 Interview Mode (45 min)

Structured, timed practice that mirrors an actual FAANG system design round:

| Phase | Time | Focus |
|-------|------|-------|
| Requirements | 5 min | Functional + non-functional clarity |
| Estimation | 5 min | Back-of-envelope math (DAU, QPS, storage) |
| API Design | 5 min | Core endpoints and contracts |
| Data Model | 5 min | Entities, relationships, schema choices |
| High-Level Design | 15 min | Canvas architecture — the main act |
| Deep Dive | 10 min | Trade-offs, failure modes, scaling bottlenecks |

Timer color cues: **green** on pace · **yellow** running over · **red** needs correction. The interview panel lives in the right sidebar and stays out of your way until you need it.

---

### 💬 AI Assistant (Groq / LLaMA 3.3 70B)

Chat with an AI that knows exactly what's on your canvas — not generic advice, but feedback on your actual design:

- **Canvas-aware context** — every message automatically includes a live summary of your current nodes and edges
- **Coaching mode** — ask about trade-offs, bottlenecks, what component to add next, and failure modes
- **Canvas edit mode** — the model can return structured operations (add node, connect edge, add annotation, clear canvas) that are applied directly to your diagram without copy-pasting
- **Explanation-only mode** — ask "why is a CDN important here?" without touching the canvas
- **Model chain** — tries `llama-3.3-70b-versatile` → `llama-3.1-8b-instant` → `mixtral-8x7b-32768` with automatic fallback on Groq rate limits

---

### 🗂️ Canvas Features

The workspace at `/studio`:

| Feature | Description |
|---------|-------------|
| **Canvas tabs** | *My Design* + optional **Reference** tabs (read-only model solutions with a `REF` badge) |
| **Pen overlay** | Annotate with a freehand pen — pick color, stroke width, erase |
| **Persisted state** | Designs, tabs, and sidebar preferences survive page reloads (Zustand + `localStorage`) |
| **Save / Load** | Name and save multiple designs; load them back anytime |
| **Export PNG** | One-click full-canvas screenshot |
| **Edge protocols** | HTTP, gRPC, WebSocket, Pub/Sub, TCP — each with a distinct visual style |
| **Concept library** | Click any node to open its reference card with trade-offs, patterns, and interview tips |
| **Trade-off log** | 14 built-in comparison cards (SQL vs NoSQL, sync vs async, monolith vs microservices, etc.) |

### Keyboard Shortcuts

On macOS use **⌘** in place of **Ctrl**. Press **`?`** anytime for the full cheat sheet.

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` / `⌘↵` | Run traffic simulation |
| `Ctrl+Shift+S` / `⌘⇧S` | Evaluate design (saves score to dashboard) |
| `Ctrl+S` / `⌘S` | Save design |
| `Ctrl+O` / `⌘O` | Load design |
| `Ctrl+E` / `⌘E` | Export canvas as PNG |
| `?` | Open keyboard shortcuts panel |
| `Delete` | Remove selected node or edge |
| `Escape` | Close panel / deselect |
| Middle-mouse drag | Pan canvas |

---

### 🔍 Problem Filters

The problem library is fully filterable across three dimensions:

- **Difficulty** — Easy / Medium / Hard toggle pills
- **Company tags** — Google, Meta, Amazon, Microsoft, Netflix, Stripe, Uber, Airbnb
- **Search** — full-text across problem title and topic tags
- **Live result count** — updates as you filter; clear-all button when active

---

## 35 Design Problems

Organized into four tiers from warm-up to expert:

| Tier | Problems |
|------|----------|
| **Foundations** | URL Shortener, Rate Limiter, Parking Lot |
| **Intermediate** | Notification System, Typeahead, Instagram, Spotify, Distributed Cache, Tinder, Reddit, Yelp |
| **Advanced** | Twitter Feed, Chat System, Web Crawler, Dropbox, E-Commerce, Slack, Online Code Editor, CI/CD Pipeline, Digital Wallet |
| **Expert** | Uber, YouTube, Payment System, Ticket Booking, Google Docs, Metrics/Monitoring, Netflix, Google Maps, Zoom, Food Delivery, Airbnb, WhatsApp, Google Search, TikTok, Kafka |

<details>
<summary><strong>Full problem list with difficulty and key concepts</strong></summary>

| # | Problem | Difficulty | Key Concepts |
|---|---------|------------|--------------|
| 1 | URL Shortener | Easy | Hashing, cache, read-heavy |
| 2 | Rate Limiter | Easy | Token bucket, sliding window, Redis |
| 3 | Parking Lot | Easy | State machines, availability |
| 4 | Notification System | Medium | Multi-channel delivery, queues |
| 5 | Typeahead Autocomplete | Medium | Trie, prefix search, Redis sorted sets |
| 6 | Instagram | Medium | Media pipeline, social graph, feed |
| 7 | Spotify / Music Streaming | Medium | ABR streaming, playlist, recommendations |
| 8 | Distributed Cache | Medium | Consistent hashing, hot key mitigation |
| 9 | Tinder / Dating | Medium | Geo proximity, ranking, swipe |
| 10 | Reddit | Medium | Post ranking, nested threads |
| 11 | Yelp / Local Search | Medium | Geo search, review aggregation |
| 12 | Twitter / News Feed | Hard | Fan-out on write/read, timelines |
| 13 | Chat System | Hard | WebSocket, message ordering, delivery |
| 14 | Web Crawler | Medium | Frontier, dedup, politeness |
| 15 | Dropbox / File Storage | Hard | Chunking, delta sync, conflict resolution |
| 16 | E-Commerce | Hard | Inventory, events, checkout saga |
| 17 | Slack | Hard | Channels, threads, full-text search |
| 18 | Online Code Editor | Medium | Sandbox, collaboration, execution |
| 19 | CI/CD Pipeline | Medium | DAGs, artifact caching, canaries |
| 20 | Digital Wallet / UPI | Hard | Ledger, transfers, compliance |
| 21 | Uber / Ride Sharing | Hard | Geospatial index, real-time matching |
| 22 | YouTube / Video Streaming | Hard | CDN, transcoding pipeline |
| 23 | Payment System | Hard | Idempotency, saga pattern, double-spend |
| 24 | Ticket Booking | Hard | Seat locking, queue-based fairness |
| 25 | Google Docs | Hard | CRDT / OT, real-time collaboration |
| 26 | Metrics / Monitoring | Hard | Time-series DB, alerting, cardinality |
| 27 | Netflix | Hard | Recommendations, DRM, adaptive streaming |
| 28 | Google Maps | Hard | Tile serving, routing, ETA |
| 29 | Zoom | Hard | WebRTC, SFU, simulcast |
| 30 | Food Delivery | Hard | Dispatch optimization, ETA, geo |
| 31 | Airbnb | Hard | Search, calendar locks, booking |
| 32 | WhatsApp | Hard | End-to-end encryption, delivery receipts |
| 33 | Google Search | Hard | Inverted index, ranking, crawl pipeline |
| 34 | TikTok | Hard | Recommendation engine, video pipeline |
| 35 | Kafka / Message Queue | Hard | Consumer groups, delivery semantics |

</details>

Each problem includes: scale targets (QPS, storage, latency SLAs), constraints, topic tags, company tags, hints, and a reference architecture you can load onto the canvas and compare against your own.

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Groq](https://console.groq.com) API key (free) for the AI assistant
- Google OAuth credentials (optional — only needed for login + dashboard)

### 1 — Clone

```bash
git clone https://github.com/subhm2004/SysDes.git
cd SysDes
```

### 2 — Frontend

```bash
cd frontend
cp .env.example .env    # add GROQ_API_KEY + NEXT_PUBLIC_API_URL
npm install
npm run dev             # → http://localhost:3000
```

> The studio is **fully usable without the backend** — canvas, simulation, scoring, AI chat, all work offline. Only Google sign-in, score saving, and the dashboard require the backend.

### 3 — Backend (auth + dashboard)

```bash
cd backend
cp .env.example .env    # fill in all values below
npm install
npm run db:push         # apply Drizzle schema to your Neon DB (one-time)
npm run dev             # → http://localhost:4000
```

**Backend `.env` reference:**

```env
# Neon PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Generate with: openssl rand -base64 32
JWT_SECRET=your_secret_here

# From https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# From https://console.groq.com
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile   # optional, this is the default

FRONTEND_URL=http://localhost:3000
PORT=4000
```

---

## Backend API

Express.js REST API running on port 4000. All protected routes require `Authorization: Bearer <jwt>`.

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/auth/google` | — | Redirect to Google OAuth consent screen |
| `GET` | `/api/auth/google/callback` | — | OAuth callback — issues a signed 30-day JWT |
| `GET` | `/api/auth/me` | ✅ | Return current user profile from token |
| `GET` | `/api/health` | — | Health check endpoint |

### Scores

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/scores` | ✅ | Save an evaluation result (auto-called on every Evaluate) |
| `GET` | `/api/scores` | ✅ | Paginated score history (`?limit=20&offset=0`) |
| `GET` | `/api/scores/stats` | ✅ | Aggregated stats — best score, streak, axis averages, per-problem bests |
| `GET` | `/api/scores/problem/:id` | ✅ | All attempts for one specific problem |

### Designs

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/designs` | ✅ | List all saved canvas designs for the user |
| `POST` | `/api/designs` | ✅ | Save a new design snapshot (nodes + edges + strokes) |
| `PUT` | `/api/designs/:id` | ✅ | Update an existing design |
| `DELETE` | `/api/designs/:id` | ✅ | Delete a design |

---

## Tech Stack

### Frontend

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Server components, file-based routing, Vercel-native |
| UI | React 19 + TypeScript | Strict typing, concurrent features |
| Canvas | `@xyflow/react` v12 | Handles 100+ nodes with smooth pan/zoom |
| State | Zustand v5 + `persist` | Minimal boilerplate, localStorage sync out of the box |
| Styling | Tailwind CSS v4 | Utility-first, zero runtime |
| Animation | Framer Motion | Page transitions, panel slides |
| Icons | Lucide React | Consistent icon set |
| Export | `html-to-image` | Full-canvas PNG in one call |

### Backend

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js 18+ (ESM) | Native ES modules, top-level await |
| Framework | Express.js + TypeScript | Lightweight, predictable routing |
| ORM | Drizzle ORM | Type-safe SQL, schema-first, no magic |
| Database | Neon serverless PostgreSQL | Serverless-native, branching, generous free tier |
| Auth | Google OAuth 2.0 + JWT | No passwords to manage; 30-day stateless tokens |
| AI | Groq SDK — LLaMA 3.3 70B | Fastest LLM inference available; free tier |

---

## Database Schema

```
users          — id, name, email, image, createdAt, updatedAt
scores         — id, userId, problemId, axes (JSON), total, verdict, durationSec, createdAt
savedDesigns   — id, userId, name, problemId, nodes, edges, strokes, annotations, createdAt, updatedAt
```

All relations use the Google profile ID (`users.id`) as the foreign key — no separate UUID generation needed for the user table.

---

## Project Structure

```
SysDes/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx                 # Landing page (20+ sections)
│       │   ├── studio/page.tsx          # Canvas workspace
│       │   ├── dashboard/page.tsx       # Progress dashboard (auth-gated)
│       │   └── api/ai/chat/route.ts     # Next.js → Groq proxy
│       ├── components/
│       │   ├── ai/                      # AI chat panel + message renderer
│       │   ├── auth/                    # StudioGuard, DashboardGuard, UserMenu
│       │   ├── canvas/                  # ReactFlow canvas, tabs, pen overlay, edges, nodes
│       │   ├── dashboard/               # DashboardPage, radar chart, stat cards
│       │   ├── dialogs/                 # Save, load, shortcuts, confirm, support dialogs
│       │   ├── interview/               # Timed interview mode panel
│       │   ├── landing/                 # Hero, features, problems, pricing sections
│       │   ├── layout/                  # AppShell, TopBar
│       │   ├── panel/                   # Run, score, capacity, trade-offs panels
│       │   └── sidebar/                 # Component palette, problem picker
│       ├── data/
│       │   ├── components.ts            # 36 component definitions + specs
│       │   ├── problems.ts              # 35 problem definitions + reference architectures
│       │   └── concepts.ts              # Component concept cards (trade-offs, patterns, tips)
│       ├── engine/
│       │   └── simulator.ts             # Topological sort + QPS propagation engine
│       ├── scoring/
│       │   ├── scorer.ts                # 5-axis rubric runner
│       │   └── rules/                   # Per-axis rule definitions
│       ├── store/
│       │   ├── appStore.ts              # Canvas state (nodes, edges, tabs, annotations)
│       │   ├── authStore.ts             # Auth state + API helpers
│       │   ├── simulationStore.ts       # Simulation run state + results
│       │   └── penStore.ts              # Pen tool state
│       └── types/                       # Shared TypeScript interfaces
│
└── backend/
    └── src/
        ├── index.ts                     # Express entry + CORS + health check
        ├── middleware/
        │   └── auth.ts                  # JWT sign/verify + requireAuth middleware
        ├── db/
        │   ├── schema.ts                # Drizzle table definitions
        │   └── index.ts                 # Neon client + Drizzle instance
        └── routes/
            ├── auth.ts                  # Google OAuth flow + /me endpoint
            ├── scores.ts                # Score CRUD + aggregated stats
            ├── designs.ts               # Canvas design snapshots CRUD
            └── ai.ts                    # Groq proxy route
```

---

## Learning Path

Work through problems in order or jump to what your next interview is testing:

| Stage | Problems | Why |
|-------|---------|-----|
| **Warm-up** | URL Shortener → Rate Limiter → Parking Lot | Core patterns, no scale pressure |
| **Core patterns** | Notification System → Distributed Cache → Typeahead | Queues, caching, search |
| **Social scale** | Instagram → Reddit → Twitter Feed | Fan-out, social graphs, timelines |
| **Real-time** | Chat System → Zoom → Google Docs | WebSocket, WebRTC, CRDT |
| **Infrastructure** | Kafka → CI/CD Pipeline → Metrics/Monitoring | Platform engineering depth |
| **FAANG finals** | Uber → Netflix → Google Maps → WhatsApp → Google Search | Everything at once |

After each attempt: **Evaluate** → review per-axis feedback → open the **Reference** tab to compare against the model solution → check your **Dashboard** to see axis trends over time.

---

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Vercel | Root Directory: `frontend` |
| Backend | Render | Root Directory: `backend`, Build: `npm run build`, Start: `npm start` |
| Database | Neon | Serverless PostgreSQL, run `npm run db:push` once after deploy |

After deploying both services, wire them together:
- Set `NEXT_PUBLIC_API_URL` on Vercel to your Render URL
- Set `FRONTEND_URL` on Render to your Vercel URL
- Add both URLs to Google Cloud Console OAuth credentials

---

## Author

Built by **Shubham** — [github.com/subhm2004](https://github.com/subhm2004)

If SysDes helps your interview prep, a ⭐ on the repo goes a long way. Feedback and PRs are welcome.
