<div align="center">

<a href="#sysdes--system-design-interview-simulator">
  <img src="public/banner.svg" alt="SysDes — System Design Interview Simulator" width="900"/>
</a>

<br/><br/>

[![SysDes](https://img.shields.io/badge/SysDes-Interview_Simulator-22d3ee?style=for-the-badge)](README.md)
[![By Shubham](https://img.shields.io/badge/by-Shubham-7c3aed?style=for-the-badge)](README.md)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow_v12-FF0072?style=for-the-badge)](https://reactflow.dev)

<br/>

### SysDes — System Design Interview Simulator

**Design · Run · Evaluate · Ship**

*Hands-on system design practice — not passive reading.*

[Quick Start](#quick-start) · [Features](#features) · [At a glance](#at-a-glance) · [35 Problems](#35-design-problems) · [Tech Stack](#tech-stack) · [Contributing](#contributing)

</div>

---

## At a glance

| | | | |
|:---:|:---:|:---:|:---:|
| **30** | **35** | **5** | **500K** |
| Components | Design problems | Score categories | Max QPS (CDN tier) |
| DNS → cache → queues → data | Easy → Expert | 100-point rubric | Configurable load |

---

## Why SysDes?

Most system design prep is passive — articles and videos. **SysDes is active practice.** Drag real infrastructure onto a canvas, wire dependencies, simulate production-scale traffic, and get scored the way an interviewer would.

Think of it as a **flight simulator** for system design rounds.

---

## Features

<div align="center">
  <img src="public/features.svg" alt="Features overview" width="800"/>
</div>

<br/>

<table>
<tr>
<td width="50%">

### 30 Infrastructure Components

Everything you need for interview-grade diagrams:

**Networking** — DNS, CDN, Load Balancer, API Gateway, Rate Limiter, Reverse Proxy, Origin Shield

**Compute** — App Server, Auth Service, WebSocket Server, Task Scheduler, Stream Processor, Notification Service

**Storage** — SQL DB, NoSQL DB, Cache/Redis, Object Storage, Search/ES, Graph DB, Time-Series DB, Data Warehouse, File Store

**Infrastructure** — Message Queue, Service Mesh, Monitoring, Service Discovery, Distributed Lock, Circuit Breaker, Coordination Service

**Special** — Custom Component (double-click to rename)

</td>
<td width="50%">

### Realistic specs

Each component ships with **benchmark-backed** numbers:

| Component | Max QPS | Latency |
|-----------|---------|---------|
| Load Balancer | 1,000,000 | 1ms |
| Cache/Redis | 100,000 | 1ms |
| SQL Database | 10,000 | 8ms |
| NoSQL (DynamoDB) | 50,000 | 3ms |
| Kafka | 100,000 | 5ms |
| Elasticsearch | 20,000 | 10ms |
| Object Storage (S3) | 25,000 | 75ms |
| CDN | 500,000 | 15ms |

Values are aligned with public docs and typical benchmarks.

</td>
</tr>
</table>

---

### Traffic simulation

<div align="center">
  <img src="public/traffic-sim.svg" alt="Traffic simulation" width="800"/>
</div>

<br/>

- **Kahn’s topological sort** for correct fan-in QPS propagation  
- **Smart fan-out** — LBs split evenly; other nodes forward per your graph  
- **Per-node metrics** — QPS, utilization %, latency, health status  
- **Bottleneck & cascade** visualization  
- **Cycle detection** with warnings  
- **Load dial** — about **1K → 500K** req/s

---

### 5-category scoring

<div align="center">
  <img src="public/scoring.svg" alt="Scoring engine" width="800"/>
</div>

<br/>

Interview-style scoring across five axes:

| Category | What it rewards |
|----------|-----------------|
| **Scalability** | LB, horizontal scale, caching, async paths |
| **Availability** | No obvious SPOFs, redundancy, monitoring, backpressure |
| **Latency** | CDN, cache-before-DB, short paths |
| **Cost efficiency** | Right-sized pieces, sensible persistence mix |
| **Trade-offs** | Coherent choices, depth vs breadth |

**Verdict bands:** Needs Work (&lt;31) · Decent (&lt;51) · Good (&lt;71) · Excellent (&lt;86) · **Architect** (86+)

---

### Interview mode (~45 min)

<div align="center">
  <img src="public/interview-flow.svg" alt="Six-phase interview flow" width="800"/>
</div>

<br/>

Timed, phase-based practice:

1. **Requirements** (5m) — Functional + non-functional clarity  
2. **Estimation** (5m) — Back-of-envelope math  
3. **API design** (5m) — Core endpoints  
4. **Data model** (5m) — Entities + relationships  
5. **High-level design** (15m) — Canvas architecture  
6. **Deep dive** (10m) — Trade-offs + failure modes  

Timer colors: **green** on track · **yellow** over target · **red** needs pace correction.

---

### Edge labels & protocols

| Protocol | Style | Example |
|----------|-------|---------|
| HTTP | Solid | App → DB |
| gRPC | Solid + badge | Service → service |
| WebSocket | Solid + badge | Client → WS tier |
| pub/sub | Dashed + badge | Queue → consumer |
| TCP | Solid + badge | Cache ↔ app |

Click an edge to set protocol, sync/async, and a custom label.

---

### Concept library

Select any component for:

- **When to use** — strong-fit scenarios  
- **When not to** — common misuse  
- **Trade-offs** — engineering tension  
- **Interview tips** — crisp talking points  
- **Patterns** — cache-aside, write-through, …  
- **Real systems** — grounded examples (Netflix, Uber, …)

---

### Trade-off decision log

**14** built-in comparison cards: SQL vs NoSQL, sync vs async, monolith vs microservices, REST vs gRPC, partitioning strategies, delivery semantics, and more. Log your own calls with rationale during practice.

---

### Learning path

| Tier | Examples | Focus |
|------|----------|--------|
| **Foundations** | URL shortener, rate limiter, parking lot | Core primitives |
| **Intermediate** | Notifications, autocomplete, Instagram, Spotify, distributed cache | Combining services |
| **Advanced** | Twitter, chat, crawler, Dropbox, e-commerce | Multi-piece systems |
| **Expert** | Uber, YouTube, payments, Docs, Slack, Netflix, maps, WhatsApp, Kafka, … | Large, messy reality |

Checkboxes for completion; prerequisites surface per problem.

---

## 35 Design Problems

<details>
<summary><strong>Expand — full problem list</strong></summary>

| # | Problem | Difficulty | Key concepts |
|---|---------|------------|--------------|
| 1 | URL Shortener | Easy | Hashing, cache, read-heavy |
| 2 | Rate Limiter | Easy | Token bucket, sliding window, Redis |
| 3 | Parking Lot | Easy | Events, availability |
| 4 | Twitter / News Feed | Hard | Fan-out, timelines |
| 5 | Chat System | Hard | WebSocket, ordering |
| 6 | Uber / Ride Sharing | Hard | Geospatial, matching |
| 7 | YouTube / Video | Hard | CDN, transcoding |
| 8 | Notification System | Medium | Queues, multi-channel |
| 9 | Typeahead | Medium | Trie, prefix search |
| 10 | Web Crawler | Medium | Frontier, dedup |
| 11 | Distributed Cache | Medium | Consistent hashing, hot keys |
| 12 | Payment System | Hard | Idempotency, saga |
| 13 | Ticket Booking | Hard | Queuing, seat locks |
| 14 | Google Docs | Hard | CRDT/OT, collaboration |
| 15 | Dropbox / Files | Hard | Chunking, sync |
| 16 | Instagram | Medium | Media pipeline, feed |
| 17 | Spotify | Medium | ABR, recommendations |
| 18 | E-Commerce | Hard | Inventory, events |
| 19 | Slack | Hard | Channels, search |
| 20 | Metrics / Monitoring | Hard | Time series, alerting |
| 21 | Netflix | Hard | Recs, streaming, DRM |
| 22 | Tinder / Dating | Medium | Geo, ranking |
| 23 | Google Maps | Hard | Tiles, routing |
| 24 | Zoom | Hard | WebRTC, SFU |
| 25 | Food Delivery | Hard | Dispatch, ETA |
| 26 | Reddit | Medium | Ranking, threads |
| 27 | Airbnb | Hard | Search, booking |
| 28 | WhatsApp | Hard | E2E, delivery |
| 29 | Google Search | Hard | Index, retrieval |
| 30 | Yelp / Local | Medium | Geo search |
| 31 | TikTok | Hard | Recs, transcoding |
| 32 | Message Queue | Hard | Groups, semantics |
| 33 | Digital Wallet / UPI | Hard | Transfers, compliance |
| 34 | Online Code Editor | Medium | Sandbox, collab |
| 35 | CI/CD Pipeline | Medium | DAGs, canaries |

</details>

Each problem ships with targets (QPS, storage, latency), constraints, hints, tags, and a reference shape.

---

## Quick Start

From this project folder:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** for the landing page, or **http://localhost:3000/studio** for the canvas.

If you clone from a remote later, use your own URL:

```bash
git clone <your-repo-url>
cd sysdes   # or your checkout folder name
npm install
npm run dev
```

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Run (simulate traffic) |
| `Ctrl+Shift+S` | Evaluate design |
| `Ctrl+S` | Save design |
| `Ctrl+O` | Load design |
| `Ctrl+E` | Export PNG |
| `Delete` | Remove selected node |
| `Escape` | Deselect |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Canvas | `@xyflow/react` (React Flow v12) |
| State | Zustand v5 (persisted) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Motion | Framer Motion |
| Icons | Lucide React |
| Export | html-to-image |

---

## Project structure

```
src/
├── app/
├── components/
│   ├── canvas/
│   ├── dialogs/
│   ├── interview/
│   ├── layout/
│   ├── panel/
│   ├── sidebar/
│   └── ui/
├── data/
│   ├── components.ts
│   ├── problems.ts
│   ├── conceptLibrary.ts
│   ├── interviewData.ts
│   ├── tradeoffCards.ts
│   └── learningPath.ts
├── engine/
│   └── simulator.ts
├── scoring/
│   ├── scorer.ts
│   └── rules/
├── store/
│   ├── appStore.ts
│   ├── canvasStore.ts
│   ├── simulationStore.ts
│   ├── savedDesignsStore.ts
│   ├── interviewStore.ts
│   └── tradeoffStore.ts
└── types/
```


