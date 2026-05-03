export interface TradeoffCard {
  id: string;
  title: string;
  optionA: { name: string; pros: string[]; cons: string[] };
  optionB: { name: string; pros: string[]; cons: string[] };
  whenToChooseA: string;
  whenToChooseB: string;
}

export const TRADEOFF_CARDS: TradeoffCard[] = [
  {
    id: "sql-vs-nosql",
    title: "SQL vs NoSQL",
    optionA: {
      name: "SQL (Relational)",
      pros: [
        "ACID transactions",
        "Strong consistency",
        "Complex joins and queries",
        "Well-understood schema enforcement",
      ],
      cons: [
        "Harder to scale horizontally",
        "Rigid schema — migrations can be painful",
        "Lower write throughput at extreme scale",
      ],
    },
    optionB: {
      name: "NoSQL (Document/Key-Value)",
      pros: [
        "Horizontal scaling built-in",
        "Flexible schema",
        "High write throughput",
        "Low-latency key-value lookups",
      ],
      cons: [
        "Limited join support",
        "Eventual consistency by default",
        "Data modeling requires denormalization",
      ],
    },
    whenToChooseA: "When you need complex queries, transactions, or strong consistency (payments, inventory, user accounts).",
    whenToChooseB: "When you need massive scale, flexible schema, or high write throughput (social feeds, IoT data, session stores).",
  },
  {
    id: "push-vs-pull",
    title: "Push vs Pull (Fan-out)",
    optionA: {
      name: "Fan-out on Write (Push)",
      pros: [
        "Fast reads — timeline is pre-computed",
        "Simple read path",
        "Consistent user experience",
      ],
      cons: [
        "High write amplification for popular users",
        "Wasted work if followers never read",
        "Slow writes for celebrity accounts",
      ],
    },
    optionB: {
      name: "Fan-out on Read (Pull)",
      pros: [
        "No write amplification",
        "Always fresh data",
        "Simple write path",
      ],
      cons: [
        "Slow reads — must aggregate at read time",
        "Higher read latency",
        "Complex read path with many DB queries",
      ],
    },
    whenToChooseA: "For most users with moderate follower counts where read latency matters most.",
    whenToChooseB: "For celebrity/high-follower accounts, or when write simplicity is more important than read speed.",
  },
  {
    id: "sync-vs-async",
    title: "Sync vs Async Communication",
    optionA: {
      name: "Synchronous (Request-Response)",
      pros: [
        "Simple to reason about",
        "Immediate feedback",
        "Easy error handling",
        "Natural request-response pattern",
      ],
      cons: [
        "Tight coupling between services",
        "Cascading failures",
        "Caller blocks until response",
      ],
    },
    optionB: {
      name: "Asynchronous (Message Queue)",
      pros: [
        "Loose coupling",
        "Better fault tolerance",
        "Natural load leveling",
        "Retry and dead-letter support",
      ],
      cons: [
        "Harder to debug",
        "Eventual consistency",
        "Message ordering challenges",
        "Additional infrastructure (broker)",
      ],
    },
    whenToChooseA: "When you need immediate responses and simple request-response flows (API gateway to service, user-facing reads).",
    whenToChooseB: "For fire-and-forget tasks, cross-service events, or when you need to decouple producers from consumers (notifications, analytics, order processing).",
  },
  {
    id: "strong-vs-eventual",
    title: "Strong vs Eventual Consistency",
    optionA: {
      name: "Strong Consistency",
      pros: [
        "All reads see the latest write",
        "Simplifies application logic",
        "No stale data surprises",
      ],
      cons: [
        "Higher latency (coordination overhead)",
        "Lower availability during partitions",
        "Harder to scale geographically",
      ],
    },
    optionB: {
      name: "Eventual Consistency",
      pros: [
        "Higher availability",
        "Lower latency",
        "Better geographic distribution",
        "Higher throughput",
      ],
      cons: [
        "Stale reads possible",
        "Complex conflict resolution",
        "Application must handle inconsistency",
      ],
    },
    whenToChooseA: "For financial transactions, inventory counts, or anywhere correctness is non-negotiable.",
    whenToChooseB: "For social feeds, analytics, caches, or anywhere slight staleness is acceptable for better performance.",
  },
  {
    id: "monolith-vs-microservices",
    title: "Monolith vs Microservices",
    optionA: {
      name: "Monolith",
      pros: [
        "Simple deployment",
        "Easy local development",
        "No network overhead between modules",
        "Straightforward debugging",
      ],
      cons: [
        "Harder to scale individual components",
        "Longer build/deploy cycles at scale",
        "Technology lock-in",
        "Team coupling",
      ],
    },
    optionB: {
      name: "Microservices",
      pros: [
        "Independent scaling per service",
        "Independent deployments",
        "Technology flexibility per service",
        "Team autonomy",
      ],
      cons: [
        "Distributed system complexity",
        "Network latency between services",
        "Operational overhead (monitoring, tracing)",
        "Data consistency challenges",
      ],
    },
    whenToChooseA: "For early-stage products, small teams, or when the domain is not yet well understood.",
    whenToChooseB: "For large organizations with clear domain boundaries, independent scaling needs, and dedicated platform teams.",
  },
  {
    id: "rest-vs-grpc",
    title: "REST vs gRPC",
    optionA: {
      name: "REST (HTTP/JSON)",
      pros: [
        "Universal browser support",
        "Human-readable payloads",
        "Simple tooling (curl, Postman)",
        "Wide ecosystem",
      ],
      cons: [
        "Larger payload size (JSON)",
        "No built-in streaming",
        "No strict schema enforcement",
        "HTTP/1.1 overhead",
      ],
    },
    optionB: {
      name: "gRPC (Protocol Buffers)",
      pros: [
        "Binary protocol — smaller payloads",
        "Built-in bi-directional streaming",
        "Strong schema via .proto files",
        "HTTP/2 multiplexing",
      ],
      cons: [
        "No native browser support (needs proxy)",
        "Binary payloads harder to debug",
        "Steeper learning curve",
        "Code generation required",
      ],
    },
    whenToChooseA: "For public APIs, browser clients, or when developer experience and debuggability matter most.",
    whenToChooseB: "For internal service-to-service communication where performance, streaming, and strict contracts matter.",
  },
  {
    id: "cache-aside-vs-write-through",
    title: "Cache-aside vs Write-through",
    optionA: {
      name: "Cache-aside (Lazy Loading)",
      pros: [
        "Only caches data that is actually read",
        "Cache failure does not block writes",
        "Simple implementation",
      ],
      cons: [
        "Cache miss penalty (extra DB read)",
        "Stale data until TTL expires",
        "Cold start problem",
      ],
    },
    optionB: {
      name: "Write-through",
      pros: [
        "Cache is always up-to-date",
        "No stale data",
        "Consistent read performance",
      ],
      cons: [
        "Write latency increases (write to cache + DB)",
        "Caches data that may never be read",
        "More complex write path",
      ],
    },
    whenToChooseA: "For read-heavy workloads where some staleness is acceptable and you want to minimize cache size.",
    whenToChooseB: "When data freshness is critical and the write volume is manageable.",
  },
  {
    id: "vertical-vs-horizontal",
    title: "Vertical vs Horizontal Scaling",
    optionA: {
      name: "Vertical Scaling (Scale Up)",
      pros: [
        "No code changes needed",
        "No distributed system complexity",
        "Simple data consistency",
        "Lower operational overhead",
      ],
      cons: [
        "Hardware limits (single machine ceiling)",
        "Single point of failure",
        "Expensive at high end",
        "Downtime during upgrades",
      ],
    },
    optionB: {
      name: "Horizontal Scaling (Scale Out)",
      pros: [
        "Virtually unlimited capacity",
        "Better fault tolerance",
        "Cost-effective with commodity hardware",
        "Zero-downtime scaling",
      ],
      cons: [
        "Distributed system complexity",
        "Data partitioning challenges",
        "Network overhead",
        "Consistency challenges",
      ],
    },
    whenToChooseA: "For early-stage systems, databases that are hard to shard, or when simplicity outweighs scale needs.",
    whenToChooseB: "When you need fault tolerance, unlimited growth, or when individual machines cannot handle the load.",
  },
  {
    id: "polling-vs-websocket",
    title: "Polling vs WebSocket",
    optionA: {
      name: "Polling (Short/Long)",
      pros: [
        "Simple to implement",
        "Works through all proxies/firewalls",
        "Stateless — easy to load balance",
        "HTTP caching friendly",
      ],
      cons: [
        "Wasted requests when no new data",
        "Higher latency (polling interval)",
        "More server load at scale",
      ],
    },
    optionB: {
      name: "WebSocket",
      pros: [
        "Real-time bidirectional communication",
        "Low latency",
        "Efficient — no repeated handshakes",
        "Server can push updates instantly",
      ],
      cons: [
        "Stateful connections — harder to load balance",
        "Connection management overhead",
        "Proxy/firewall compatibility issues",
        "Reconnection logic needed",
      ],
    },
    whenToChooseA: "For infrequent updates, simple dashboards, or when infrastructure does not support persistent connections.",
    whenToChooseB: "For chat, live feeds, collaborative editing, gaming, or any feature needing sub-second updates.",
  },
  {
    id: "single-vs-multi-leader",
    title: "Single Leader vs Multi-Leader Replication",
    optionA: {
      name: "Single Leader",
      pros: [
        "No write conflicts",
        "Simple consistency model",
        "Easy to reason about ordering",
      ],
      cons: [
        "Single point of failure for writes",
        "Write latency for remote clients",
        "Leader failover complexity",
      ],
    },
    optionB: {
      name: "Multi-Leader",
      pros: [
        "Writes accepted at any datacenter",
        "Better write latency for geo-distributed users",
        "Tolerates datacenter outages",
      ],
      cons: [
        "Write conflicts must be resolved",
        "Complex conflict resolution logic",
        "Harder to maintain consistency",
      ],
    },
    whenToChooseA: "When strong consistency is required and most users are in one region.",
    whenToChooseB: "For geo-distributed systems where write latency matters and you can handle conflict resolution (collaborative docs, multi-region apps).",
  },
  {
    id: "hash-vs-range-partitioning",
    title: "Hash Partitioning vs Range Partitioning",
    optionA: {
      name: "Hash Partitioning",
      pros: [
        "Even data distribution",
        "No hotspots from sequential keys",
        "Simple partition assignment",
      ],
      cons: [
        "Range queries require scatter-gather",
        "Rebalancing on cluster resize",
        "Loses data locality",
      ],
    },
    optionB: {
      name: "Range Partitioning",
      pros: [
        "Efficient range queries",
        "Data locality for related keys",
        "Natural ordering preserved",
      ],
      cons: [
        "Hotspots from sequential writes",
        "Uneven partition sizes",
        "Requires careful split-point selection",
      ],
    },
    whenToChooseA: "For key-value lookups where even distribution matters (user IDs, session tokens, URL shortener).",
    whenToChooseB: "When range scans are common (time-series data, alphabetical listings, log analysis).",
  },
  {
    id: "cdn-push-vs-pull",
    title: "CDN Push vs CDN Pull",
    optionA: {
      name: "CDN Push (Origin Push)",
      pros: [
        "Content available immediately",
        "No first-request latency penalty",
        "Full control over what is cached",
      ],
      cons: [
        "Storage costs for all pushed content",
        "Must manage cache invalidation",
        "Wasted space for unpopular content",
      ],
    },
    optionB: {
      name: "CDN Pull (Origin Pull)",
      pros: [
        "Only popular content is cached",
        "Lower storage costs",
        "Automatic cache population",
      ],
      cons: [
        "First request is slow (cache miss)",
        "Thundering herd on cache expiry",
        "Less control over cached content",
      ],
    },
    whenToChooseA: "For critical content that must always be fast (homepage assets, popular videos, app bundles).",
    whenToChooseB: "For long-tail content where most items are rarely accessed (user profile images, old blog posts).",
  },
  {
    id: "token-bucket-vs-sliding-window",
    title: "Rate Limiting: Token Bucket vs Sliding Window",
    optionA: {
      name: "Token Bucket",
      pros: [
        "Allows controlled bursts",
        "Simple to implement",
        "Memory efficient (few counters)",
        "Smooth rate limiting",
      ],
      cons: [
        "Burst traffic can spike",
        "Tuning bucket size and refill rate",
        "Less precise at boundaries",
      ],
    },
    optionB: {
      name: "Sliding Window Log/Counter",
      pros: [
        "Precise rate limiting",
        "No boundary spikes",
        "Accurate per-window counting",
      ],
      cons: [
        "Higher memory usage (log of timestamps)",
        "More complex implementation",
        "Sliding window counter trades precision for memory",
      ],
    },
    whenToChooseA: "When you want to allow short bursts while enforcing average rate (API gateways, general rate limiting).",
    whenToChooseB: "When strict per-window accuracy matters and you cannot tolerate boundary bursts (financial APIs, security-sensitive endpoints).",
  },
  {
    id: "at-least-once-vs-exactly-once",
    title: "Message Queue: At-least-once vs Exactly-once",
    optionA: {
      name: "At-least-once Delivery",
      pros: [
        "Simpler to implement",
        "No message loss",
        "Higher throughput",
        "Most brokers support natively",
      ],
      cons: [
        "Duplicate messages possible",
        "Consumer must be idempotent",
        "Application-level deduplication needed",
      ],
    },
    optionB: {
      name: "Exactly-once Delivery",
      pros: [
        "No duplicates",
        "Simplifies consumer logic",
        "Correct by default",
      ],
      cons: [
        "Significant performance overhead",
        "Requires transactional coordination",
        "Limited broker support (Kafka transactions)",
        "Higher latency",
      ],
    },
    whenToChooseA: "For most use cases — design idempotent consumers instead (notifications, analytics events, log processing).",
    whenToChooseB: "For financial transactions or state changes where duplicates cause real harm and you can afford the performance cost.",
  },
];
