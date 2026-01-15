<div align="center">

<a href="#sysdes--system-design-interview-simulator">
  <img src="public/banner.svg" alt="SysDes — System Design Interview Simulator" width="900"/>
</a>

<br/><br/>

[![SysDes](https://img.shields.io/badge/SysDes-Interview_Simulator-22d3ee?style=for-the-badge)](README.md)
[![By Shubham](https://img.shields.io/badge/by-Shubham-7c3aed?style=for-the-badge)](https://github.com/subhm2004)

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

[Quick Start](#quick-start) · [Features](#features) · [Studio](#studio) · [Dashboard](#progress-dashboard) · [35 Problems](#35-design-problems) · [Tech Stack](#tech-stack) · [API](#backend-api)

</div>

---

## At a glance

| | | | | |
|:---:|:---:|:---:|:---:|:---:|
| **36** | **35** | **5** | **500K** | **∞** |
| Components | Design problems | Score axes | Max QPS | Practice sessions |
| DNS → cache → queues → DB | Easy → Expert | 100-point rubric | CDN tier | Saved to your dashboard |

---

## Why SysDes?

Most system design prep is **passive** — articles, YouTube videos, blog posts. You read, you nod, you forget.

**SysDes is active.** Drag real infrastructure onto a canvas, wire the dependencies, run 500K req/s through it, watch the bottlenecks light up, and get scored across five axes the same way a FAANG interviewer would evaluate you. Every score you earn is saved to your personal dashboard so you can see exactly where you improve over time.

Think of it as a **flight simulator for system design rounds.**

---

## Features

### 36 Infrastructure Components

Everything you need to build interview-grade diagrams, organized by layer:

| Layer | Components |
|-------|-----------|
| **Networking** | DNS, CDN, Load Balancer, API Gateway, Rate Limiter, Reverse Proxy, Origin Shield |
| **Compute** | App Server, Auth Service, WebSocket Server, Task Scheduler, Stream Processor, Notification Service |
| **Storage** | SQL DB, NoSQL DB, Cache / Redis, Object Storage, Search / Elasticsearch, Graph DB, Time-Series DB, Data Warehouse, File Store, Vector DB, Geospatial Index |
| **Messaging** | Message Queue (Kafka), Pub/Sub |
| **Infrastructure** | Service Mesh, Monitoring, Service Discovery, Distributed Lock, Circuit Breaker, Coordination Service, Config Service, ID Generator, Sharded Counter |
| **Wildcard** | Custom Component — double-click to rename |

Every component ships with **benchmark-backed specs:**

| Component | Max QPS | Latency |
|-----------|---------|---------|
| Load Balancer | 1,000,000 | 1 ms |
| Cache / Redis | 100,000 | 1 ms |
| CDN | 500,000 | 15 ms |
| NoSQL (DynamoDB) | 50,000 | 3 ms |
| SQL Database | 10,000 | 8 ms |
| Kafka | 100,000 | 5 ms |
| Elasticsearch | 20,000 | 10 ms |
| Object Storage (S3) | 25,000 | 75 ms |

---

### Traffic Simulation

Run production-scale load through your diagram and watch it propagate in real time:

- **Kahn's topological sort** — correct fan-in QPS propagation, no guesswork
- **Smart fan-out** — load balancers split evenly; other nodes forward per your graph shape
- **Per-node metrics** — live QPS, utilization %, p99 latency, health status on every node
- **Bottleneck detection** — overloaded nodes turn red and cascade downstream
- **Cycle detection** — warns you before simulation starts if your graph has circular dependencies
- **Load dial** — ~1K → 500K req/s, configurable ramp-up

---

### 5-Axis Scoring Engine

Hit **Evaluate** and get an interviewer-style score across five dimensions, each worth 20 points:

| Axis | What it rewards |
|------|-----------------|
| **Scalability** | Load balancers, horizontal scale, caching layer, async paths |
| **Availability** | No obvious SPOFs, redundancy, monitoring, circuit breakers |
| **Latency** | CDN at the edge, cache-before-DB, short request paths |
| **Cost Efficiency** | Right-sized components, sensible persistence mix |
| **Trade-offs** | Coherent choices, depth vs. breadth, design rationale |

**Verdict bands:**

| Score | Verdict |
|-------|---------|
| 86 – 100 | Architect Level |
| 71 – 85 | Excellent |
| 51 – 70 | Good |
| 31 – 50 | Decent |
| 0 – 30 | Needs Work |

Every evaluation is **automatically saved** to your account so the dashboard stays current.

---

### Progress Dashboard (`/dashboard`)

Your personal practice analytics — sign in once and every Evaluate you run is tracked:

- **4 stat cards** — Total attempts, best score ever, current practice streak, problems attempted
- **Radar chart** — Pentagon SVG visualization of your average across all 5 axes, updated after every session
- **Recent activity** — Last 10 evaluations with problem name, verdict, score, and date
- **Problem progress table** — Best score per problem, attempt count, last played date, sorted by recency

The dashboard is auth-gated — unauthenticated visitors see a sign-in screen with a Google login button.

---

### Interview Mode (~45 min)

Structured, timed practice that mirrors an actual system design round:

| Phase | Time | Focus |
|-------|------|-------|
| Requirements | 5 min | Functional + non-functional clarity |
| Estimation | 5 min | Back-of-envelope math |
| API Design | 5 min | Core endpoints and contracts |
| Data Model | 5 min | Entities, relationships, schema |
| High-Level Design | 15 min | Canvas architecture — the main act |
| Deep Dive | 10 min | Trade-offs, failure modes, bottlenecks |

Timer colors: **green** on pace · **yellow** running over · **red** needs correction.

---

### AI Assistant (Groq / LLaMA)

Chat with an AI about the system you are drawing — not static docs, but your actual canvas:

- **Canvas-aware** — every message includes a live summary of your current nodes and edges
- **Coaching** — ask about trade-offs, bottlenecks, what to add next, failure modes
- **Canvas edits** — the model can return structured operations (add components, connect edges, add notes, clear canvas) that are applied directly to your diagram
- **Explanation-only mode** — just want an explanation without touching the canvas? It handles that too
- **Model chain** — tries `llama-3.3-70b-versatile` → `llama-3.1-8b-instant` → `mixtral-8x7b-32768` with automatic fallback on rate limits

---

### Problem Filters

The problem library is fully filterable across three dimensions:

- **Difficulty** — Easy / Medium / Hard toggle pills
- **Company tags** — Google, Meta, Amazon, Microsoft, Netflix, Stripe, Uber, Airbnb
- **Search** — full-text across problem title and topic tags
- **Result count** — live count as you filter; clear-all button when active

---

### Edge Protocols

| Protocol | Style | Example |
|----------|-------|---------|
| HTTP | Solid arrow | App Server → Database |
| gRPC | Solid + badge | Microservice → Microservice |
| WebSocket | Solid + badge | Client → WS Server |
| Pub/Sub | Dashed + badge | Producer → Kafka → Consumer |
| TCP | Solid + badge | Cache ↔ App Server |

Click any edge to set protocol, sync/async toggle, and a custom label.

---

### Concept Library

Select any component on the canvas to open its reference card:

- **When to use** — strong-fit scenarios  
- **When not to** — common misuse patterns  
- **Trade-offs** — engineering tension  
- **Interview tips** — crisp talking points  
- **Patterns** — cache-aside, write-through, fan-out, saga, …  
- **Real-world grounding** — how Netflix, Uber, Stripe, and others actually use it

---

### Trade-off Decision Log

14 built-in comparison cards covering classic interview trade-offs:

SQL vs NoSQL · sync vs async · monolith vs microservices · REST vs gRPC · push vs pull · strong vs eventual consistency · horizontal vs vertical scale · partitioning strategies · delivery semantics · and more.

Log your own decisions with rationale during a practice session.

---

## Studio

The workspace at `/studio`:

- **Canvas tabs** — *My Design* plus optional **Reference** tabs (read-only model solutions with a REF badge)
- **Pen overlay** — annotate the canvas with a freehand pen (colors, stroke width, eraser)
- **Persisted state** — designs, tabs, and sidebar preferences survive page reloads (Zustand + localStorage)
- **Save / Load** — name and save multiple designs locally; load them back anytime
- **Export PNG** — one-click canvas screenshot

### Keyboard Shortcuts

On macOS use **⌘** in place of **Ctrl**. Press **`?`** anytime for the full list.

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

## 35 Design Problems

Organized into four tiers:

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
| 4 | Twitter / News Feed | Hard | Fan-out on write/read, timelines |
| 5 | Chat System | Hard | WebSocket, message ordering, delivery |
| 6 | Uber / Ride Sharing | Hard | Geospatial index, real-time matching |
| 7 | YouTube / Video Streaming | Hard | CDN, transcoding pipeline |
| 8 | Notification System | Medium | Multi-channel delivery, queues |
| 9 | Typeahead Autocomplete | Medium | Trie, prefix search, Redis sorted sets |
| 10 | Web Crawler | Medium | Frontier, dedup, politeness |
| 11 | Distributed Cache | Medium | Consistent hashing, hot key mitigation |
| 12 | Payment System | Hard | Idempotency, saga pattern, double-spend |
| 13 | Ticket Booking | Hard | Seat locking, queue-based fairness |
| 14 | Google Docs | Hard | CRDT / OT, real-time collaboration |
| 15 | Dropbox / File Storage | Hard | Chunking, delta sync, conflict resolution |
| 16 | Instagram | Medium | Media pipeline, social graph, feed |
| 17 | Spotify / Music Streaming | Medium | ABR streaming, playlist, recommendations |
| 18 | E-Commerce | Hard | Inventory, events, checkout saga |
| 19 | Slack | Hard | Channels, threads, full-text search |
| 20 | Metrics / Monitoring | Hard | Time-series DB, alerting, cardinality |
| 21 | Netflix | Hard | Recommendations, DRM, adaptive streaming |
| 22 | Tinder / Dating | Medium | Geo proximity, ranking, swipe |
| 23 | Google Maps | Hard | Tile serving, routing, ETA |
| 24 | Zoom | Hard | WebRTC, SFU, simulcast |
| 25 | Food Delivery | Hard | Dispatch optimization, ETA, geo |
| 26 | Reddit | Medium | Post ranking, nested threads |
| 27 | Airbnb | Hard | Search, calendar locks, booking |
| 28 | WhatsApp | Hard | End-to-end encryption, delivery receipts |
| 29 | Google Search | Hard | Inverted index, ranking, crawl pipeline |
| 30 | Yelp / Local Search | Medium | Geo search, review aggregation |
| 31 | TikTok | Hard | Recommendation engine, video pipeline |
| 32 | Message Queue (Kafka) | Hard | Consumer groups, delivery semantics |
| 33 | Digital Wallet / UPI | Hard | Ledger, transfers, compliance |
| 34 | Online Code Editor | Medium | Sandbox, collaboration, execution |
| 35 | CI/CD Pipeline | Medium | DAGs, artifact caching, canaries |

</details>

Each problem includes: scale targets (QPS, storage, latency), constraints, topic tags, company tags, hints, and a reference architecture you can load onto the canvas.

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Groq](https://console.groq.com) API key (free) for the AI assistant
- Google OAuth credentials for login + dashboard (optional)

### 1 — Clone

```bash
git clone https://github.com/subhm2004/SysDes.git
cd SysDes
```

### 2 — Frontend

```bash
cd frontend
cp .env.example .env    # add GROQ_API_KEY
npm install
npm run dev             # http://localhost:3000
```

The studio is **fully usable without the backend** — canvas, simulation, scoring, AI chat, all work. Only Google sign-in, score saving, and the dashboard require the backend.

### 3 — Backend (auth + dashboard)

```bash
cd backend
cp .env.example .env    # fill in all values
npm install
npm run db:push         # apply Drizzle schema to your Neon DB
npm run dev             # http://localhost:4000
```

**Backend `.env` reference:**

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Generate with: openssl rand -base64 32
JWT_SECRET=your_secret_here

# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# https://console.groq.com
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile   # optional, this is the default

FRONTEND_URL=http://localhost:3000
PORT=4000
```

---

## Backend API

Express.js backend on port 4000.

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/auth/google` | Redirect to Google OAuth consent screen |
| `GET` | `/api/auth/google/callback` | OAuth callback — issues a 30-day JWT |
| `GET` | `/api/auth/me` | Current user profile (`Authorization: Bearer <token>`) |

### Scores

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/scores` | Save an evaluation (called automatically on every Evaluate) |
| `GET` | `/api/scores` | Paginated score history for the signed-in user |
| `GET` | `/api/scores/stats` | Aggregated stats — best score, streak, axis averages, per-problem bests |

### Designs

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/designs` | List saved canvas designs |
| `POST` | `/api/designs` | Save a new design snapshot |
| `PUT` | `/api/designs/:id` | Update an existing design |
| `DELETE` | `/api/designs/:id` | Delete a design |

All score and design routes require `Authorization: Bearer <jwt>`.

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Canvas | `@xyflow/react` v12 |
| State | Zustand v5 with `persist` middleware |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Export | `html-to-image` |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ (ESM) |
| Framework | Express.js + TypeScript |
| ORM | Drizzle ORM |
| Database | Neon serverless PostgreSQL |
| Auth | Google OAuth 2.0 + JWT (30-day tokens) |
| AI | Groq SDK — LLaMA 3.3 70B |

---

## Project Structure

```
SysDes/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx                 # Landing page
│       │   ├── studio/                  # Canvas workspace
│       │   ├── dashboard/               # Progress dashboard (auth-gated)
│       │   └── api/ai/chat/             # Next.js → Groq proxy
│       ├── components/
│       │   ├── ai/                      # AI chat panel
│       │   ├── auth/                    # StudioGuard, DashboardGuard, UserMenu
│       │   ├── canvas/                  # React Flow canvas, tabs, pen overlay
│       │   ├── dashboard/               # DashboardPage, radar chart
│       │   ├── dialogs/                 # Save/load, shortcuts, confirm, support
│       │   ├── interview/               # Timed interview mode
│       │   ├── landing/                 # 20+ premium landing page sections
│       │   ├── layout/                  # AppShell, TopBar
│       │   ├── panel/                   # Run, score, capacity, trade-offs panels
│       │   └── sidebar/                 # Component palette, problem picker
│       ├── data/                        # 36 components, 35 problems, concepts
│       ├── engine/simulator.ts          # Topological sort + QPS propagation
│       ├── scoring/                     # 5-axis rubric + per-axis rules
│       ├── store/                       # Zustand stores (canvas, sim, auth, pen…)
│       └── types/                       # Shared TypeScript interfaces
│
└── backend/
    └── src/
        ├── index.ts                     # Express entry point + middleware
        ├── db/                          # Drizzle schema + Neon client
        └── routes/
            ├── auth.ts                  # Google OAuth + JWT
            ├── scores.ts                # Score CRUD + stats aggregation
            ├── designs.ts               # Canvas design snapshots
            └── ai.ts                    # Groq proxy (optional)
```

---

## Learning Path

Work through problems in order or jump to what your next interview is testing:

| Stage | Problems |
|-------|---------|
| **Warm-up** | URL Shortener → Rate Limiter → Parking Lot |
| **Core patterns** | Notification System → Distributed Cache → Typeahead |
| **Social scale** | Instagram → Reddit → Twitter Feed |
| **Real-time** | Chat System → Zoom → Google Docs |
| **Infrastructure** | Kafka → CI/CD Pipeline → Metrics/Monitoring |
| **FAANG finals** | Uber → Netflix → Google Maps → WhatsApp → Google Search |

After each attempt: **Evaluate** → review per-axis feedback → open the **Reference** tab to compare against the model solution → check **Dashboard** to track your axis trends.

---

## Author

Built by **Shubham** — [github.com/subhm2004](https://github.com/subhm2004)

Feedback and PRs are welcome. If SysDes helps your interview prep, a ⭐ on the repo is appreciated.
