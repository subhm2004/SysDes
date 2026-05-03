import type { Problem } from "@/types/problem";
import { useCustomProblemsStore } from "@/store/customProblemsStore";

export const PROBLEMS: Problem[] = [
  {
    id: "url-shortener",
    title: "URL Shortener",
    difficulty: "Easy",
    description:
      "Design a URL shortening service like Bitly or TinyURL. Users submit long URLs and receive short, unique aliases that redirect to the original destination. The system is heavily read-biased — for every URL created, expect 100x more redirect lookups. Real-world services like Bitly handle billions of redirects per month with sub-100ms latency, making caching strategy the key design decision.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 1000,
      storageGB: 500,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Short URLs should be unique and non-predictable (base62 or base58 encoding)",
      "Redirect latency < 100ms at p99 — users should not notice any delay",
      "System should handle 100:1 read/write ratio",
      "URLs should expire after a configurable TTL (default 5 years)",
      "Analytics tracking for click counts, geographic distribution, and referrer data",
      "Custom alias support — users can choose their own short URL slug",
      "Rate limiting to prevent abuse (e.g., max 100 URLs/min per API key)",
    ],
    hints: [
      {
        title: "Start with the basics",
        content:
          "Consider DNS → Load Balancer → App Server → Database as your starting flow.",
      },
      {
        title: "Think about reads",
        content:
          "Most requests are reads (redirects). A cache layer can dramatically reduce DB load.",
      },
      {
        title: "Scaling writes",
        content:
          "Use a NoSQL database or partition your SQL database by key hash for write scaling.",
      },
      {
        title: "Advanced: Key generation",
        content:
          "Pre-generate keys in a separate Key Generation Service (KGS) to avoid collision checks at write time. Store unused keys in a dedicated table and move them to a 'used' table atomically.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 100, y: 250 },
        { componentId: "cdn", x: 300, y: 100 },
        { componentId: "load-balancer", x: 300, y: 250 },
        { componentId: "rate-limiter", x: 300, y: 400 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "dns", target: "cdn" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "rate-limiter", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Storage", "Caching", "Hashing"],
  },
  {
    id: "twitter-feed",
    title: "Twitter / News Feed",
    difficulty: "Hard",
    description:
      "Design a social media feed like Twitter (X). Users can post tweets, follow others, and see a personalized timeline ranked by relevance. The core challenge is fan-out: when a celebrity with 50M followers posts a tweet, how do you deliver it to all their followers' timelines without melting your infrastructure? Real systems like Twitter use a hybrid approach — pre-computing timelines for most users while handling high-follower accounts differently.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 1000,
      storageGB: 500000,
      latencyMs: 200,
      users: "250M DAU",
    },
    constraints: [
      "Timeline should be eventually consistent within 5 seconds of a new post",
      "Support users with millions of followers (celebrities) without write amplification storms",
      "Feed should rank by relevance using signals like recency, engagement, and relationship strength",
      "Media uploads (images/videos up to 512MB) must be supported with async processing",
      "Real-time notifications for mentions, likes, retweets, and DMs",
      "Full-text search across all public tweets with sub-second response time",
      "Graceful degradation — serve stale timelines rather than showing errors during peak load",
    ],
    hints: [
      {
        title: "Fan-out strategy",
        content:
          "Consider fan-out-on-write for normal users and fan-out-on-read for celebrities.",
      },
      {
        title: "Caching the timeline",
        content:
          "Pre-compute and cache each user's timeline in Redis. Update on new posts.",
      },
      {
        title: "Media handling",
        content:
          "Use object storage (S3) for media with a CDN for global delivery.",
      },
      {
        title: "Advanced: Hybrid fan-out",
        content:
          "Set a follower threshold (e.g., 10K). Below it, fan-out-on-write pushes to followers' cached timelines. Above it, fan-out-on-read merges celebrity tweets at read time. This gives you the best of both approaches.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 500, y: 200 },
        { componentId: "cache", x: 500, y: 50 },
        { componentId: "message-queue", x: 500, y: 380 },
        { componentId: "sql-db", x: 700, y: 200 },
        { componentId: "nosql-db", x: 700, y: 380 },
        { componentId: "object-storage", x: 350, y: 80 },
        { componentId: "search", x: 700, y: 50 },
        { componentId: "monitoring", x: 850, y: 200 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Fan-out", "Cache", "Timeline"],
  },
  {
    id: "chat-system",
    title: "Chat System",
    difficulty: "Hard",
    description:
      "Design a real-time chat application like WhatsApp, Slack, or Discord. Support 1:1 messaging, group chats with up to 1000 members, read receipts, typing indicators, and online presence. Messages must be delivered reliably and in order, even when users switch between devices. WhatsApp processes over 100 billion messages per day — the key challenges are maintaining persistent connections at scale and guaranteeing exactly-once delivery.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 100000,
      storageGB: 50000,
      latencyMs: 50,
      users: "500M DAU",
    },
    constraints: [
      "Messages delivered in under 50ms for online users via persistent WebSocket connections",
      "Guaranteed message ordering within a conversation using sequence numbers",
      "Offline message delivery when user comes back online (store-and-forward pattern)",
      "Support group chats with up to 1000 members with efficient fan-out",
      "End-to-end encryption for 1:1 chats (server should never see plaintext)",
      "Read receipts and typing indicators with minimal overhead (no DB writes for ephemeral events)",
      "Multi-device sync — messages appear on all logged-in devices simultaneously",
    ],
    hints: [
      {
        title: "WebSocket connections",
        content:
          "Use persistent WebSocket connections for real-time delivery. Need a connection gateway.",
      },
      {
        title: "Message ordering",
        content:
          "Use a message queue with per-conversation partitioning to guarantee ordering.",
      },
      {
        title: "Presence system",
        content:
          "Use Redis with TTL keys for online/offline status. Heartbeat every 30 seconds.",
      },
      {
        title: "Advanced: Connection management",
        content:
          "Use a dedicated WebSocket gateway layer that maintains millions of persistent connections. Store connection-to-server mappings in Redis so any app server can route a message to the correct gateway holding the recipient's connection.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "websocket-server", x: 200, y: 100 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "app-server", x: 500, y: 180 },
        { componentId: "cache", x: 500, y: 50 },
        { componentId: "message-queue", x: 500, y: 350 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 50 },
        { componentId: "rate-limiter", x: 50, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["WebSocket", "Messaging", "Real-time"],
  },
  {
    id: "ride-sharing",
    title: "Uber / Ride Sharing",
    difficulty: "Hard",
    description:
      "Design a ride-sharing platform like Uber or Lyft. Match riders with nearby drivers in real-time, track live location updates, calculate accurate ETAs, and handle dynamic surge pricing. The system must ingest millions of location updates per second from active drivers while simultaneously running proximity queries to match riders. Uber processes over 1 million location updates per second during peak hours, making geospatial indexing and real-time stream processing the central design challenges.",
    requirements: {
      readsPerSec: 80000,
      writesPerSec: 300000,
      storageGB: 1000,
      latencyMs: 100,
      users: "50M DAU",
    },
    constraints: [
      "Driver matching within 5 seconds using geospatial proximity search",
      "Location updates every 4 seconds from all active drivers (~1M concurrent drivers)",
      "ETA accuracy within 20% of actual using real-time traffic and historical data",
      "Surge pricing computed in real-time per geo zone based on supply/demand ratios",
      "Trip history and receipts stored permanently for regulatory compliance",
      "Payment processing with idempotent charge guarantees (no double-charging)",
      "Graceful handling of driver/rider disconnections mid-trip without data loss",
    ],
    hints: [
      {
        title: "Geo-spatial indexing",
        content:
          "Use geohashing or a spatial index to efficiently find nearby drivers.",
      },
      {
        title: "Location ingestion",
        content:
          "High-frequency location updates need a message queue to buffer writes.",
      },
      {
        title: "Matching service",
        content:
          "A dedicated matching service queries the spatial index and assigns the optimal driver.",
      },
      {
        title: "Advanced: Geohash sharding",
        content:
          "Partition your driver location data by geohash prefix so each shard handles a geographic region. This lets proximity queries hit a single shard instead of scanning globally. Use Redis Geo commands (GEOADD/GEOSEARCH) for O(log N) nearest-neighbor lookups.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 120 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 400 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 120 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "stream-processor", x: 650, y: 400 },
        { componentId: "nosql-db", x: 700, y: 250 },
        { componentId: "sql-db", x: 700, y: 120 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "nosql-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Real-time", "Matching"],
  },
  {
    id: "video-streaming",
    title: "YouTube / Video Streaming",
    difficulty: "Hard",
    description:
      "Design a video streaming platform like YouTube or Netflix. Support video upload, transcoding into multiple formats and resolutions, globally distributed storage, and adaptive bitrate streaming to millions of concurrent viewers. YouTube serves over 1 billion hours of video daily — the key challenges are building an efficient upload-transcode-serve pipeline, leveraging CDN edge caching for popular content, and separating the fast metadata path from the slow video delivery path.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 5000,
      storageGB: 1000000,
      latencyMs: 200,
      users: "2.7B MAU",
    },
    constraints: [
      "Videos transcoded into multiple resolutions (360p, 720p, 1080p, 4K) and codecs (H.264, VP9, AV1)",
      "Adaptive bitrate streaming (HLS/DASH) adjusts quality based on real-time bandwidth",
      "Global delivery with < 200ms video start time for 95th percentile of users",
      "Support live streaming with < 5s glass-to-glass latency",
      "Recommendations engine producing personalized feeds from billions of videos",
      "Upload processing pipeline handles videos up to 256GB with resumable uploads",
      "Copyright detection (Content ID) must scan uploaded content before it goes live",
    ],
    hints: [
      {
        title: "Upload pipeline",
        content:
          "Upload to object storage, then use a message queue to trigger async transcoding workers.",
      },
      {
        title: "CDN is critical",
        content:
          "A CDN is essential for serving video content globally. Cache popular videos at the edge.",
      },
      {
        title: "Metadata vs video",
        content:
          "Separate video metadata (SQL/NoSQL) from video content (object storage + CDN).",
      },
      {
        title: "Advanced: Tiered storage",
        content:
          "Use hot/warm/cold storage tiers. Popular videos stay on CDN edge and fast object storage. Videos older than 30 days with low views move to cheaper infrequent-access storage (S3 IA / Glacier). This can cut storage costs by 60-70% without affecting user experience.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 100 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "rate-limiter", x: 350, y: 100 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "stream-processor", x: 600, y: 400 },
        { componentId: "object-storage", x: 700, y: 100 },
        { componentId: "sql-db", x: 700, y: 250 },
        { componentId: "search", x: 700, y: 400 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "object-storage" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Streaming", "CDN", "Transcoding"],
  },
  {
    id: "rate-limiter",
    title: "Rate Limiter",
    difficulty: "Easy",
    description:
      "Design a distributed rate limiting service that throttles API requests per client, IP, or API key. Real systems like Cloudflare and AWS WAF use token bucket or sliding window algorithms backed by distributed counters in Redis. The key challenge is achieving consistency across multiple rate limiter instances without adding significant latency to the request path — Stripe processes hundreds of millions of API calls per day while enforcing per-key rate limits with sub-millisecond overhead.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 50000,
      storageGB: 10,
      latencyMs: 5,
      users: "50M DAU",
    },
    constraints: [
      "Sub-millisecond decision latency — rate limiting must not become a bottleneck itself",
      "Support multiple limiting algorithms: token bucket, sliding window log, sliding window counter",
      "Distributed counting across multiple instances using Redis with atomic operations (INCR + EXPIRE)",
      "Per-client, per-endpoint, and global rate limits with configurable thresholds",
      "Graceful handling of Redis failures — fail open vs fail closed configurable per rule",
      "Return standard HTTP 429 with Retry-After header and remaining quota in response headers",
      "Support burst allowance — allow short traffic spikes above the sustained rate limit",
    ],
    hints: [
      {
        title: "Start simple",
        content:
          "Begin with an API Gateway fronting app servers. Rate limit checks happen before business logic.",
      },
      {
        title: "Distributed counters",
        content:
          "Use Redis with INCR + EXPIRE for atomic counter updates across all instances. Lua scripts ensure atomicity.",
      },
      {
        title: "Sliding window",
        content:
          "A sliding window counter using two fixed windows with weighted counts gives accuracy without the memory cost of a full log.",
      },
      {
        title: "Advanced: Local + global",
        content:
          "Use a two-tier approach: local in-memory counters for hot-path speed with periodic sync to Redis for global consistency. This reduces Redis round-trips by 90% while keeping limits accurate within a small margin.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 250 },
        { componentId: "api-gateway", x: 500, y: 250 },
        { componentId: "app-server", x: 650, y: 250 },
        { componentId: "cache", x: 350, y: 100 },
        { componentId: "monitoring", x: 650, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "rate-limiter", target: "api-gateway" },
        { source: "rate-limiter", target: "cache" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Distributed", "Algorithm", "Redis"],
  },
  {
    id: "notification-system",
    title: "Notification System",
    difficulty: "Medium",
    description:
      "Design a scalable notification service like Firebase Cloud Messaging or AWS SNS that delivers push notifications, emails, and SMS to hundreds of millions of users. The system must handle priority-based routing, template rendering, delivery tracking, and retry logic across multiple channels. Firebase Cloud Messaging delivers over 1 trillion push notifications per year — the key challenges are fan-out at scale, rate limiting per channel, and maintaining delivery guarantees without overwhelming downstream providers.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 100000,
      storageGB: 2000,
      latencyMs: 500,
      users: "500M DAU",
    },
    constraints: [
      "Support push (iOS/Android/Web), email, and SMS delivery channels with pluggable providers",
      "Priority queue system — critical alerts (security, payments) jump ahead of marketing notifications",
      "Template engine with variable substitution and localization (100+ languages)",
      "At-least-once delivery with deduplication to prevent duplicate notifications to users",
      "Per-user notification preferences and opt-out management across all channels",
      "Delivery tracking with read receipts, bounce handling, and delivery status webhooks",
      "Rate limiting per provider to avoid being throttled by APNS, FCM, email gateways, or SMS providers",
    ],
    hints: [
      {
        title: "Event-driven architecture",
        content:
          "Use a message queue to decouple notification producers from the delivery pipeline. Events trigger notification creation.",
      },
      {
        title: "Priority queues",
        content:
          "Use separate message queues or priority lanes for critical vs marketing notifications to prevent backlog delays.",
      },
      {
        title: "Template and preferences",
        content:
          "Store templates and user preferences in a cache layer for fast lookup during high-volume sends.",
      },
      {
        title: "Advanced: Fan-out workers",
        content:
          "Use a worker pool pattern: a dispatcher reads from the priority queue, resolves user preferences, renders templates, then fans out to channel-specific workers (push worker, email worker, SMS worker). Each worker handles retries and provider-specific rate limits independently.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 500, y: 200 },
        { componentId: "message-queue", x: 500, y: 380 },
        { componentId: "cache", x: 500, y: 60 },
        { componentId: "nosql-db", x: 700, y: 200 },
        { componentId: "sql-db", x: 700, y: 380 },
        { componentId: "monitoring", x: 850, y: 200 },
        { componentId: "rate-limiter", x: 350, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
        { source: "api-gateway", target: "rate-limiter" },
      ],
    },
    tags: ["Push", "Queue", "Fanout"],
  },
  {
    id: "typeahead-autocomplete",
    title: "Typeahead / Autocomplete",
    difficulty: "Medium",
    description:
      "Design a search autocomplete system like Google's search suggestions or Algolia's instant search. As users type each character, the system returns the top 5-10 matching suggestions ranked by popularity, personalization, and recency within 100ms. Google processes over 8.5 billion searches per day with autocomplete triggering on every keystroke — the core challenges are building an efficient prefix-matching data structure (trie) and keeping suggestions fresh as search trends change in real-time.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 5000,
      storageGB: 100,
      latencyMs: 50,
      users: "17B queries/day",
    },
    constraints: [
      "Response time under 50ms at p99 — suggestions must appear as the user types each character",
      "Top-K results ranked by query frequency, recency, and optional personalization signals",
      "Support prefix matching and fuzzy matching (handle typos with edit distance ≤ 2)",
      "Real-time trend updates — breaking news or viral topics should appear within minutes",
      "Multi-language support with proper Unicode handling and transliteration",
      "Filter offensive or inappropriate suggestions before returning results",
      "Personalized suggestions based on user search history when available",
    ],
    hints: [
      {
        title: "Trie data structure",
        content:
          "Use a trie (prefix tree) to efficiently store and query prefix matches. Each node stores the top-K suggestions for that prefix.",
      },
      {
        title: "Caching is critical",
        content:
          "Cache the most popular prefixes (1-3 characters) aggressively — they account for the majority of queries.",
      },
      {
        title: "Offline aggregation",
        content:
          "Use a message queue to collect search logs, then batch-process to update suggestion rankings periodically.",
      },
      {
        title: "Advanced: Two-tier approach",
        content:
          "Serve from an in-memory trie on the app servers for ultra-low latency, backed by a distributed cache (Redis) for longer prefixes. Use a background pipeline that aggregates search logs, computes new rankings, and rebuilds the trie every 15 minutes.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 100 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "app-server", x: 400, y: 250 },
        { componentId: "cache", x: 400, y: 100 },
        { componentId: "message-queue", x: 400, y: 400 },
        { componentId: "nosql-db", x: 600, y: 250 },
        { componentId: "search", x: 600, y: 100 },
        { componentId: "monitoring", x: 800, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Trie", "Search", "Caching"],
  },
  {
    id: "web-crawler",
    title: "Web Crawler",
    difficulty: "Medium",
    description:
      "Design a distributed web crawler like Googlebot that can crawl billions of web pages efficiently. The crawler must manage a URL frontier, respect robots.txt politeness policies, deduplicate content, and handle the enormous variety of web page structures. Google's crawler discovers and indexes trillions of URLs and maintains an index of over 400 billion pages — the key design decisions involve URL prioritization, politeness (not overwhelming any single domain), and distributed coordination to avoid redundant crawls.",
    requirements: {
      readsPerSec: 10000,
      writesPerSec: 50000,
      storageGB: 50000,
      latencyMs: 1000,
      users: "N/A (internal system)",
    },
    constraints: [
      "Crawl rate of 1000+ pages per second across the entire cluster",
      "Respect robots.txt and per-domain crawl delays — never overwhelm a single website",
      "URL deduplication using content hashing (SimHash/MinHash) to detect near-duplicate pages",
      "URL frontier with priority queue — prioritize important/fresh pages over deep/stale ones",
      "Handle DNS resolution caching to avoid repeated lookups for the same domain",
      "Graceful handling of spider traps (infinite URL generation, redirect loops, soft 404s)",
      "Incremental re-crawling based on page change frequency (adaptive crawl scheduling)",
    ],
    hints: [
      {
        title: "URL frontier design",
        content:
          "Use a message queue as your URL frontier with priority levels. Separate front queues (priority) from back queues (politeness/per-host).",
      },
      {
        title: "Deduplication",
        content:
          "Use a Bloom filter or content hash stored in a NoSQL database to quickly check if a URL or page content has been seen before.",
      },
      {
        title: "Distributed workers",
        content:
          "Multiple crawler workers pull URLs from the frontier, fetch pages, extract links, and push new URLs back. Partition by domain for politeness.",
      },
      {
        title: "Advanced: DNS cache + politeness",
        content:
          "Maintain a local DNS cache (TTL-based) on each crawler worker to reduce DNS overhead. Implement per-domain rate limiters in Redis — each worker checks the domain's last crawl timestamp before fetching. This prevents any single domain from being overwhelmed even with hundreds of workers.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "message-queue", x: 100, y: 250 },
        { componentId: "app-server", x: 300, y: 250 },
        { componentId: "cache", x: 300, y: 100 },
        { componentId: "rate-limiter", x: 300, y: 400 },
        { componentId: "nosql-db", x: 550, y: 250 },
        { componentId: "object-storage", x: 550, y: 100 },
        { componentId: "search", x: 550, y: 400 },
        { componentId: "monitoring", x: 750, y: 250 },
      ],
      edges: [
        { source: "message-queue", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "rate-limiter" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "message-queue" },
        { source: "nosql-db", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Distributed", "Queue", "Storage"],
  },
  {
    id: "distributed-cache",
    title: "Distributed Cache",
    difficulty: "Medium",
    description:
      "Design a distributed in-memory caching system like Redis or Memcached. The system must support key-value storage with sub-millisecond reads, consistent hashing for data distribution, multiple eviction policies, and replication for fault tolerance. Redis can serve hundreds of thousands to over 1 million requests per second per node on optimized hardware — the key challenges are maintaining cache coherence across nodes, handling hot keys that receive disproportionate traffic, and designing a partition strategy that minimizes data movement during scaling events.",
    requirements: {
      readsPerSec: 500000,
      writesPerSec: 100000,
      storageGB: 500,
      latencyMs: 2,
      users: "N/A (infrastructure)",
    },
    constraints: [
      "Sub-millisecond read latency at p99 with support for 1M+ ops/sec per node",
      "Consistent hashing with virtual nodes for even data distribution and minimal remapping on scale events",
      "Multiple eviction policies: LRU, LFU, TTL-based, and random eviction",
      "Primary-replica replication with configurable consistency (async for speed, sync for safety)",
      "Hot key detection and mitigation — replicate hot keys across multiple nodes",
      "Support for data structures beyond key-value: lists, sets, sorted sets, hash maps",
      "Cluster health monitoring with automatic failover when a primary node goes down",
    ],
    hints: [
      {
        title: "Consistent hashing",
        content:
          "Use consistent hashing with virtual nodes to map keys to cache servers. This minimizes key redistribution when adding/removing nodes.",
      },
      {
        title: "Replication",
        content:
          "Each primary node replicates to 1-2 replicas. On primary failure, promote a replica using leader election.",
      },
      {
        title: "Eviction policies",
        content:
          "Implement LRU using a doubly-linked list + hash map for O(1) eviction. Support configurable policies per cache namespace.",
      },
      {
        title: "Advanced: Hot key handling",
        content:
          "Detect hot keys by sampling access patterns. When a key exceeds a threshold (e.g., 1000 QPS), automatically replicate it to all nodes and route reads using client-side random selection. This distributes the load of celebrity-profile-style hot keys.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "app-server", x: 400, y: 250 },
        { componentId: "cache", x: 600, y: 150 },
        { componentId: "nosql-db", x: 600, y: 350 },
        { componentId: "monitoring", x: 800, y: 250 },
        { componentId: "service-mesh", x: 400, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "app-server" },
        { source: "app-server", target: "service-mesh" },
        { source: "service-mesh", target: "cache" },
        { source: "cache", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Hashing", "Replication", "Memory"],
  },
  {
    id: "payment-system",
    title: "Payment System",
    difficulty: "Hard",
    description:
      "Design a payment processing platform like Stripe or PayPal. The system handles payment authorization, capture, settlement, refunds, and ledger management with strict financial consistency guarantees. Stripe processes nearly $2 trillion annually — the core challenges are ensuring exactly-once payment execution through idempotency keys, maintaining a double-entry accounting ledger, and handling the complex state machine of payment lifecycles across multiple payment processors and methods.",
    requirements: {
      readsPerSec: 30000,
      writesPerSec: 10000,
      storageGB: 5000,
      latencyMs: 200,
      users: "10M merchants",
    },
    constraints: [
      "Exactly-once payment execution using idempotency keys — no double-charges under any failure scenario",
      "Double-entry accounting ledger — every transaction creates balanced debit and credit entries",
      "Support multiple payment methods: credit cards, bank transfers, digital wallets, crypto",
      "PCI DSS compliance — card numbers must be tokenized and never stored in plaintext",
      "Reconciliation system that matches internal records with bank settlement files daily",
      "Dispute/chargeback handling workflow with evidence submission and deadline tracking",
      "Multi-currency support with real-time exchange rates and proper rounding (banker's rounding)",
    ],
    hints: [
      {
        title: "Idempotency is everything",
        content:
          "Every payment API call must include an idempotency key. Store the key and result so retries return the same response without re-executing.",
      },
      {
        title: "Payment state machine",
        content:
          "Model payments as a state machine: created → authorized → captured → settled (or refunded). Store every state transition.",
      },
      {
        title: "Ledger design",
        content:
          "Use a SQL database with ACID transactions for the ledger. Every operation creates two rows: a debit and a credit that sum to zero.",
      },
      {
        title: "Advanced: Saga pattern",
        content:
          "Use the saga pattern for multi-step payments (authorize → fraud check → capture → settle). Each step has a compensating action (e.g., void authorization). A message queue coordinates steps, and failed steps trigger compensating transactions in reverse order.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "rate-limiter", x: 350, y: 420 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "distributed-lock", x: 500, y: 420 },
        { componentId: "message-queue", x: 650, y: 420 },
        { componentId: "sql-db", x: 700, y: 200 },
        { componentId: "nosql-db", x: 700, y: 100 },
        { componentId: "monitoring", x: 850, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["ACID", "Idempotent", "Ledger"],
  },
  {
    id: "ticket-booking",
    title: "Ticket Booking (Ticketmaster)",
    difficulty: "Hard",
    description:
      "Design a ticket booking platform like Ticketmaster or BookMyShow for concerts, sports events, and shows. The system must handle massive traffic spikes when popular events go on sale (Taylor Swift's Eras Tour saw 14 million users hit the site simultaneously), manage seat inventory with optimistic locking to prevent double-booking, and implement a virtual waiting room queue. The central challenges are handling extreme concurrency on hot inventory, seat hold/release lifecycle management, and preventing bots from buying tickets.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 50000,
      storageGB: 1000,
      latencyMs: 200,
      users: "100M DAU",
    },
    constraints: [
      "No double-booking — optimistic locking or distributed locks must prevent two users from booking the same seat",
      "Virtual waiting room queue that activates when traffic exceeds system capacity (fairness guarantee)",
      "Seat hold with TTL — selected seats are reserved for 10 minutes during checkout, then auto-released",
      "Bot detection and mitigation using CAPTCHA, device fingerprinting, and behavioral analysis",
      "Support interactive seat maps with real-time availability updates via WebSocket/SSE",
      "Payment timeout handling — if payment fails after seat selection, seats must be released back to inventory",
      "Surge pricing and dynamic pricing tiers based on demand signals and remaining inventory",
    ],
    hints: [
      {
        title: "Virtual queue",
        content:
          "When traffic spikes, put users in a Redis-backed FIFO queue. Release them in batches to the booking flow at a controlled rate.",
      },
      {
        title: "Inventory locking",
        content:
          "Use Redis distributed locks (SETNX with TTL) for seat holds. This prevents double-booking while allowing auto-release on timeout.",
      },
      {
        title: "Event-driven updates",
        content:
          "Use a message queue to broadcast seat availability changes to all connected clients in real-time.",
      },
      {
        title: "Advanced: Two-phase booking",
        content:
          "Phase 1: Optimistically reserve the seat in Redis (SETNX with 10-min TTL). Phase 2: On payment success, persist to SQL database and remove the Redis hold. On payment failure or timeout, the Redis key auto-expires and the seat becomes available. This gives you both speed and durability.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "rate-limiter", x: 350, y: 100 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "distributed-lock", x: 720, y: 100 },
        { componentId: "message-queue", x: 720, y: 420 },
        { componentId: "sql-db", x: 720, y: 250 },
        { componentId: "nosql-db", x: 880, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Concurrency", "Inventory", "Booking"],
  },
  {
    id: "collaborative-editor",
    title: "Google Docs / Collaborative Editor",
    difficulty: "Hard",
    description:
      "Design a real-time collaborative document editor like Google Docs or Notion where multiple users can simultaneously edit the same document with changes appearing instantly for all participants. Google Docs supports up to 100 concurrent editors on a single document — the core challenges are conflict resolution when two users edit the same paragraph simultaneously (using Operational Transformation or CRDTs), maintaining cursor positions and selections across participants, and ensuring document state eventually converges to the same result regardless of network delays.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 30000,
      storageGB: 5000,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Real-time collaboration with changes visible to all editors within 200ms",
      "Conflict resolution using OT (Operational Transformation) or CRDTs for concurrent edits",
      "Cursor presence — show each collaborator's cursor position and selection in real-time",
      "Full version history with point-in-time restore and diff between any two versions",
      "Offline editing support with automatic merge when reconnecting",
      "Rich text formatting, tables, images, and embedded content",
      "Document-level and block-level permissions (view, comment, edit) with sharing controls",
    ],
    hints: [
      {
        title: "WebSocket for real-time",
        content:
          "Use persistent WebSocket connections for bidirectional real-time updates between clients and the collaboration server.",
      },
      {
        title: "OT vs CRDT",
        content:
          "OT transforms operations against concurrent edits (used by Google Docs). Figma uses a custom server-authoritative approach inspired by CRDTs. OT is simpler; CRDTs are more robust offline.",
      },
      {
        title: "Version history",
        content:
          "Store document snapshots periodically and individual operations between snapshots. Reconstruct any version by applying ops to the nearest snapshot.",
      },
      {
        title: "Advanced: Collaboration server",
        content:
          "Run a dedicated collaboration server per document that receives all client operations, transforms them against concurrent ops (OT), applies them to the authoritative document state, and broadcasts the transformed ops to all other clients. Use Redis Pub/Sub to coordinate when a document's collaboration server moves between instances.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 720, y: 420 },
        { componentId: "sql-db", x: 720, y: 200 },
        { componentId: "nosql-db", x: 720, y: 80 },
        { componentId: "object-storage", x: 880, y: 200 },
        { componentId: "monitoring", x: 880, y: 370 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "cdn", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["CRDT", "WebSocket", "Collaboration"],
  },
  {
    id: "file-storage",
    title: "Dropbox / File Storage",
    difficulty: "Hard",
    description:
      "Design a cloud file storage and synchronization service like Dropbox or Google Drive. Users upload files that sync across all their devices, with support for file versioning, sharing, and conflict resolution. Dropbox syncs over 1.2 billion files daily — the key engineering challenges are efficient delta sync (only uploading changed blocks instead of entire files), deduplication across users to save storage, and handling conflicts when the same file is edited on multiple devices while offline.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 20000,
      storageGB: 1000000,
      latencyMs: 500,
      users: "700M registered users",
    },
    constraints: [
      "Block-level chunking (4MB blocks) with content-addressable storage for deduplication",
      "Delta sync — only upload changed blocks, not the entire file, reducing bandwidth by 80%+",
      "File versioning with configurable retention (default 30 days) and point-in-time restore",
      "Conflict resolution for simultaneous edits — create conflict copies with user resolution UI",
      "Real-time sync notifications to all devices when a file changes on any device",
      "Sharing with granular permissions (view, edit, comment) and shareable links with expiration",
      "Resumable uploads for large files — handle network interruptions without restarting",
    ],
    hints: [
      {
        title: "Block-level storage",
        content:
          "Split files into fixed-size blocks, hash each block, and store blocks in object storage. The metadata DB maps files to ordered lists of block hashes.",
      },
      {
        title: "Deduplication",
        content:
          "Use content-addressable storage — if a block hash already exists, don't store it again. This saves massive storage when users share similar files.",
      },
      {
        title: "Sync protocol",
        content:
          "When a file changes, compute the new block list, diff against the stored block list, and only upload new/changed blocks. Notify other devices via a message queue.",
      },
      {
        title: "Advanced: Delta sync with rolling hash",
        content:
          "Use rolling hash (Rabin fingerprint) to detect block boundaries in modified files. This enables variable-size chunking that minimizes the number of changed blocks even when content is inserted in the middle of a file. Combine with a message queue for real-time sync notifications to all connected devices.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "object-storage", x: 720, y: 100 },
        { componentId: "sql-db", x: 720, y: 250 },
        { componentId: "nosql-db", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Chunking", "Sync", "Dedup"],
  },
  {
    id: "parking-lot",
    title: "Parking Lot System",
    difficulty: "Easy",
    description:
      "Design a smart parking lot management system that tracks vehicle entry/exit, manages spot availability in real-time, handles reservations, and processes payments. Modern smart parking systems like ParkMobile and SpotHero serve hundreds of millions of annual transactions — the key challenges are maintaining accurate real-time availability across multiple lots, handling concurrent reservation requests for the same spot, and integrating with IoT sensors for automatic occupancy detection.",
    requirements: {
      readsPerSec: 5000,
      writesPerSec: 2000,
      storageGB: 100,
      latencyMs: 200,
      users: "10M DAU",
    },
    constraints: [
      "Real-time spot availability updated within 2 seconds of vehicle entry/exit via IoT sensors",
      "Reservation system with time slots — prevent double-booking of the same spot at the same time",
      "Dynamic pricing based on demand, time of day, event proximity, and lot occupancy percentage",
      "Support multiple vehicle types: compact, regular, handicapped, EV charging, motorcycle",
      "Automatic license plate recognition (LPR) for ticketless entry and exit",
      "Payment processing with support for hourly, daily, and monthly passes",
      "Multi-lot management dashboard with analytics (peak hours, revenue, utilization trends)",
    ],
    hints: [
      {
        title: "Data model",
        content:
          "Model parking lots with floors, zones, and individual spots. Each spot has a type, status, and optional reservation.",
      },
      {
        title: "Real-time availability",
        content:
          "Use Redis to cache current availability counts per lot/floor/type. Update on every entry/exit event for instant queries.",
      },
      {
        title: "Reservation locking",
        content:
          "Use optimistic locking in the database for reservations — check availability at commit time, not at selection time.",
      },
      {
        title: "Advanced: Event-driven updates",
        content:
          "IoT sensors publish entry/exit events to a message queue. A processor updates the cache (Redis) and database, and broadcasts availability changes to the mobile app via WebSocket for real-time map updates.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 500, y: 250 },
        { componentId: "cache", x: 500, y: 100 },
        { componentId: "message-queue", x: 500, y: 400 },
        { componentId: "sql-db", x: 700, y: 250 },
        { componentId: "monitoring", x: 700, y: 100 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "sql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["IoT", "Real-time", "Booking"],
  },
  {
    id: "instagram",
    title: "Instagram / Photo Sharing",
    difficulty: "Medium",
    description:
      "Design a photo and short-video sharing platform like Instagram. Users upload photos that are processed (resized, filtered, compressed), stored across a CDN, and displayed in a personalized feed. Instagram serves over 3 billion monthly active users and processes 100+ million photo uploads daily — the key challenges are building an efficient media processing pipeline, generating a ranked feed from thousands of candidate posts, and serving media globally with minimal latency using edge caching.",
    requirements: {
      readsPerSec: 150000,
      writesPerSec: 20000,
      storageGB: 500000,
      latencyMs: 200,
      users: "500M DAU",
    },
    constraints: [
      "Photo upload processing pipeline: resize to multiple resolutions, apply optional filters, strip EXIF data",
      "Stories (24h ephemeral content) and Reels (short video) alongside permanent posts",
      "Ranked feed using signals: relationship strength, post engagement, recency, content type preferences",
      "Image/video CDN with edge caching — serve media from the nearest POP to the user",
      "Social graph storage for followers/following with efficient fan-out for feed generation",
      "Real-time engagement (likes, comments, shares) with optimistic UI updates",
      "Content moderation pipeline — automated detection of policy-violating content before publication",
    ],
    hints: [
      {
        title: "Media pipeline",
        content:
          "Upload original to object storage, push a processing job to a message queue, workers generate thumbnails and resized versions, then update CDN.",
      },
      {
        title: "Feed generation",
        content:
          "Pre-compute feeds for most users (fan-out-on-write). For high-follower accounts, merge their posts at read time (fan-out-on-read).",
      },
      {
        title: "CDN strategy",
        content:
          "Serve all media through a CDN with aggressive caching. Use image-specific CDNs (like Cloudinary or Imgix) for on-the-fly resizing.",
      },
      {
        title: "Advanced: Two-tier storage",
        content:
          "Recent photos (< 30 days) stay on fast SSD-backed object storage with CDN caching. Older photos migrate to cheaper archival storage (S3 Infrequent Access). When an old photo is accessed, the CDN fetches from archival storage and caches it at the edge, hiding the higher latency from users.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 200 },
        { componentId: "cache", x: 530, y: 60 },
        { componentId: "message-queue", x: 530, y: 380 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "search", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["CDN", "Media", "Feed"],
  },
  {
    id: "music-streaming",
    title: "Spotify / Music Streaming",
    difficulty: "Medium",
    description:
      "Design a music streaming platform like Spotify that serves audio content to millions of concurrent listeners, manages a catalog of 100M+ tracks, generates personalized playlists, and supports offline downloads. Spotify streams billions of minutes of audio daily — the key challenges are optimizing audio delivery with adaptive bitrate streaming, building a recommendation engine from listening history, and managing music licensing and royalty tracking for artists.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 10000,
      storageGB: 500000,
      latencyMs: 200,
      users: "250M DAU",
    },
    constraints: [
      "Adaptive bitrate audio streaming (96kbps, 160kbps, 320kbps) based on network conditions",
      "Gapless playback with audio pre-buffering — next track starts loading before current track ends",
      "Personalized recommendations: Discover Weekly, Release Radar, daily mixes using collaborative filtering",
      "Offline mode with encrypted local storage — downloaded tracks work without internet",
      "Social features: collaborative playlists, friend activity, sharing to external platforms",
      "Real-time play count tracking and royalty calculation per stream for rights holders",
      "Search across 100M+ tracks by title, artist, album, lyrics with fuzzy matching",
    ],
    hints: [
      {
        title: "Audio delivery",
        content:
          "Store audio files in object storage at multiple bitrates. Use a CDN with edge caching for popular tracks — top 1% of tracks account for 80% of streams.",
      },
      {
        title: "Recommendation engine",
        content:
          "Combine collaborative filtering (users who liked X also liked Y) with content-based features (audio analysis, genre, mood). Process listening events through a message queue.",
      },
      {
        title: "Catalog and search",
        content:
          "Store the music catalog in a NoSQL database. Use Elasticsearch for full-text search across titles, artists, and lyrics.",
      },
      {
        title: "Advanced: Pre-fetch pipeline",
        content:
          "When a user is 30 seconds from the end of a track, predict the next track (based on queue, playlist, or auto-play) and start streaming it to the client. Cache frequently co-listened tracks on the same CDN edge node to reduce origin fetches.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "search", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Streaming", "CDN", "Recommendations"],
  },
  {
    id: "ecommerce",
    title: "Amazon / E-Commerce",
    difficulty: "Hard",
    description:
      "Design a large-scale e-commerce platform like Amazon. The system handles product catalog management with millions of SKUs, shopping cart persistence, inventory tracking across warehouses, order processing, and personalized recommendations. Amazon processes over 300 million active customer accounts and handles millions of orders per hour during peak events like Prime Day — the central challenges are maintaining inventory consistency across concurrent purchases, building a low-latency product search, and orchestrating the complex order fulfillment pipeline.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 50000,
      storageGB: 20000,
      latencyMs: 200,
      users: "300M active accounts",
    },
    constraints: [
      "Product catalog with 100M+ SKUs, each with variants (size, color), pricing tiers, and seller information",
      "Real-time inventory tracking across multiple warehouses — prevent overselling on concurrent purchases",
      "Shopping cart persistence — carts survive browser closure, device switching, and user sign-in/out",
      "Order processing pipeline: payment → inventory reservation → warehouse assignment → shipping → delivery tracking",
      "Product search with filters (category, price, rating, availability) and typo tolerance",
      "Personalized recommendations on homepage, product pages, and cart (frequently bought together)",
      "Flash sale / Prime Day handling — 100× normal traffic spikes with fair inventory allocation",
    ],
    hints: [
      {
        title: "Microservice split",
        content:
          "Separate services for catalog, cart, inventory, orders, payments, and search. Each scales independently based on its traffic pattern.",
      },
      {
        title: "Inventory management",
        content:
          "Use optimistic locking with version numbers for inventory updates. Reserve stock at checkout, deduct on payment confirmation, release on timeout.",
      },
      {
        title: "Cart design",
        content:
          "Store carts in a NoSQL database (DynamoDB) with the user ID as the key. Merge anonymous carts with user carts on sign-in.",
      },
      {
        title: "Advanced: Event sourcing for orders",
        content:
          "Model orders as a stream of events (created → paid → picked → packed → shipped → delivered). Each event is appended to a message queue. Consumers update projections (order status, inventory, analytics) independently. This gives you full auditability, replay capability, and decoupled services.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "rate-limiter", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "sql-db", x: 720, y: 200 },
        { componentId: "nosql-db", x: 720, y: 350 },
        { componentId: "search", x: 880, y: 200 },
        { componentId: "object-storage", x: 880, y: 350 },
        { componentId: "monitoring", x: 880, y: 80 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Catalog", "Cart", "Inventory"],
  },
  {
    id: "team-messaging",
    title: "Slack / Team Messaging",
    difficulty: "Hard",
    description:
      "Design a workspace-based team messaging platform like Slack or Microsoft Teams. The system supports organized channels, threaded conversations, direct messages, file sharing, search across message history, and integrations with third-party services. Slack handles tens of millions of daily active users across hundreds of thousands of workspaces — the key challenges are maintaining message ordering and delivery guarantees across channels, building a fast full-text search index over billions of messages, and managing the complex permission model of workspaces, channels, and threads.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 30000,
      storageGB: 10000,
      latencyMs: 100,
      users: "100M DAU",
    },
    constraints: [
      "Workspace isolation — data from one workspace must never leak to another (multi-tenant security)",
      "Channel types: public (discoverable), private (invite-only), DMs (1:1 and group)",
      "Threaded conversations with reply counts, last-reply timestamps, and thread-follow notifications",
      "Real-time message delivery via WebSocket with offline message queuing for disconnected clients",
      "Full-text search across all messages in a workspace with filters (channel, user, date range, has:file)",
      "File sharing with preview generation (images, PDFs, code snippets) and per-file access control",
      "Integration framework for bots and external services (webhooks, slash commands, OAuth apps)",
    ],
    hints: [
      {
        title: "Message storage",
        content:
          "Store messages in a NoSQL database partitioned by workspace + channel. Use channel-level sequence numbers for ordering.",
      },
      {
        title: "Real-time delivery",
        content:
          "Maintain WebSocket connections per user. Use Redis Pub/Sub to route messages — subscribe each connection to the user's active channels.",
      },
      {
        title: "Search architecture",
        content:
          "Index messages in Elasticsearch partitioned by workspace. Update the index asynchronously via a message queue to avoid slowing down message sends.",
      },
      {
        title: "Advanced: Connection gateway",
        content:
          "Deploy a dedicated WebSocket gateway layer that maintains persistent connections. App servers send messages to the gateway via an internal message bus. The gateway maps user IDs to connections. This separates the stateful connection layer from the stateless business logic, letting each scale independently.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "websocket-server", x: 530, y: 380 },
        { componentId: "app-server", x: 530, y: 200 },
        { componentId: "cache", x: 530, y: 60 },
        { componentId: "message-queue", x: 720, y: 380 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 60 },
        { componentId: "search", x: 880, y: 380 },
        { componentId: "monitoring", x: 880, y: 200 },
        { componentId: "rate-limiter", x: 200, y: 420 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "load-balancer", target: "rate-limiter" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "message-queue", target: "search" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["WebSocket", "Search", "Workspace"],
  },
  {
    id: "metrics-monitoring",
    title: "Metrics / Monitoring System",
    difficulty: "Hard",
    description:
      "Design a metrics collection and monitoring system like Datadog, Prometheus, or New Relic. The system ingests millions of time-series data points per second from thousands of servers, stores them efficiently with configurable retention, supports real-time dashboarding, and triggers alerts based on complex threshold and anomaly detection rules. Datadog ingests trillions of data points daily — the core challenges are designing a storage engine optimized for time-series write patterns, supporting flexible aggregation queries at sub-second speed, and building a reliable alerting pipeline with low false-positive rates.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 500000,
      storageGB: 50000,
      latencyMs: 100,
      users: "N/A (infrastructure)",
    },
    constraints: [
      "Ingest 500K+ metrics data points per second with sub-second write latency",
      "Time-series storage with automatic downsampling: raw (7 days), 1-min avg (30 days), 1-hour avg (1 year)",
      "Flexible query language for aggregation: avg, sum, percentiles, rate, group-by across arbitrary tag dimensions",
      "Real-time dashboard rendering with auto-refresh and support for custom visualization widgets",
      "Alerting engine with threshold, anomaly detection, and composite alert conditions",
      "Alert routing with escalation policies, on-call schedules, and multi-channel delivery (PagerDuty, Slack, email)",
      "Tag-based metric organization with high-cardinality tag support (up to 10K unique values per tag)",
    ],
    hints: [
      {
        title: "Write-optimized ingestion",
        content:
          "Use a message queue to buffer incoming metrics. Batch writes to the time-series database for higher throughput.",
      },
      {
        title: "Time-series storage",
        content:
          "Use a specialized time-series database (or NoSQL with time-based partitioning). Compress adjacent data points using delta-of-delta encoding.",
      },
      {
        title: "Alerting pipeline",
        content:
          "Separate the alerting evaluation from ingestion. A dedicated service continuously evaluates alert rules against recent data and fires notifications.",
      },
      {
        title: "Advanced: Downsampling pipeline",
        content:
          "Run a background job that reads raw metrics older than 7 days, computes 1-minute aggregates (avg, min, max, count), writes them to a separate table, and deletes the raw data. Repeat at 30 days for 1-hour aggregates. This reduces storage by 100x while keeping historical queries fast.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "load-balancer", x: 100, y: 250 },
        { componentId: "api-gateway", x: 250, y: 250 },
        { componentId: "app-server", x: 420, y: 200 },
        { componentId: "message-queue", x: 420, y: 380 },
        { componentId: "cache", x: 420, y: 60 },
        { componentId: "timeseries-db", x: 620, y: 200 },
        { componentId: "sql-db", x: 620, y: 380 },
        { componentId: "search", x: 620, y: 60 },
        { componentId: "monitoring", x: 820, y: 200 },
        { componentId: "auth-service", x: 250, y: 100 },
      ],
      edges: [
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "timeseries-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["TimeSeries", "Alerting", "Aggregation"],
  },
  {
    id: "netflix",
    title: "Netflix / Video Streaming Platform",
    difficulty: "Hard",
    description:
      "Design a video streaming platform like Netflix that serves personalized content to 325 million subscribers across 190+ countries. Netflix accounts for over 15% of global internet bandwidth during peak hours — the key challenges are building a content recommendation engine that drives 80% of watch time, implementing adaptive bitrate streaming (ABR) that adjusts quality frame-by-frame based on network conditions, and leveraging a global CDN (Open Connect) with ISP-embedded appliances to serve 17,000+ titles with sub-second start times.",
    requirements: {
      readsPerSec: 300000,
      writesPerSec: 5000,
      storageGB: 2000000,
      latencyMs: 100,
      users: "325M subscribers",
    },
    constraints: [
      "Adaptive bitrate streaming (ABR) using per-shot encoding — each scene encoded at optimal bitrate/resolution ladder",
      "Content recommendation engine processing billions of implicit signals (watch time, pauses, rewatches, abandons)",
      "Global CDN with ISP-embedded Open Connect Appliances (OCAs) caching popular content at the network edge",
      "DRM enforcement (Widevine, FairPlay, PlayReady) with license server handling 100K+ license requests/sec",
      "Multi-profile support per account with isolated recommendation models and viewing history",
      "Content ingestion pipeline: ingest mezzanine file → encode 1200+ variants (resolution × bitrate × codec) per title",
    ],
    hints: [
      {
        title: "Content delivery",
        content:
          "Use a CDN with ISP-embedded edge appliances for popular titles. Pre-position content during off-peak hours based on predicted regional demand.",
      },
      {
        title: "Recommendation engine",
        content:
          "Combine collaborative filtering with deep learning models trained on viewing patterns. Stream user events through a message queue for real-time signal processing.",
      },
      {
        title: "Encoding pipeline",
        content:
          "Use per-title and per-shot encoding optimization. Process through a message queue that triggers parallel transcoding workers to generate the full resolution/bitrate ladder.",
      },
      {
        title: "Advanced: Microservice architecture",
        content:
          "Netflix uses 1000+ microservices. Separate the control plane (API, auth, recommendations, search) from the data plane (video streaming via CDN). The API gateway (Zuul) handles routing, auth, and rate limiting. Use a cache (EVCache/Memcached) aggressively — Netflix caches billions of data points to achieve sub-100ms API responses.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "search", x: 720, y: 420 },
        { componentId: "stream-processor", x: 880, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "stream-processor" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Streaming", "CDN", "Recommendations", "DRM"],
  },
  {
    id: "tinder",
    title: "Tinder / Dating App",
    difficulty: "Medium",
    description:
      "Design a location-based dating application like Tinder that matches users based on geographic proximity, preferences, and compatibility signals. Tinder processes over 2 billion swipes per day with 75 million monthly active users — the key challenges are building an efficient geospatial index for proximity matching, a recommendation engine that surfaces relevant profiles while avoiding already-seen users, and handling the high write throughput of swipe events with real-time match notifications when two users swipe right on each other.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 50000,
      storageGB: 100000,
      latencyMs: 200,
      users: "75M MAU",
    },
    constraints: [
      "Geospatial proximity search using geohashing or R-tree index — find users within configurable radius (1-160 km)",
      "Recommendation engine that filters by preferences (age, gender, distance) and ranks by compatibility score",
      "Swipe deduplication — never show a user the same profile twice, even across sessions",
      "Real-time match detection — when both users swipe right, notify both instantly via push notification",
      "Photo storage and serving with face detection validation and content moderation pipeline",
      "ELO-like scoring system that adapts profile visibility based on desirability signals",
    ],
    hints: [
      {
        title: "Geospatial indexing",
        content:
          "Use geohashing to partition users by location. Store active user locations in Redis with GEOADD for O(log N) proximity queries within a radius.",
      },
      {
        title: "Recommendation pipeline",
        content:
          "Pre-compute a recommendation deck for each active user: filter by preferences, exclude already-swiped profiles, rank by compatibility score, and cache the top 100 candidates.",
      },
      {
        title: "Match detection",
        content:
          "On each right-swipe, check if the target user has already right-swiped the current user. Store swipes in a NoSQL database keyed by (swiper, swipee) for O(1) lookup.",
      },
      {
        title: "Advanced: Sharded recommendation",
        content:
          "Partition the user base by geohash prefix so each recommendation shard handles a geographic region. Within each shard, maintain a bloom filter of seen profiles per user to avoid re-showing. Pre-compute recommendation decks during off-peak hours using a stream processor that scores all eligible matches.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "stream-processor", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Matching", "Recommendations", "Real-time"],
  },
  {
    id: "google-maps",
    title: "Google Maps / Navigation",
    difficulty: "Hard",
    description:
      "Design a mapping and navigation platform like Google Maps that serves map tiles, computes optimal routes, provides real-time traffic updates, and estimates accurate ETAs. Google Maps serves over 1 billion daily active users and processes 1 billion kilometers of driving directions daily — the core challenges are serving pre-rendered map tiles at multiple zoom levels from a multi-petabyte tile corpus, computing shortest paths on a road graph with hundreds of millions of edges using hierarchical algorithms (Contraction Hierarchies / A*), and ingesting real-time GPS probe data from millions of devices to update traffic conditions every 30 seconds.",
    requirements: {
      readsPerSec: 500000,
      writesPerSec: 100000,
      storageGB: 5000000,
      latencyMs: 200,
      users: "1B DAU",
    },
    constraints: [
      "Map tile serving at 20+ zoom levels — vector tiles for mobile, raster tiles for web, pre-rendered and cached at CDN edge",
      "Route computation using Contraction Hierarchies or A* on a graph with 500M+ road segments in under 200ms",
      "Real-time traffic layer updated every 30 seconds from GPS probe data aggregated across millions of active drivers",
      "ETA prediction combining historical patterns, live traffic, road type, and time-of-day with < 20% error",
      "Multi-modal routing: driving, walking, cycling, public transit with real-time schedule integration",
      "Geocoding and reverse geocoding with fuzzy address matching across 200+ countries and scripts",
    ],
    hints: [
      {
        title: "Map tile serving",
        content:
          "Pre-render tiles at each zoom level and store in object storage. Serve via CDN for instant loading. Use vector tiles on mobile to reduce bandwidth — the client renders them locally.",
      },
      {
        title: "Route computation",
        content:
          "Use Contraction Hierarchies (CH) to preprocess the road graph. CH reduces a cross-country route query from millions of edge relaxations to a few thousand, enabling sub-200ms responses.",
      },
      {
        title: "Real-time traffic",
        content:
          "Ingest GPS probes from active users into a stream processor. Aggregate speed per road segment over 30-second windows. Store in a time-series database and overlay on the pre-computed road graph.",
      },
      {
        title: "Advanced: Partitioned graph serving",
        content:
          "Partition the road graph geographically. Each partition server handles local routing. For cross-partition routes, use a two-level approach: a global overlay graph of inter-partition highways handles the macro route, then local servers compute the first-mile and last-mile segments. Cache popular origin-destination pairs for instant responses.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "stream-processor", x: 530, y: 420 },
        { componentId: "timeseries-db", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "stream-processor" },
        { source: "stream-processor", target: "timeseries-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Graph", "Real-time", "CDN"],
  },
  {
    id: "zoom",
    title: "Zoom / Video Conferencing",
    difficulty: "Hard",
    description:
      "Design a real-time video conferencing platform like Zoom that supports meetings with up to 1000 participants, screen sharing, recording, and breakout rooms. Zoom handles over 300 million daily meeting participants with end-to-end latency under 150ms — the core challenges are building a Selective Forwarding Unit (SFU) architecture that routes video streams without transcoding to minimize latency, managing bandwidth allocation when dozens of participants have cameras enabled simultaneously, and providing reliable recording with server-side mixing for cloud playback.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 50000,
      storageGB: 500000,
      latencyMs: 50,
      users: "300M daily meeting participants",
    },
    constraints: [
      "End-to-end glass-to-glass latency under 150ms for real-time audio/video using WebRTC or custom UDP protocol",
      "SFU (Selective Forwarding Unit) architecture — server forwards streams without transcoding to minimize latency",
      "Simulcast: each sender encodes 3 quality layers (low/medium/high), SFU selects per-receiver based on bandwidth and layout",
      "Screen sharing at 1080p/30fps alongside camera feeds with independent bandwidth allocation",
      "Cloud recording with server-side mixing — composite multiple video streams into a single recording file",
      "Breakout rooms, waiting rooms, and host controls with real-time state synchronization across all participants",
    ],
    hints: [
      {
        title: "SFU over MCU",
        content:
          "Use a Selective Forwarding Unit (SFU) instead of a Multipoint Control Unit (MCU). SFU forwards packets without decoding/re-encoding, reducing latency and server CPU cost by 10x compared to MCU.",
      },
      {
        title: "Simulcast for bandwidth",
        content:
          "Each sender publishes 3 quality layers (e.g., 180p, 360p, 720p). The SFU dynamically selects the appropriate layer for each receiver based on their available bandwidth and visible tile size.",
      },
      {
        title: "Distributed media routing",
        content:
          "Deploy SFU servers in multiple regions. For cross-region meetings, cascade SFU servers over dedicated backbone links rather than sending each participant's stream across regions independently.",
      },
      {
        title: "Advanced: Geo-distributed SFU mesh",
        content:
          "For global meetings, deploy SFU nodes in each participant's nearest region. Connect SFU nodes via a server-to-server mesh over the provider's backbone network. Each SFU forwards only the active speaker and pinned streams across regions (not all participants), reducing cross-region bandwidth by 80%. Use SRTP for encryption and RTCP feedback for congestion control.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "websocket-server", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "load-balancer", target: "websocket-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["WebRTC", "Real-time", "Media", "SFU"],
  },
  {
    id: "food-delivery",
    title: "Doordash / Food Delivery",
    difficulty: "Hard",
    description:
      "Design a food delivery platform like DoorDash or Uber Eats that connects customers, restaurants, and delivery drivers in real-time. DoorDash processes over 750 million orders per quarter across 500,000+ merchant partners — the core challenges are building a real-time dispatch system that optimally matches orders to drivers (considering location, capacity, and estimated completion times), maintaining accurate ETAs that update as conditions change, and handling the three-sided marketplace where restaurant prep times, driver routes, and customer expectations must all be balanced simultaneously.",
    requirements: {
      readsPerSec: 80000,
      writesPerSec: 40000,
      storageGB: 50000,
      latencyMs: 200,
      users: "46M MAU",
    },
    constraints: [
      "Real-time order tracking with GPS updates every 5 seconds from active delivery drivers",
      "Driver dispatch algorithm optimizing for delivery time, driver earnings, and order batching (multi-pickup routes)",
      "Restaurant inventory and prep-time estimation — dynamically adjust menu availability based on kitchen capacity",
      "ETA prediction combining restaurant prep time, driver travel time, and real-time traffic conditions",
      "Payment splitting: customer charge, restaurant payout (minus commission), driver payout (base + tips + peak pay)",
      "Surge pricing and delivery fee calculation based on real-time demand/supply ratio per zone",
    ],
    hints: [
      {
        title: "Three-sided marketplace",
        content:
          "Model the system as three user types: customers (ordering), restaurants (preparing), and drivers (delivering). Each has separate real-time state that must be coordinated.",
      },
      {
        title: "Dispatch optimization",
        content:
          "Use a centralized dispatch service that runs a matching algorithm every few seconds, considering driver proximity to restaurant, current orders in progress, and restaurant prep time estimates.",
      },
      {
        title: "Real-time tracking",
        content:
          "Ingest driver GPS updates into a stream processor. Update ETAs in real-time and push to customers via WebSocket or server-sent events.",
      },
      {
        title: "Advanced: Order batching",
        content:
          "DoorDash groups multiple orders from nearby restaurants heading to nearby destinations into a single driver route. The dispatch algorithm runs a traveling-salesman heuristic (nearest-neighbor with 2-opt improvement) to minimize total delivery time while keeping each individual order within its promised ETA window.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "nosql-db", x: 720, y: 300 },
        { componentId: "sql-db", x: 720, y: 150 },
        { componentId: "stream-processor", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "nosql-db" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Real-time", "Dispatch", "Marketplace"],
  },
  {
    id: "reddit",
    title: "Reddit / Social News",
    difficulty: "Medium",
    description:
      "Design a social news aggregation and discussion platform like Reddit. Users submit posts to topic-based communities (subreddits), vote content up or down, and engage in deeply nested comment threads. Reddit serves 97+ million daily active users across 100,000+ active communities — the key challenges are implementing a ranking algorithm (hot, top, controversial, best) that surfaces quality content across communities of vastly different sizes, efficiently storing and rendering deeply nested comment trees with thousands of replies, and building a moderation system that scales across volunteer moderators.",
    requirements: {
      readsPerSec: 200000,
      writesPerSec: 20000,
      storageGB: 200000,
      latencyMs: 200,
      users: "97M DAU",
    },
    constraints: [
      "Multiple ranking algorithms: hot (time-decayed score), top (by time window), controversial (balanced up/down), best (Wilson score)",
      "Nested comment trees with efficient rendering — load top-level comments first, lazy-load deep threads",
      "Subreddit isolation — each community has its own rules, moderators, CSS themes, and content policies",
      "Vote counting with anti-manipulation: rate limiting, vote fuzzing, and bot detection",
      "Cross-posting and content aggregation across subreddits with deduplication on /r/all",
      "Full-text search across posts and comments with subreddit and time-range filters",
    ],
    hints: [
      {
        title: "Ranking algorithm",
        content:
          "Reddit's hot ranking uses: score = log10(max(|ups - downs|, 1)) + sign(ups - downs) * (post_time - epoch) / 45000. Pre-compute rankings and cache the sorted feeds for each subreddit.",
      },
      {
        title: "Comment tree storage",
        content:
          "Store comments in a NoSQL database with parent_id for tree structure. Use materialized path (e.g., 'root/parent/child') for efficient subtree queries. Cache top-level comments aggressively.",
      },
      {
        title: "Vote processing",
        content:
          "Process votes through a message queue to decouple the fast vote acknowledgment from the slower ranking recalculation. Use Redis to cache current vote counts per post.",
      },
      {
        title: "Advanced: Hybrid feed computation",
        content:
          "For small subreddits (< 10K subscribers), compute rankings on the fly from cached vote counts. For large subreddits (> 100K), pre-compute ranked feeds every 30 seconds using a background job. For /r/all, use a stream processor that merges top posts from all subreddits with normalized scoring to prevent large communities from dominating.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "sql-db", x: 720, y: 350 },
        { componentId: "search", x: 880, y: 200 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "monitoring", x: 880, y: 350 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Ranking", "Comments", "Voting", "Community"],
  },
  {
    id: "airbnb",
    title: "Airbnb / Booking Platform",
    difficulty: "Hard",
    description:
      "Design a property rental and booking platform like Airbnb that connects hosts with guests for short-term stays. Airbnb has 7+ million active listings across 220 countries with billions of monthly searches — the core challenges are building a search system that handles complex multi-dimensional queries (location, dates, price, amenities, guest count), implementing a booking and reservation system that prevents double-booking across overlapping date ranges, and building a dynamic pricing algorithm that helps hosts optimize revenue based on seasonality, local events, and comparable listings.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 10000,
      storageGB: 100000,
      latencyMs: 200,
      users: "50M DAU",
    },
    constraints: [
      "Search with compound filters: location (geo-radius), date range availability, price range, guest count, amenities, property type",
      "Calendar-based availability management — hosts block dates, bookings reserve date ranges, no double-booking allowed",
      "Reservation system with hold-and-confirm pattern: temporarily hold dates during checkout flow (15-min TTL)",
      "Dynamic pricing suggestions using comparable listings, seasonality patterns, local event calendars, and demand forecasts",
      "Review system with bilateral reviews (host reviews guest, guest reviews host) revealed simultaneously after both submit",
      "Multi-currency pricing with real-time exchange rates, host payout in local currency, guest charges in their currency",
    ],
    hints: [
      {
        title: "Search architecture",
        content:
          "Use Elasticsearch with geo_point for location search, date range queries for availability, and filters for amenities/price. Pre-compute availability calendars as bitmaps for fast date-range intersection.",
      },
      {
        title: "Availability management",
        content:
          "Store each listing's availability as a calendar in a SQL database. Use row-level locking or optimistic concurrency to prevent double-booking when two guests try to book overlapping dates.",
      },
      {
        title: "Booking flow",
        content:
          "Phase 1: Hold the dates in a distributed lock (Redis SETNX with 15-min TTL). Phase 2: Process payment. Phase 3: Confirm booking in SQL and release the lock. On timeout, dates auto-release.",
      },
      {
        title: "Advanced: Search relevance",
        content:
          "Airbnb's search ranking combines 100+ features: price competitiveness, host response rate, listing quality score, guest-listing compatibility, and conversion probability. Use a two-stage ranking pipeline: a fast candidate retrieval phase (Elasticsearch with geo + date filters) followed by a machine-learned re-ranking model (gradient boosted trees) that scores the top 1000 candidates.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "sql-db", x: 720, y: 150 },
        { componentId: "nosql-db", x: 720, y: 300 },
        { componentId: "search", x: 880, y: 150 },
        { componentId: "object-storage", x: 880, y: 300 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "monitoring", x: 880, y: 420 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Search", "Booking", "Geo-spatial", "Marketplace"],
  },
  {
    id: "whatsapp",
    title: "WhatsApp / Messaging",
    difficulty: "Hard",
    description:
      "Design an end-to-end encrypted messaging platform like WhatsApp that handles 100+ billion messages per day across 3 billion monthly active users. The server never sees plaintext message content — the core challenges are implementing the Signal Protocol for end-to-end encryption with perfect forward secrecy, reliably delivering messages to offline users (store-and-forward), efficiently fanning out messages in group chats (up to 1024 members), and synchronizing message state across multiple linked devices while maintaining encryption guarantees.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 1000000,
      storageGB: 500000,
      latencyMs: 50,
      users: "3B MAU",
    },
    constraints: [
      "End-to-end encryption using Signal Protocol — server stores only ciphertext, key exchange via X3DH (Extended Triple Diffie-Hellman)",
      "Offline message delivery with store-and-forward — messages queued on server until recipient reconnects, then delivered in order",
      "Group messaging up to 1024 members with Sender Keys protocol for efficient group encryption",
      "Media sharing with encrypted upload — media encrypted client-side, uploaded to object storage, decryption key sent in message",
      "Multi-device support (WhatsApp Web/Desktop) with message sync using companion device protocol",
      "Read receipts, typing indicators, and online presence as ephemeral signals (no persistent storage)",
    ],
    hints: [
      {
        title: "Connection management",
        content:
          "Maintain persistent WebSocket connections from each client to a connection gateway. Store the mapping of user ID → gateway server in Redis for message routing.",
      },
      {
        title: "Message delivery",
        content:
          "On send: encrypt client-side, send to server, server queues in recipient's inbox (NoSQL). When recipient is online, push immediately via their WebSocket connection. When offline, store and deliver on reconnect.",
      },
      {
        title: "Group messaging",
        content:
          "Use Sender Keys: the sender encrypts the message once with a shared group key, server fans out the ciphertext to all group members. This avoids N separate encryptions per message.",
      },
      {
        title: "Advanced: Multi-device sync",
        content:
          "WhatsApp's multi-device architecture treats each device as a separate Signal Protocol client. When sending to a user with 4 linked devices, the sender encrypts the message 4 times (once per device's public key). Each device maintains its own ratchet state. The server stores per-device message queues and delivers independently. This eliminates the need for a primary device to be online.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "websocket-server", x: 200, y: 100 },
        { componentId: "app-server", x: 400, y: 250 },
        { componentId: "cache", x: 400, y: 100 },
        { componentId: "message-queue", x: 400, y: 400 },
        { componentId: "nosql-db", x: 600, y: 250 },
        { componentId: "object-storage", x: 600, y: 100 },
        { componentId: "monitoring", x: 800, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "websocket-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Encryption", "WebSocket", "Messaging", "Real-time"],
  },
  {
    id: "search-engine",
    title: "Google Search / Search Engine",
    difficulty: "Hard",
    description:
      "Design a web search engine like Google that crawls billions of web pages, builds an inverted index, ranks results by relevance, and returns the top results in under 200ms. Google processes over 8.5 billion searches per day across an index of hundreds of billions of pages (hundreds of petabytes) — the core challenges are building and maintaining a distributed inverted index that maps every word to the documents containing it, implementing a ranking algorithm (PageRank + hundreds of signals) that surfaces the most relevant results, and serving queries with sub-200ms latency by scattering the query across thousands of index shards in parallel.",
    requirements: {
      readsPerSec: 500000,
      writesPerSec: 50000,
      storageGB: 10000000,
      latencyMs: 200,
      users: "8.5B queries/day",
    },
    constraints: [
      "Distributed inverted index sharded across thousands of machines — each shard holds a portion of the web",
      "PageRank computation over a web graph of 100B+ nodes using iterative MapReduce (converges in 40-50 iterations)",
      "Query parsing with spell correction, synonym expansion, entity recognition, and intent classification",
      "Sub-200ms query latency by scatter-gather across index shards with aggressive timeouts (drop slow shards)",
      "Freshness: crawl and re-index high-priority pages (news sites) within minutes of changes",
      "Snippet generation — extract the most relevant text fragment from each result page to display in results",
    ],
    hints: [
      {
        title: "Inverted index",
        content:
          "Build an inverted index mapping each term to a sorted list of (docID, frequency, positions). Shard by document (each shard holds the full index for a subset of pages). At query time, scatter the query to all shards and merge results.",
      },
      {
        title: "Ranking signals",
        content:
          "Combine hundreds of signals: PageRank (link authority), BM25 (term relevance), freshness, page speed, mobile-friendliness, and user engagement metrics. Use a machine-learned model to weight signals.",
      },
      {
        title: "Crawl and index pipeline",
        content:
          "Web crawler discovers pages → message queue → parser extracts text and links → indexer updates inverted index → PageRank recomputes periodically on the link graph.",
      },
      {
        title: "Advanced: Two-phase ranking",
        content:
          "Phase 1 (retrieval): Use the inverted index to find candidate documents matching the query terms using BM25 scoring — returns top 1000 candidates per shard. Phase 2 (ranking): A machine-learned model re-ranks candidates using 200+ features (PageRank, click-through rate, query-document embedding similarity). This two-phase approach lets you apply expensive ranking only to promising candidates.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 150 },
        { componentId: "search", x: 720, y: 300 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "object-storage", x: 880, y: 150 },
        { componentId: "stream-processor", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 300 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "stream-processor" },
        { source: "stream-processor", target: "search" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Search", "Indexing", "PageRank", "Distributed"],
  },
  {
    id: "location-service",
    title: "Yelp / Location-Based Service",
    difficulty: "Medium",
    description:
      "Design a location-based business discovery and review platform like Yelp or Google Places. Users search for businesses by category and proximity, browse photos and reviews, and contribute their own ratings. Yelp indexes over 330 million reviews for 7+ million businesses — the core challenges are building an efficient geospatial index (QuadTree or Geohash) that supports proximity search with category filters, aggregating review scores in real-time as new reviews come in, and serving business detail pages with rich media from a global CDN.",
    requirements: {
      readsPerSec: 100000,
      writesPerSec: 5000,
      storageGB: 50000,
      latencyMs: 200,
      users: "33M monthly unique visitors",
    },
    constraints: [
      "Geospatial search using QuadTree or Geohash index — find businesses within radius sorted by relevance and distance",
      "Compound search: category + location + price range + rating + open-now with sub-200ms response",
      "Review aggregation with Bayesian average rating (accounts for review count, not just mean score)",
      "Photo storage with thumbnails, CDN serving, and user-uploaded content moderation",
      "Business profile pages with hours, menu (for restaurants), and real-time busy-times based on check-in data",
      "Autocomplete for business names and categories with typo tolerance and location-biased results",
    ],
    hints: [
      {
        title: "Geospatial indexing",
        content:
          "Use a QuadTree to partition geographic space. Each leaf node contains businesses within that area. Proximity queries traverse the tree to find nearby leaves, then filter by radius. Alternatively, use Geohash with prefix matching.",
      },
      {
        title: "Search with filters",
        content:
          "Use Elasticsearch with geo_distance queries for proximity search. Add filters for category, price range, and open hours. Pre-compute popular searches per geohash cell for instant results.",
      },
      {
        title: "Review aggregation",
        content:
          "Cache aggregate ratings in Redis. On new review, update the running average atomically. Use Bayesian average to prevent businesses with few 5-star reviews from outranking those with hundreds of 4.5-star reviews.",
      },
      {
        title: "Advanced: QuadTree sharding",
        content:
          "Build a distributed QuadTree where each server owns a geographic partition. Dense areas (Manhattan) get finer-grained partitions than rural areas. A routing layer maps the user's search center to the relevant partition servers. For boundary queries (search radius spans multiple partitions), query adjacent partitions in parallel and merge results.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "search", x: 720, y: 350 },
        { componentId: "object-storage", x: 880, y: 200 },
        { componentId: "monitoring", x: 880, y: 350 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Geo-spatial", "Search", "Reviews", "QuadTree"],
  },
  {
    id: "tiktok",
    title: "TikTok / Short Video",
    difficulty: "Hard",
    description:
      "Design a short-form video platform like TikTok that serves personalized video feeds to over 1.5 billion monthly active users. TikTok's recommendation engine is its core competitive advantage — it builds interest graphs from watch-time signals (not just social graphs) to surface relevant content even for new users within minutes. The platform processes billions of video views per day with a multi-petabyte content library — the key challenges are building the For You Page (FYP) recommendation algorithm, a high-throughput video transcoding pipeline that processes millions of uploads daily, and a content moderation system that reviews content before publication.",
    requirements: {
      readsPerSec: 500000,
      writesPerSec: 50000,
      storageGB: 5000000,
      latencyMs: 100,
      users: "1.5B MAU",
    },
    constraints: [
      "For You Page recommendation combining collaborative filtering, content embeddings, and real-time engagement signals",
      "Video transcoding pipeline: ingest → content moderation → transcode (multiple resolutions/bitrates) → CDN distribution",
      "Content moderation at upload time — automated detection of policy violations (nudity, violence, misinformation) before publication",
      "Creator economy features: live gifting, creator fund payouts, branded content marketplace",
      "Duet and Stitch features requiring frame-accurate video composition on server or client",
      "Global CDN with regional content regulations — different content availability per country",
    ],
    hints: [
      {
        title: "Recommendation engine",
        content:
          "TikTok's FYP uses an interest graph built from watch-time signals (not social graph). Track: watch duration, replays, shares, comments, follows-from-video. Feed these signals into a real-time stream processor.",
      },
      {
        title: "Video pipeline",
        content:
          "Upload to object storage → push processing job to message queue → workers transcode to 360p/720p/1080p → push to CDN. Run content moderation in parallel with transcoding to minimize time-to-publish.",
      },
      {
        title: "Feed serving",
        content:
          "Pre-compute a ranked candidate pool per user. On each swipe, serve the next video from the pool. Refresh the pool every few minutes using the latest engagement signals.",
      },
      {
        title: "Advanced: Two-tower recommendation",
        content:
          "Use a two-tower neural network: one tower encodes user interests (watch history, engagement patterns), the other encodes video features (visual embeddings, audio, text, hashtags). Compute dot-product similarity to score candidates. Generate candidates from multiple sources: interest graph, trending, geographic, and following — then blend and re-rank using the two-tower model for the final feed.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "nosql-db", x: 720, y: 200 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "search", x: 880, y: 80 },
        { componentId: "stream-processor", x: 720, y: 420 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "cdn", target: "object-storage" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "search" },
        { source: "message-queue", target: "stream-processor" },
        { source: "message-queue", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Recommendations", "CDN", "Streaming", "ML"],
  },
  {
    id: "message-queue-design",
    title: "Distributed Message Queue (Kafka)",
    difficulty: "Hard",
    description:
      "Design a distributed message queue system like Apache Kafka that provides durable, ordered, and high-throughput message delivery between services. Kafka processes trillions of messages per day at companies like LinkedIn, handling 1M+ messages/second per broker — the core challenges are designing a partitioned commit log that supports parallel consumption, implementing consumer group coordination with partition rebalancing, achieving exactly-once semantics through idempotent producers and transactional writes, and maintaining data durability through in-sync replica (ISR) sets with configurable acknowledgment levels.",
    requirements: {
      readsPerSec: 1000000,
      writesPerSec: 1000000,
      storageGB: 500000,
      latencyMs: 5,
      users: "N/A (infrastructure)",
    },
    constraints: [
      "Partitioned commit log — messages within a partition are strictly ordered and assigned monotonic offsets",
      "Consumer groups with automatic partition assignment — each partition consumed by exactly one consumer in the group",
      "In-Sync Replica (ISR) set — configurable replication factor (typically 3) with leader-based writes and follower replication",
      "Exactly-once semantics via idempotent producers (sequence numbers per partition) and transactional writes across partitions",
      "Log compaction — retain only the latest value per key for changelog/snapshot topics",
      "Configurable retention: time-based (7 days default) or size-based (per partition log segment cleanup)",
    ],
    hints: [
      {
        title: "Partitioned log",
        content:
          "Model each topic as N partitions. Each partition is an append-only log stored on disk. Producers hash the message key to determine the target partition. This enables parallel writes and ordered consumption per partition.",
      },
      {
        title: "Replication for durability",
        content:
          "Each partition has a leader and N-1 follower replicas. Producers write to the leader, followers pull and replicate. The ISR (In-Sync Replica) set tracks which followers are caught up. Configurable acks: 0 (fire-and-forget), 1 (leader only), all (all ISR replicas).",
      },
      {
        title: "Consumer groups",
        content:
          "A consumer group coordinator assigns partitions to consumers. When a consumer joins or leaves, trigger a rebalance. Store consumer offsets in an internal __consumer_offsets topic for durability.",
      },
      {
        title: "Advanced: Zero-copy and page cache",
        content:
          "Kafka achieves high throughput by leveraging the OS page cache for reads (no application-level cache needed) and zero-copy transfers (sendfile syscall) from disk to network socket. Sequential disk writes are faster than random memory access — Kafka's append-only log exploits this for 800MB/s+ write throughput per broker on commodity SSDs.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "load-balancer", x: 100, y: 250 },
        { componentId: "app-server", x: 300, y: 250 },
        { componentId: "nosql-db", x: 500, y: 150 },
        { componentId: "monitoring", x: 500, y: 350 },
        { componentId: "distributed-lock", x: 300, y: 100 },
        { componentId: "service-discovery", x: 300, y: 400 },
      ],
      edges: [
        { source: "load-balancer", target: "app-server" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "service-discovery" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Queue", "Distributed", "Replication", "Streaming"],
  },
  {
    id: "digital-wallet",
    title: "Digital Wallet / UPI",
    difficulty: "Hard",
    description:
      "Design a digital wallet and P2P payment system like Google Pay, PayTM, or UPI (Unified Payments Interface). India's UPI network processes over 16 billion transactions per month across 600+ banks — the core challenges are maintaining strict financial consistency with double-entry bookkeeping, achieving exactly-once transaction execution through idempotency keys (critical when network timeouts cause retries), implementing distributed locks for concurrent balance updates, and meeting regulatory requirements for transaction audit trails, KYC compliance, and settlement reconciliation with banking partners.",
    requirements: {
      readsPerSec: 50000,
      writesPerSec: 30000,
      storageGB: 10000,
      latencyMs: 200,
      users: "100M DAU",
    },
    constraints: [
      "Exactly-once transaction execution using idempotency keys — retries must return the same result without re-debiting",
      "Double-entry bookkeeping — every transfer creates a debit on sender and credit on receiver that sum to zero",
      "Distributed locks for balance updates — prevent race conditions when concurrent transactions hit the same wallet",
      "KYC (Know Your Customer) compliance with tiered wallet limits based on verification level",
      "Transaction history with complete audit trail — every state transition logged for regulatory reporting",
      "Bank settlement reconciliation — daily batch settlement with partner banks, handling discrepancies automatically",
    ],
    hints: [
      {
        title: "Idempotency first",
        content:
          "Every transaction API call must include an idempotency key. Before executing, check if this key was already processed. Store the key and result atomically with the transaction in the same database transaction.",
      },
      {
        title: "Balance management",
        content:
          "Use a SQL database with SERIALIZABLE isolation for wallet balances. Use SELECT FOR UPDATE or distributed locks to prevent concurrent transactions from creating negative balances.",
      },
      {
        title: "Transaction state machine",
        content:
          "Model each transaction as: initiated → debited → credited → completed (or failed → reversed). Use a message queue for reliable state transitions with compensating transactions on failure.",
      },
      {
        title: "Advanced: Saga with compensation",
        content:
          "For P2P transfers: Step 1: Debit sender's wallet (with distributed lock). Step 2: Credit receiver's wallet. If Step 2 fails, execute compensating action (re-credit sender). Use a message queue to orchestrate saga steps. Store the saga state so it can resume after any failure. This achieves eventual consistency while maintaining financial accuracy.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "auth-service", x: 350, y: 100 },
        { componentId: "rate-limiter", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 100 },
        { componentId: "distributed-lock", x: 530, y: 420 },
        { componentId: "message-queue", x: 720, y: 420 },
        { componentId: "sql-db", x: 720, y: 200 },
        { componentId: "nosql-db", x: 720, y: 100 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "auth-service" },
        { source: "api-gateway", target: "rate-limiter" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "distributed-lock" },
        { source: "app-server", target: "sql-db" },
        { source: "app-server", target: "message-queue" },
        { source: "message-queue", target: "nosql-db" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["ACID", "Idempotent", "Ledger", "Payments"],
  },
  {
    id: "code-editor",
    title: "Online Code Editor",
    difficulty: "Medium",
    description:
      "Design an online code editor and execution platform like Replit, CodeSandbox, or VS Code for the Web. The system supports real-time collaborative editing, sandboxed code execution in 50+ programming languages, and a virtual file system per project. Replit serves 20+ million developers — the core challenges are implementing real-time collaboration with conflict resolution (OT/CRDT) across multiple cursors, securely sandboxing user code execution in isolated containers with resource limits (CPU, memory, network), and providing Language Server Protocol (LSP) features (autocomplete, go-to-definition, error diagnostics) with low latency.",
    requirements: {
      readsPerSec: 30000,
      writesPerSec: 20000,
      storageGB: 50000,
      latencyMs: 100,
      users: "10M DAU",
    },
    constraints: [
      "Real-time collaborative editing using OT or CRDT with multi-cursor support and conflict resolution",
      "Sandboxed code execution in isolated containers (gVisor/Firecracker) with CPU, memory, and network resource limits",
      "Language Server Protocol (LSP) integration for autocomplete, diagnostics, go-to-definition across 50+ languages",
      "Virtual file system per project with version history and git integration",
      "Terminal emulation with PTY (pseudo-terminal) forwarding over WebSocket",
      "Instant project boot — sub-5-second cold start using pre-warmed container pools and filesystem snapshots",
    ],
    hints: [
      {
        title: "Collaboration layer",
        content:
          "Use a WebSocket server for real-time sync. Implement OT (Operational Transformation) or CRDT for conflict-free concurrent edits. Broadcast cursor positions and selections to all collaborators.",
      },
      {
        title: "Sandboxed execution",
        content:
          "Run user code in lightweight VMs (Firecracker) or sandboxed containers (gVisor). Pre-warm a pool of containers per language to minimize cold-start latency. Enforce strict resource limits and network isolation.",
      },
      {
        title: "File system design",
        content:
          "Use object storage for persistent project files with a NoSQL metadata database. Cache active project files in memory on the execution container for fast reads. Sync changes back to object storage on save.",
      },
      {
        title: "Advanced: Snapshot and restore",
        content:
          "Use filesystem snapshots (overlayfs) to create instant project forks. Pre-build base images for each language with common dependencies pre-installed. On project open, layer the user's files on top of the base image using an overlay filesystem — this gives sub-second project boot times instead of installing dependencies from scratch.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "dns", x: 50, y: 250 },
        { componentId: "cdn", x: 200, y: 80 },
        { componentId: "load-balancer", x: 200, y: 250 },
        { componentId: "api-gateway", x: 350, y: 250 },
        { componentId: "websocket-server", x: 350, y: 420 },
        { componentId: "app-server", x: 530, y: 250 },
        { componentId: "cache", x: 530, y: 80 },
        { componentId: "message-queue", x: 530, y: 420 },
        { componentId: "nosql-db", x: 720, y: 250 },
        { componentId: "object-storage", x: 720, y: 80 },
        { componentId: "monitoring", x: 880, y: 250 },
      ],
      edges: [
        { source: "dns", target: "cdn" },
        { source: "dns", target: "load-balancer" },
        { source: "load-balancer", target: "api-gateway" },
        { source: "load-balancer", target: "websocket-server" },
        { source: "api-gateway", target: "app-server" },
        { source: "websocket-server", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "nosql-db" },
        { source: "app-server", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Collaboration", "Sandbox", "WebSocket", "LSP"],
  },
  {
    id: "cicd-pipeline",
    title: "CI/CD Pipeline",
    difficulty: "Medium",
    description:
      "Design a continuous integration and continuous deployment platform like GitHub Actions, GitLab CI, or Jenkins. The system orchestrates build pipelines triggered by code commits, runs tests in parallel across isolated environments, stores build artifacts, and deploys to production using strategies like blue-green or canary. GitHub Actions processes millions of workflow runs daily — the core challenges are efficiently scheduling and executing build jobs across a fleet of heterogeneous runners, managing artifact storage and caching for fast builds, and implementing reliable deployment orchestration with automatic rollback on failure detection.",
    requirements: {
      readsPerSec: 20000,
      writesPerSec: 10000,
      storageGB: 200000,
      latencyMs: 500,
      users: "5M DAU",
    },
    constraints: [
      "Pipeline orchestration: define workflows as DAGs (directed acyclic graphs) of jobs with dependency edges",
      "Parallel test execution across isolated runners — scale runner fleet dynamically based on queue depth",
      "Build caching: cache dependencies (node_modules, Maven repo) and Docker layers across runs for 3-10x speedup",
      "Artifact storage with retention policies — store build outputs, test reports, and coverage data",
      "Deployment strategies: blue-green (instant switch), canary (gradual rollout with health checks), rolling update",
      "Automatic rollback on deployment failure — detect health check failures and revert to the previous known-good version",
    ],
    hints: [
      {
        title: "Job scheduling",
        content:
          "Use a message queue with priority lanes for different job types. A scheduler service parses the workflow DAG, resolves dependencies, and enqueues jobs as their dependencies complete.",
      },
      {
        title: "Runner management",
        content:
          "Runners pull jobs from the queue, execute in isolated containers, and report results. Use auto-scaling (scale runners based on queue depth) with a minimum warm pool to avoid cold-start delays.",
      },
      {
        title: "Build caching",
        content:
          "Cache dependencies in object storage keyed by lock-file hash. On each build, check if a cache exists for the current dependency set. This can reduce build times by 3-10x for dependency-heavy projects.",
      },
      {
        title: "Advanced: Canary deployments",
        content:
          "Deploy the new version to 5% of traffic (canary). Monitor error rates, latency p99, and custom health metrics for 10 minutes. If metrics stay within thresholds, gradually increase to 25% → 50% → 100%. If any metric degrades, automatically roll back to the previous version and notify the team. Store deployment state in a SQL database for auditability.",
      },
    ],
    referenceSolution: {
      nodes: [
        { componentId: "load-balancer", x: 100, y: 250 },
        { componentId: "api-gateway", x: 250, y: 250 },
        { componentId: "app-server", x: 420, y: 250 },
        { componentId: "cache", x: 420, y: 80 },
        { componentId: "message-queue", x: 420, y: 420 },
        { componentId: "sql-db", x: 620, y: 250 },
        { componentId: "object-storage", x: 620, y: 80 },
        { componentId: "task-scheduler", x: 620, y: 420 },
        { componentId: "monitoring", x: 820, y: 250 },
      ],
      edges: [
        { source: "load-balancer", target: "api-gateway" },
        { source: "api-gateway", target: "app-server" },
        { source: "app-server", target: "cache" },
        { source: "app-server", target: "message-queue" },
        { source: "app-server", target: "sql-db" },
        { source: "message-queue", target: "task-scheduler" },
        { source: "task-scheduler", target: "object-storage" },
        { source: "app-server", target: "monitoring" },
      ],
    },
    tags: ["Pipeline", "Deployment", "Orchestration", "Caching"],
  },
];

export function getProblemById(id: string): Problem | undefined {
  // Check predefined problems first
  const predefined = PROBLEMS.find((p) => p.id === id);
  if (predefined) return predefined;

  // Check custom problems
  if (id.startsWith("custom-")) {
    const custom = useCustomProblemsStore
      .getState()
      .problems.find((p) => p.id === id);
    if (custom) {
      // Return a Problem-compatible shape (no hints or reference solution)
      return {
        id: custom.id,
        title: custom.title,
        difficulty: custom.difficulty,
        description: custom.description,
        requirements: custom.requirements,
        constraints: custom.constraints,
        hints: [],
        referenceSolution: { nodes: [], edges: [] },
        tags: custom.tags,
      };
    }
  }

  return undefined;
}
