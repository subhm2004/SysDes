export interface ComponentConcept {
  componentId: string;
  whenToUse: string[];
  whenNotToUse: string[];
  keyTradeoffs: string[];
  interviewTips: string[];
  commonPatterns: { name: string; description: string }[];
  realWorldExamples: string[];
}

export const CONCEPT_LIBRARY: Record<string, ComponentConcept> = {
  dns: {
    componentId: "dns",
    whenToUse: [
      "Every system design — DNS is the first hop for resolving domain names to IPs",
      "Geographic load balancing via DNS-based routing (latency-based, geo-based)",
      "Failover and disaster recovery using health-checked DNS records",
      "Service discovery in simpler architectures using SRV records",
    ],
    whenNotToUse: [
      "Fine-grained load balancing — DNS TTL caching makes real-time traffic shifting unreliable",
      "Low-latency failover — DNS propagation can take minutes even with low TTLs",
    ],
    keyTradeoffs: [
      "TTL trade-off: low TTL = faster failover but more DNS queries; high TTL = better caching but slower updates",
      "DNS is a single point of failure if your provider goes down (consider multi-provider DNS)",
      "Clients cache DNS responses — you cannot force instant changes across all clients",
      "DNSSEC adds security but increases response size and lookup latency",
    ],
    interviewTips: [
      "Mention DNS as the first step in any request flow — shows you understand the full path",
      "Discuss Route 53 weighted routing or latency-based routing for global traffic management",
      "Bring up DNS caching layers: browser cache, OS cache, ISP resolver, authoritative server",
    ],
    commonPatterns: [
      { name: "GeoDNS", description: "Route users to the nearest data center based on their geographic location" },
      { name: "Weighted Routing", description: "Distribute traffic across endpoints by weight — useful for canary deployments" },
      { name: "Failover DNS", description: "Health-checked primary/secondary records that automatically redirect on failure" },
    ],
    realWorldExamples: [
      "AWS Route 53 handles trillions of DNS queries per year with 100% SLA",
      "Netflix uses DNS-based global load balancing to route users to the nearest region",
      "GitHub uses Anycast DNS to direct users to the closest edge PoP",
    ],
  },
  cdn: {
    componentId: "cdn",
    whenToUse: [
      "Serving static assets (images, JS, CSS, videos) to a global audience with low latency",
      "Read-heavy content delivery where data changes infrequently",
      "Protecting origin servers from traffic spikes by absorbing load at the edge",
      "Reducing bandwidth costs — CDN edge caches offload origin egress traffic",
    ],
    whenNotToUse: [
      "Highly dynamic, personalized content that cannot be cached (e.g., user-specific API responses)",
      "Small-scale single-region applications where the origin is already close to all users",
      "Real-time data that must always be fresh — cache invalidation adds complexity",
    ],
    keyTradeoffs: [
      "Cache invalidation complexity: purging stale content across thousands of edge nodes takes time",
      "Cost: CDN bandwidth is cheaper than origin, but high-traffic video delivery bills add up",
      "Cold cache problem: first request to a new edge PoP still hits the origin",
      "Dynamic content at the edge (edge compute) is powerful but adds architectural complexity",
    ],
    interviewTips: [
      "Mention CDN as essential for any system serving media — interviewers expect it",
      "Discuss pull vs push CDN models and when each is appropriate",
      "Bring up cache-control headers (max-age, s-maxage, stale-while-revalidate) to show depth",
    ],
    commonPatterns: [
      { name: "Pull-based CDN", description: "Edge fetches from origin on cache miss, caches response for subsequent requests" },
      { name: "Push-based CDN", description: "Origin proactively pushes content to edge nodes before users request it" },
      { name: "Edge Compute", description: "Run logic at CDN edge (Cloudflare Workers, Lambda@Edge) for personalization without origin round-trips" },
    ],
    realWorldExamples: [
      "Netflix uses its Open Connect CDN to serve 15% of global internet traffic from ISP-embedded servers",
      "Cloudflare CDN operates 300+ edge PoPs serving 50M+ HTTP requests per second",
      "YouTube uses Google's CDN to deliver over 1 billion hours of video per day globally",
    ],
  },
  "load-balancer": {
    componentId: "load-balancer",
    whenToUse: [
      "Distributing traffic across multiple backend instances for horizontal scaling",
      "Enabling zero-downtime deployments via rolling updates and connection draining",
      "Health checking backends and removing unhealthy instances from the pool",
      "SSL/TLS termination to offload encryption from application servers",
    ],
    whenNotToUse: [
      "Single-server setups where there is nothing to balance across",
      "Client-side load balancing in service mesh architectures may replace traditional LBs",
      "UDP-heavy workloads where Layer 7 features are unnecessary — use Layer 4 NLB instead",
    ],
    keyTradeoffs: [
      "Layer 4 (TCP) vs Layer 7 (HTTP): L4 is faster but L7 enables content-based routing, sticky sessions, and header inspection",
      "Single LB is a SPOF — always deploy in HA pairs or use managed cloud LBs",
      "Sticky sessions hurt even distribution and complicate scaling — prefer stateless backends",
      "Algorithm choice matters: round-robin is simple, least-connections handles varying request costs better",
    ],
    interviewTips: [
      "Distinguish L4 vs L7 load balancing and explain when you would use each",
      "Mention consistent hashing for cache-friendly routing without sticky sessions",
      "Discuss health checks (active vs passive) and graceful connection draining during deploys",
    ],
    commonPatterns: [
      { name: "Round Robin", description: "Distribute requests sequentially across servers — simple but ignores server load" },
      { name: "Least Connections", description: "Route to the server with fewest active connections — better for varying request durations" },
      { name: "Consistent Hashing", description: "Hash request key to a server — ensures same key always hits the same server (good for caching)" },
    ],
    realWorldExamples: [
      "AWS ALB handles millions of requests per second with content-based routing rules",
      "Google Cloud Load Balancing provides a single anycast IP across all global regions",
      "Dropbox uses custom L4/L7 load balancers (Bandaid) to manage traffic to billions of files",
    ],
  },
  "api-gateway": {
    componentId: "api-gateway",
    whenToUse: [
      "Microservices architecture needing a unified API surface for external clients",
      "Cross-cutting concerns: authentication, rate limiting, logging, request transformation",
      "API versioning and protocol translation (REST to gRPC, GraphQL federation)",
      "Backend-for-frontend (BFF) pattern aggregating multiple service calls into one response",
    ],
    whenNotToUse: [
      "Simple monolithic applications where a single server handles everything",
      "Internal service-to-service calls — use service mesh instead of routing through a gateway",
      "When it becomes a bottleneck or single point of failure due to all traffic funneling through it",
    ],
    keyTradeoffs: [
      "Added latency: every request passes through an extra network hop",
      "Single point of failure if not deployed with HA — must be horizontally scaled",
      "Tight coupling risk: gateway becomes a monolith if too much business logic is added",
      "Operational complexity of maintaining routing rules, rate limits, and transformations",
    ],
    interviewTips: [
      "Mention API gateway as the entry point in any microservices design — shows architectural maturity",
      "Discuss the BFF pattern for mobile vs web clients needing different API shapes",
      "Explain how rate limiting at the gateway protects all downstream services uniformly",
    ],
    commonPatterns: [
      { name: "Backend for Frontend (BFF)", description: "Dedicated gateway per client type (web, mobile, IoT) with tailored aggregation" },
      { name: "Request Aggregation", description: "Gateway combines multiple microservice calls into a single client response" },
      { name: "Edge Authentication", description: "Validate JWT/OAuth tokens at the gateway so downstream services trust the identity" },
    ],
    realWorldExamples: [
      "Netflix Zuul gateway handles billions of API requests per day with dynamic routing filters",
      "Amazon API Gateway powers the AWS ecosystem with throttling and usage plans",
      "Uber uses a custom API gateway for routing across thousands of microservices",
    ],
  },
  "rate-limiter": {
    componentId: "rate-limiter",
    whenToUse: [
      "Protecting APIs from abuse, DDoS attacks, and runaway clients",
      "Enforcing usage quotas for tiered pricing (free vs paid API plans)",
      "Preventing thundering herd effects on downstream services during traffic spikes",
      "Ensuring fair resource allocation across multiple tenants",
    ],
    whenNotToUse: [
      "Internal trusted services where rate limiting adds unnecessary latency",
      "Batch processing jobs where throttling would unnecessarily slow down pipelines",
    ],
    keyTradeoffs: [
      "Too strict = legitimate users get blocked; too lenient = insufficient protection",
      "Distributed rate limiting requires shared state (Redis) which adds latency and a dependency",
      "Algorithm choice: token bucket allows bursts, sliding window is smoother but more memory-intensive",
      "Client-side vs server-side: client-side can be bypassed, server-side adds latency to every request",
    ],
    interviewTips: [
      "Compare token bucket vs sliding window vs fixed window algorithms and their burst behavior",
      "Mention Redis-backed distributed rate limiting for multi-instance deployments",
      "Discuss rate limiting headers (X-RateLimit-Remaining, Retry-After) for good API UX",
    ],
    commonPatterns: [
      { name: "Token Bucket", description: "Tokens refill at a fixed rate; requests consume tokens. Allows controlled bursts." },
      { name: "Sliding Window Log", description: "Track timestamps of each request in a window — precise but memory-intensive" },
      { name: "Fixed Window Counter", description: "Count requests per fixed time window — simple but allows burst at window boundaries" },
    ],
    realWorldExamples: [
      "GitHub API enforces 5,000 requests/hour per authenticated user",
      "Stripe rate limits API requests per second per key with graceful 429 responses",
      "Cloudflare rate limiting protects millions of websites from L7 DDoS attacks",
    ],
  },
  "app-server": {
    componentId: "app-server",
    whenToUse: [
      "Running core business logic that processes API requests and orchestrates services",
      "Stateless request handling that scales horizontally behind a load balancer",
      "REST/gRPC API endpoints serving client applications",
      "Any compute workload that benefits from auto-scaling based on traffic",
    ],
    whenNotToUse: [
      "Static content serving — use a CDN or reverse proxy instead",
      "Long-running background tasks — offload to task schedulers or message queue consumers",
      "Event-driven compute with sporadic traffic — consider serverless (Lambda) to avoid idle costs",
    ],
    keyTradeoffs: [
      "Stateless = easy to scale, but requires external session storage (Redis, DB) for user state",
      "Container vs VM: containers start faster and pack denser, but VMs offer stronger isolation",
      "Auto-scaling lag: spinning up new instances takes 30s-2min — pre-warm for predictable spikes",
      "Cost: always-on servers vs serverless — breakeven depends on traffic consistency",
    ],
    interviewTips: [
      "Always describe app servers as stateless — interviewers look for this as a scalability signal",
      "Mention horizontal scaling with auto-scaling groups and how you handle state externally",
      "Discuss graceful shutdown and health check endpoints for zero-downtime deployments",
    ],
    commonPatterns: [
      { name: "Stateless Horizontal Scaling", description: "Store all state externally (DB, cache) so any instance can handle any request" },
      { name: "Circuit Breaker", description: "Stop calling a failing downstream service and return fallback — prevents cascade failures" },
      { name: "Bulkhead Pattern", description: "Isolate resources per service dependency so one slow service does not exhaust all threads" },
    ],
    realWorldExamples: [
      "Instagram runs thousands of stateless Django app servers behind L7 load balancers",
      "Uber runs thousands of microservice instances in Kubernetes with auto-scaling",
      "Airbnb migrated from a Ruby monolith to hundreds of Java/Kotlin microservices",
    ],
  },
  "auth-service": {
    componentId: "auth-service",
    whenToUse: [
      "Centralizing authentication and authorization across multiple microservices",
      "JWT/OAuth2 token issuance, validation, and refresh flows",
      "Multi-factor authentication, SSO, and social login integration",
      "Fine-grained role-based access control (RBAC) or attribute-based access control (ABAC)",
    ],
    whenNotToUse: [
      "Extremely simple apps with a single service where auth logic is trivial",
      "Machine-to-machine communication that uses mutual TLS instead of token-based auth",
    ],
    keyTradeoffs: [
      "Centralized auth = single point of failure. Must be highly available with caching.",
      "JWT vs session tokens: JWTs are stateless but cannot be revoked instantly; sessions need server-side storage",
      "Token expiry: short-lived = more secure but more refresh traffic; long-lived = fewer refreshes but wider attack window",
      "Build vs buy: Auth0/Cognito reduce dev time but limit customization and add vendor lock-in",
    ],
    interviewTips: [
      "Explain JWT structure (header.payload.signature) and why you would use asymmetric keys for verification",
      "Discuss token refresh flows and how to handle revocation (blocklist or short TTL)",
      "Mention API gateway integration — validate tokens at the edge to reduce load on the auth service",
    ],
    commonPatterns: [
      { name: "OAuth 2.0 + OIDC", description: "Industry standard for delegated authorization and identity — supports multiple grant types" },
      { name: "Token Refresh", description: "Short-lived access tokens + long-lived refresh tokens balance security and UX" },
      { name: "Gateway-level Auth", description: "API gateway validates JWTs before forwarding — services trust the gateway's identity context" },
    ],
    realWorldExamples: [
      "Google uses OAuth 2.0 for all third-party API access across its entire ecosystem",
      "Auth0 handles 4.5 billion+ login transactions per month for thousands of companies",
      "Netflix centralizes auth via a custom edge service (Zuul filters) before requests reach microservices",
    ],
  },
  "sql-db": {
    componentId: "sql-db",
    whenToUse: [
      "Data with complex relationships requiring JOINs and referential integrity",
      "ACID transactions — financial data, inventory, user accounts",
      "Well-defined schema with structured data that evolves predictably",
      "Strong consistency requirements where eventual consistency is unacceptable",
    ],
    whenNotToUse: [
      "Massive horizontal scaling needs (>100k writes/sec) — sharding SQL is painful",
      "Unstructured or rapidly evolving schemas (logs, social feeds, IoT sensor data)",
      "Simple key-value lookups at ultra-low latency — a cache or NoSQL DB is better",
    ],
    keyTradeoffs: [
      "Vertical scaling has limits — horizontal sharding is complex (routing, cross-shard joins, rebalancing)",
      "Read replicas reduce read load but introduce replication lag (eventual consistency for reads)",
      "Normalization reduces storage and ensures consistency, but denormalization improves read performance",
      "ORM convenience vs raw SQL performance — ORMs can generate inefficient queries",
    ],
    interviewTips: [
      "Explain read replicas for scaling reads and when replication lag is acceptable",
      "Discuss sharding strategies (hash-based, range-based) and the problems they introduce",
      "Mention indexing strategy — B-tree vs hash indexes, covering indexes, and query plan analysis",
    ],
    commonPatterns: [
      { name: "Primary-Replica", description: "Write to primary, read from replicas — scales reads but introduces replication lag" },
      { name: "Sharding", description: "Partition data across multiple databases by a shard key — scales writes but complicates queries" },
      { name: "CQRS", description: "Separate read and write models — optimize each independently with different storage strategies" },
    ],
    realWorldExamples: [
      "Instagram uses PostgreSQL with extensive sharding to store billions of user records",
      "Shopify shards MySQL across hundreds of instances using application-level routing",
      "Stripe uses PostgreSQL for financial transactions requiring strict ACID guarantees",
    ],
  },
  "nosql-db": {
    componentId: "nosql-db",
    whenToUse: [
      "Massive write throughput with horizontal scaling (millions of writes/sec)",
      "Flexible or evolving schemas — document, key-value, or wide-column data models",
      "Low-latency key-value lookups at scale where consistency can be tuned",
      "Distributed workloads across multiple regions with eventual consistency",
    ],
    whenNotToUse: [
      "Complex queries with multi-table JOINs — NoSQL data modeling requires denormalization",
      "Strict ACID transactions across multiple entities (use SQL or NewSQL instead)",
      "Small-scale applications where a simple PostgreSQL instance handles everything",
    ],
    keyTradeoffs: [
      "Schema flexibility is a double-edged sword — no schema enforcement can lead to data quality issues",
      "Denormalization means faster reads but data duplication and complex update logic",
      "Tunable consistency (ONE, QUORUM, ALL) trades availability for consistency",
      "Access pattern driven design — you must know your queries upfront, unlike SQL",
    ],
    interviewTips: [
      "Explain CAP theorem and where your chosen NoSQL DB falls (CP vs AP)",
      "Discuss data modeling for access patterns — partition key design is critical for DynamoDB/Cassandra",
      "Mention when you would choose DynamoDB (key-value) vs MongoDB (document) vs Cassandra (wide-column)",
    ],
    commonPatterns: [
      { name: "Single Table Design", description: "DynamoDB pattern: store multiple entity types in one table with composite keys" },
      { name: "Wide-Column Model", description: "Cassandra pattern: denormalize and duplicate data for each query pattern" },
      { name: "Document Store", description: "MongoDB pattern: embed related data in a single document to avoid joins" },
    ],
    realWorldExamples: [
      "Amazon uses DynamoDB internally for shopping cart, session management, and catalog at massive scale",
      "Apple uses Cassandra for over 100 PB of data powering iCloud and other services",
      "MongoDB Atlas powers thousands of applications from startups to enterprises like eBay and Toyota",
    ],
  },
  cache: {
    componentId: "cache",
    whenToUse: [
      "Read-heavy workloads (>10:1 read/write ratio)",
      "Data accessed frequently with tolerance for slight staleness",
      "Reduce database load and latency for hot data",
      "Session storage, leaderboards, rate limiting counters",
    ],
    whenNotToUse: [
      "Write-heavy workloads where data changes faster than cache invalidates",
      "Data that must always be strongly consistent (financial balances)",
    ],
    keyTradeoffs: [
      "Cache invalidation is the hardest problem — TTL vs event-driven vs write-through",
      "Memory is expensive — cache only hot data, not everything",
      "Cache stampede risk: when cache expires and thousands of requests hit DB simultaneously",
      "Consistency: stale reads are possible with cache-aside pattern",
    ],
    interviewTips: [
      "Always mention your cache invalidation strategy — interviewers look for this",
      "Discuss cache-aside vs write-through vs write-behind and WHY you chose one",
      "Mention Redis Cluster for horizontal scaling and HA",
    ],
    commonPatterns: [
      { name: "Cache-Aside (Lazy Loading)", description: "App checks cache first, on miss reads from DB and populates cache" },
      { name: "Write-Through", description: "Every write goes to cache AND DB — consistent but higher write latency" },
      { name: "Write-Behind (Write-Back)", description: "Write to cache, async flush to DB — fast writes but data loss risk" },
    ],
    realWorldExamples: [
      "Twitter uses Redis for timeline caching (fan-out-on-write)",
      "Facebook's Memcached fleet caches billions of objects across data centers",
      "Discord uses Redis for real-time presence and rate limiting",
    ],
  },
  "object-storage": {
    componentId: "object-storage",
    whenToUse: [
      "Storing large unstructured blobs: images, videos, backups, logs, data lake files",
      "Virtually unlimited storage capacity with 11 nines (99.999999999%) durability",
      "Static website hosting or serving assets paired with a CDN",
      "Data archival and compliance — lifecycle policies move data to cold storage automatically",
    ],
    whenNotToUse: [
      "Frequently updated small records — use a database instead (object storage has high latency per operation)",
      "File system semantics needed (random writes, appends, directory listing) — use block/file storage",
      "Low-latency key-value lookups — S3 GET latency is ~100ms, too slow for hot path",
    ],
    keyTradeoffs: [
      "S3 historically had eventual consistency but now provides strong read-after-write consistency for all operations since December 2020",
      "Cost-effective for storage but egress bandwidth costs can be significant at scale",
      "No append or partial update — must rewrite entire object for any change",
      "Performance: S3 supports 5,500 GETs and 3,500 PUTs per prefix per second — prefix design matters",
    ],
    interviewTips: [
      "Mention S3 as the default for any media/file storage — interviewers expect it",
      "Discuss pre-signed URLs for secure direct uploads/downloads without proxying through your servers",
      "Bring up S3 + CDN pairing for serving static content globally at low latency",
    ],
    commonPatterns: [
      { name: "Pre-signed URLs", description: "Generate time-limited URLs so clients upload/download directly to S3 without proxying" },
      { name: "CDN + Origin", description: "S3 as CDN origin — CDN caches objects at edge, S3 stores the source of truth" },
      { name: "Lifecycle Policies", description: "Automatically transition objects from Standard to Glacier for cost optimization" },
    ],
    realWorldExamples: [
      "Dropbox stores over 500 PB of user files on a custom object storage system (Magic Pocket)",
      "Netflix stores all video masters and encoded variants on Amazon S3",
      "Airbnb uses S3 for all user-uploaded images with CloudFront CDN for delivery",
    ],
  },
  search: {
    componentId: "search",
    whenToUse: [
      "Full-text search across large document collections with relevance ranking",
      "Autocomplete, fuzzy matching, and typo-tolerant search experiences",
      "Log aggregation and analysis — searching terabytes of log data (ELK stack)",
      "Faceted search and filtering for e-commerce product catalogs",
    ],
    whenNotToUse: [
      "Simple exact-match lookups — use a database index or cache instead",
      "Primary data storage — search engines are secondary indexes, not source of truth",
      "Small datasets where SQL LIKE queries are fast enough",
    ],
    keyTradeoffs: [
      "Near-real-time: indexing has a delay (usually 1-2 seconds) before documents become searchable",
      "Denormalized data: search index duplicates data from primary DB, requiring sync pipelines",
      "Resource intensive: Elasticsearch clusters need significant RAM for inverted indexes and field data",
      "Relevance tuning is complex — BM25 scoring, boosting, synonyms require ongoing iteration",
    ],
    interviewTips: [
      "Explain inverted indexes and how they enable fast full-text search",
      "Discuss the data sync pipeline from primary DB to search index (CDC, event-driven updates)",
      "Mention Elasticsearch vs dedicated search (Algolia, Meilisearch) trade-offs for your use case",
    ],
    commonPatterns: [
      { name: "Inverted Index", description: "Map each term to a list of documents containing it — the core data structure of search engines" },
      { name: "CDC to Search", description: "Use change data capture to stream DB changes into the search index in near-real-time" },
      { name: "Search-as-a-Service", description: "Use managed search (Algolia, Elastic Cloud) to avoid operational overhead of clusters" },
    ],
    realWorldExamples: [
      "Wikipedia uses Elasticsearch (CirrusSearch) to power search across 60M+ articles in 300 languages",
      "Uber uses Elasticsearch for searching across drivers, riders, trips, and support tickets",
      "GitHub built a custom code search engine to search across 200M+ repositories, replacing an earlier Elasticsearch-based system",
    ],
  },
  "message-queue": {
    componentId: "message-queue",
    whenToUse: [
      "Decoupling producers from consumers for asynchronous processing",
      "Buffering traffic spikes — queue absorbs bursts while consumers process at their own pace",
      "Event-driven architectures where multiple services react to the same event",
      "Reliable delivery with at-least-once or exactly-once semantics for critical workflows",
    ],
    whenNotToUse: [
      "Synchronous request-response where the client needs an immediate result",
      "Simple direct service calls in a low-latency path where queueing adds unnecessary delay",
      "Tiny deployments where operational overhead of managing a broker is not justified",
    ],
    keyTradeoffs: [
      "At-least-once delivery means consumers MUST be idempotent to handle duplicate messages",
      "Ordering: Kafka guarantees per-partition ordering; SQS FIFO queues support up to 70,000 msg/sec with high-throughput mode",
      "Message retention: Kafka retains messages for replay; SQS deletes after processing — different use cases",
      "Complexity: adding a queue means eventual consistency, dead-letter queues, and monitoring for lag",
    ],
    interviewTips: [
      "Always mention idempotent consumers when discussing at-least-once delivery",
      "Distinguish Kafka (log-based, replay) from SQS/RabbitMQ (traditional queue, delete after consume)",
      "Discuss dead-letter queues for handling poison messages that repeatedly fail processing",
    ],
    commonPatterns: [
      { name: "Pub/Sub", description: "Publisher sends events to a topic; multiple subscribers each receive a copy independently" },
      { name: "Work Queue (Competing Consumers)", description: "Multiple consumers pull from the same queue — each message processed by exactly one consumer" },
      { name: "Event Sourcing", description: "Store all state changes as an immutable log of events — enables replay and audit trails" },
    ],
    realWorldExamples: [
      "LinkedIn built Apache Kafka to handle 7 trillion messages per day across its platform",
      "Uber uses Kafka for real-time trip events, matching, and surge pricing data pipelines",
      "Slack uses a job queue system to process billions of messages, notifications, and API webhooks",
    ],
  },
  "service-mesh": {
    componentId: "service-mesh",
    whenToUse: [
      "Large microservice deployments (50+ services) where manual networking config is unsustainable",
      "Mutual TLS (mTLS) for zero-trust service-to-service encryption",
      "Advanced traffic management: canary releases, traffic splitting, circuit breaking",
      "Distributed tracing and observability across service boundaries without code changes",
    ],
    whenNotToUse: [
      "Small number of services (< 10) where the operational overhead is not justified",
      "Monolithic architectures with no inter-service communication",
      "Latency-critical paths where sidecar proxy overhead (1-3ms) is unacceptable",
    ],
    keyTradeoffs: [
      "Sidecar proxy adds ~1-3ms latency to every inter-service call",
      "Significant operational complexity: control plane (Istiod), data plane (Envoy), CRDs",
      "Resource overhead: each pod runs an Envoy sidecar consuming CPU and memory",
      "Debugging becomes harder — issues can be in your code, the sidecar, or mesh configuration",
    ],
    interviewTips: [
      "Explain the sidecar pattern and why the mesh is transparent to application code",
      "Mention mTLS as the main security benefit — encrypts all internal traffic automatically",
      "Discuss when NOT to use a service mesh — shows you understand operational trade-offs",
    ],
    commonPatterns: [
      { name: "Sidecar Proxy", description: "Each service pod has an Envoy proxy sidecar that intercepts all inbound/outbound traffic" },
      { name: "Traffic Splitting", description: "Route a percentage of traffic to a canary version for safe progressive rollouts" },
      { name: "Circuit Breaking", description: "Envoy automatically stops sending traffic to a failing service to prevent cascade failures" },
    ],
    realWorldExamples: [
      "Lyft created Envoy proxy, now the data plane for most service meshes including Istio",
      "Google runs the largest Istio-based service mesh connecting services across its cloud",
      "Airbnb uses a service mesh for mTLS and observability across hundreds of microservices",
    ],
  },
  monitoring: {
    componentId: "monitoring",
    whenToUse: [
      "Every production system — monitoring is non-negotiable for reliability",
      "SLO/SLA tracking with automated alerting on latency, error rate, and throughput",
      "Distributed tracing to debug latency across multi-service request flows",
      "Capacity planning using historical metrics trends and anomaly detection",
    ],
    whenNotToUse: [
      "Local development and testing — use debuggers and test assertions instead",
      "Monitoring is never optional; the question is what level of investment is appropriate",
    ],
    keyTradeoffs: [
      "High cardinality metrics (per-user, per-endpoint) are powerful but expensive to store and query",
      "Sampling trade-off: 100% trace collection gives complete visibility but high storage cost; sampling misses rare issues",
      "Alert fatigue: too many alerts = ignored alerts. Tune thresholds carefully.",
      "Push vs pull metrics: Prometheus pulls (simple), Datadog agent pushes (works behind NAT)",
    ],
    interviewTips: [
      "Mention the three pillars of observability: metrics, logs, and traces",
      "Discuss the RED method (Rate, Errors, Duration) for services and USE method for infrastructure",
      "Show you think about alerting — what to alert on, escalation policies, and runbooks",
    ],
    commonPatterns: [
      { name: "RED Method", description: "Monitor Rate (throughput), Errors (failures), Duration (latency) for every service" },
      { name: "Distributed Tracing", description: "Propagate trace IDs across services to visualize the full request path and latency breakdown" },
      { name: "Log Aggregation", description: "Centralize logs from all services (ELK, Loki) for searchable, correlated debugging" },
    ],
    realWorldExamples: [
      "Google SRE invented the four golden signals (latency, traffic, errors, saturation) for monitoring",
      "Uber uses Jaeger (which they created) for distributed tracing across thousands of microservices",
      "Netflix uses Atlas for real-time metrics processing handling billions of data points per minute",
    ],
  },
  "websocket-server": {
    componentId: "websocket-server",
    whenToUse: [
      "Real-time bidirectional communication: chat, live notifications, collaborative editing",
      "Live data feeds: stock tickers, sports scores, gaming state updates",
      "Server-initiated pushes where polling would be wasteful and add latency",
      "Multiplayer gaming or real-time collaboration requiring sub-100ms updates",
    ],
    whenNotToUse: [
      "Request-response APIs where the client initiates all interactions — use REST/gRPC",
      "Infrequent updates (once per minute) — Server-Sent Events or long polling is simpler",
      "Mobile apps with unreliable connections — persistent connections drain battery and may be killed by the OS",
    ],
    keyTradeoffs: [
      "Stateful connections: each client is pinned to a server, complicating horizontal scaling",
      "Need a pub/sub layer (Redis) for broadcasting messages across multiple WebSocket server instances",
      "Connection limits: each server can handle ~50k-100k concurrent connections depending on resources",
      "Reconnection logic is complex — handle network switches, mobile sleep, and graceful degradation",
    ],
    interviewTips: [
      "Explain the scaling challenge: sticky connections need a pub/sub backplane (Redis Pub/Sub or Kafka)",
      "Mention connection-to-server mapping stored in Redis for targeted message delivery",
      "Discuss fallback strategies: WebSocket -> SSE -> long polling for maximum compatibility",
    ],
    commonPatterns: [
      { name: "Pub/Sub Backplane", description: "Redis Pub/Sub or Kafka sits behind WebSocket servers to broadcast messages across all instances" },
      { name: "Connection Registry", description: "Map user IDs to WebSocket server IPs in Redis for targeted message delivery" },
      { name: "Room/Channel Model", description: "Group connections into rooms/channels so messages broadcast only to relevant subscribers" },
    ],
    realWorldExamples: [
      "Slack uses WebSockets for real-time message delivery to millions of concurrent users",
      "Discord maintains millions of concurrent WebSocket connections with Elixir/Rust",
      "Figma uses WebSockets for real-time collaborative design with a custom CRDT-inspired multiplayer system",
    ],
  },
  "task-scheduler": {
    componentId: "task-scheduler",
    whenToUse: [
      "Delayed or scheduled jobs: send email in 30 minutes, generate daily report at midnight",
      "Recurring cron-like tasks: cleanup, data aggregation, health checks",
      "Long-running workflows with retry logic, timeouts, and dead-letter queues",
      "Background processing that should not block the request-response path",
    ],
    whenNotToUse: [
      "Real-time event processing — use a stream processor or message queue instead",
      "Simple one-off background tasks that can be handled by a message queue consumer",
      "High-throughput event-driven workloads — schedulers are for low-to-medium QPS",
    ],
    keyTradeoffs: [
      "At-least-once execution: tasks may run more than once on failure — make handlers idempotent",
      "Single-leader risk: if the scheduler instance dies, tasks stop. Use distributed schedulers.",
      "Clock skew in distributed systems can cause tasks to fire at unexpected times",
      "Monitoring is critical: silent failures in background tasks go unnoticed without proper alerting",
    ],
    interviewTips: [
      "Mention idempotency for task handlers — it shows you understand distributed system failure modes",
      "Discuss dead-letter queues for tasks that repeatedly fail after retries",
      "Bring up Temporal or AWS Step Functions for complex multi-step workflows with durable state",
    ],
    commonPatterns: [
      { name: "Delayed Queue", description: "Message becomes visible after a delay — SQS delay queues or Redis ZADD with timestamp scoring" },
      { name: "Leader Election", description: "Only one scheduler instance runs tasks to prevent duplicate execution — use distributed locks" },
      { name: "Workflow Orchestration", description: "Multi-step task chains with compensation logic — Temporal, Cadence, or Step Functions" },
    ],
    realWorldExamples: [
      "Airbnb uses Apache Airflow to orchestrate thousands of data pipeline DAGs daily",
      "Uber built Cadence (Temporal is a separate fork by its original creators) for durable, long-running workflow orchestration",
      "Stripe uses custom task scheduling for delayed payment retries and webhook delivery",
    ],
  },
  "stream-processor": {
    componentId: "stream-processor",
    whenToUse: [
      "Real-time analytics: dashboards, metrics aggregation, anomaly detection on live data",
      "Event-driven transformations: enrich, filter, and route events as they arrive",
      "Windowed aggregations: count events per minute, compute moving averages, sessionization",
      "ETL pipelines from operational databases to data warehouses with low latency",
    ],
    whenNotToUse: [
      "Batch processing on historical data that runs once daily — use Spark batch or data warehouse",
      "Simple message routing without transformation — a message queue alone suffices",
      "Low-volume event processing where the operational complexity of a stream framework is overkill",
    ],
    keyTradeoffs: [
      "Exactly-once semantics require checkpointing and idempotent sinks — adds complexity and overhead",
      "Late-arriving data: watermarks and allowed lateness must be configured to handle out-of-order events",
      "State management: stateful stream processing (aggregations, joins) requires fault-tolerant state stores",
      "Operational complexity: Flink/Kafka Streams require expertise to tune parallelism, checkpointing, and backpressure",
    ],
    interviewTips: [
      "Explain windowing concepts: tumbling, sliding, session windows and when to use each",
      "Discuss exactly-once vs at-least-once processing semantics and their performance impact",
      "Mention watermarks for handling late-arriving data — shows deep stream processing knowledge",
    ],
    commonPatterns: [
      { name: "Windowed Aggregation", description: "Group events into time windows (1 min, 5 min) and compute aggregates like counts and averages" },
      { name: "Stream-Table Join", description: "Enrich streaming events with data from a slowly-changing reference table" },
      { name: "CDC Streaming", description: "Capture database changes as a stream for real-time replication and downstream processing" },
    ],
    realWorldExamples: [
      "LinkedIn uses Apache Flink for real-time AI feature computation across millions of members",
      "Netflix processes billions of events per day through Flink for real-time recommendations and monitoring",
      "Uber uses Flink for real-time surge pricing and dynamic ETA calculations",
    ],
  },
  "notification-service": {
    componentId: "notification-service",
    whenToUse: [
      "Multi-channel delivery: push notifications, email, SMS, and in-app messages from a single service",
      "Template management and rendering for consistent messaging across channels",
      "Priority queuing: urgent alerts (security) get delivered before marketing messages",
      "Delivery tracking and analytics — open rates, click rates, bounce handling",
    ],
    whenNotToUse: [
      "Single-channel simple email sending — use SES or SendGrid directly",
      "Real-time chat messaging — use WebSockets instead",
      "System-to-system event communication — use a message queue, not notifications",
    ],
    keyTradeoffs: [
      "Delivery guarantees vary by channel: push can be silent-dropped, email has spam filters, SMS has carrier limits",
      "Rate limiting per user to prevent notification fatigue — too many notifications lead to opt-outs",
      "Template versioning and localization add significant complexity at scale",
      "Cost: SMS is expensive ($0.01-0.05/msg), push is nearly free, email is in between",
    ],
    interviewTips: [
      "Design with a priority queue — separate urgent (2FA codes) from batch (marketing) notifications",
      "Mention idempotency keys to prevent sending duplicate notifications on retries",
      "Discuss user preferences and opt-out management — GDPR/CAN-SPAM compliance matters",
    ],
    commonPatterns: [
      { name: "Fan-out per Channel", description: "Single notification event fans out to push, email, SMS handlers based on user preferences" },
      { name: "Priority Queues", description: "Separate queues for critical (2FA), transactional (order confirmation), and marketing notifications" },
      { name: "Batch + Digest", description: "Aggregate multiple low-priority notifications into a single daily/weekly digest email" },
    ],
    realWorldExamples: [
      "Uber sends millions of trip notifications daily across push, SMS, and email channels",
      "Facebook sends billions of push notifications per day through a custom notification pipeline",
      "Twilio powers SMS and voice notifications for thousands of companies including Airbnb and Stripe",
    ],
  },
  "graph-db": {
    componentId: "graph-db",
    whenToUse: [
      "Highly connected data with complex relationship traversals (social networks, knowledge graphs)",
      "Friend-of-friend, shortest path, or recommendation queries that need multi-hop traversals",
      "Fraud detection: finding suspicious patterns in transaction or identity graphs",
      "Knowledge graphs and ontology management for AI/ML feature stores",
    ],
    whenNotToUse: [
      "Simple CRUD with no complex relationships — SQL or NoSQL is simpler and faster",
      "Aggregation-heavy analytics on tabular data — use a data warehouse",
      "High-write-throughput workloads — graph databases typically optimize for read traversals",
    ],
    keyTradeoffs: [
      "Graph traversals are fast, but global graph analytics (PageRank) can be slow on OLTP graph databases",
      "Data modeling requires thinking in nodes and edges — different from relational modeling",
      "Horizontal scaling is harder than NoSQL: graph partitioning can cause expensive cross-partition traversals",
      "Smaller ecosystem and tooling compared to SQL and NoSQL databases",
    ],
    interviewTips: [
      "Use graph DB when the problem naturally involves relationships — social, fraud, recommendations",
      "Compare multi-hop graph traversals vs SQL JOINs — graph DBs are orders of magnitude faster for 3+ hops",
      "Mention Neo4j Cypher or Apache TinkerPop Gremlin as query languages depending on the graph DB",
    ],
    commonPatterns: [
      { name: "Adjacency Traversal", description: "Walk the graph from a starting node to find connected entities within N hops" },
      { name: "Collaborative Filtering", description: "Find similar users by traversing shared edges (likes, purchases) for recommendations" },
      { name: "Subgraph Pattern Matching", description: "Find specific patterns in the graph (e.g., circular money transfers for fraud detection)" },
    ],
    realWorldExamples: [
      "LinkedIn uses a graph database for their connection graph powering 'People You May Know'",
      "Amazon Neptune powers knowledge graphs and fraud detection for AWS customers",
      "Airbnb uses a graph to model relationships between users, listings, and trust signals",
    ],
  },
  "timeseries-db": {
    componentId: "timeseries-db",
    whenToUse: [
      "Metrics and monitoring data: server CPU, memory, request latency over time",
      "IoT sensor data: temperature, pressure, GPS readings arriving at high frequency",
      "Financial tick data: stock prices, trade volumes with timestamps",
      "Automated downsampling and retention policies for managing storage growth",
    ],
    whenNotToUse: [
      "General-purpose application data with complex relationships — use SQL or NoSQL",
      "Data that does not have a natural time dimension",
      "Workloads requiring complex transactions or JOINs across entity types",
    ],
    keyTradeoffs: [
      "Optimized for append-heavy writes but updates/deletes are expensive or unsupported",
      "Query patterns are time-range-centric — random access by non-time keys is slow",
      "Downsampling reduces storage cost but loses granularity — configure retention tiers carefully",
      "Cardinality explosion: high-cardinality tags (per-user metrics) can degrade performance significantly",
    ],
    interviewTips: [
      "Explain why time-series DBs outperform SQL for metrics: columnar compression, time partitioning, automatic rollups",
      "Mention downsampling strategy: keep 1-second resolution for 24h, 1-minute for 30 days, 1-hour for 1 year",
      "Discuss the cardinality problem and why unbounded tag values are dangerous",
    ],
    commonPatterns: [
      { name: "Downsampling Tiers", description: "Automatically reduce data resolution over time — raw for recent, aggregated for historical" },
      { name: "Continuous Aggregation", description: "Pre-compute common queries (5-min avg, hourly max) as data arrives for fast dashboard queries" },
      { name: "Retention Policies", description: "Auto-delete data older than a threshold to manage storage costs" },
    ],
    realWorldExamples: [
      "Prometheus TSDB powers monitoring at most Kubernetes-based organizations",
      "Uber uses M3DB (their custom time-series DB) for billions of metrics per second",
      "Cloudflare uses a time-series database for network edge telemetry across 300+ data centers",
    ],
  },
  "data-warehouse": {
    componentId: "data-warehouse",
    whenToUse: [
      "Analytical queries across terabytes/petabytes of historical data (OLAP workloads)",
      "Business intelligence dashboards, reporting, and ad-hoc SQL analytics",
      "Separating analytics workload from production OLTP databases to prevent impact",
      "Data lake querying with schema-on-read for semi-structured data (Parquet, JSON)",
    ],
    whenNotToUse: [
      "Real-time transactional processing (OLTP) — warehouses have seconds-to-minutes query latency",
      "Low-latency serving for user-facing features — use a cache or operational database",
      "Small datasets under 10 GB where PostgreSQL analytics are fast enough",
    ],
    keyTradeoffs: [
      "Columnar storage = fast aggregations but slow for point lookups and row-level operations",
      "Compute-storage separation (BigQuery, Snowflake) allows independent scaling but incurs network overhead",
      "Cost model: pay-per-query (BigQuery) vs always-on cluster (Redshift) — choose based on query patterns",
      "Data freshness: batch ETL has hours of delay; streaming ingestion adds pipeline complexity",
    ],
    interviewTips: [
      "Explain OLAP vs OLTP and why a separate warehouse protects production databases",
      "Mention columnar storage and why it is efficient for aggregation queries (compression, vectorized execution)",
      "Discuss the modern data stack: ETL/ELT tools (dbt, Fivetran) loading into Snowflake/BigQuery",
    ],
    commonPatterns: [
      { name: "Star Schema", description: "Central fact table surrounded by dimension tables — optimized for analytical joins" },
      { name: "ELT Pipeline", description: "Load raw data into warehouse first, then transform with SQL (dbt) — modern approach" },
      { name: "Materialized Views", description: "Pre-computed query results refreshed periodically for faster dashboard loading" },
    ],
    realWorldExamples: [
      "Spotify uses Google BigQuery for analytics across billions of daily streaming events",
      "Airbnb uses a data warehouse with Apache Hive and Spark for all business analytics",
      "Netflix uses Redshift and custom tools to analyze billions of streaming events for content recommendations",
    ],
  },
  "service-discovery": {
    componentId: "service-discovery",
    whenToUse: [
      "Microservices that need to find each other dynamically without hardcoded IPs",
      "Auto-scaling environments where instances come and go frequently",
      "Multi-region deployments requiring region-aware service resolution",
      "Health-checked service registration with automatic deregistration of failed instances",
    ],
    whenNotToUse: [
      "Monolithic applications with a single deployment target",
      "Simple setups behind a load balancer where DNS/LB already provides indirection",
      "Serverless architectures where the platform handles service routing (e.g., API Gateway + Lambda)",
    ],
    keyTradeoffs: [
      "Client-side discovery (Consul, eureka) gives more control but embeds logic in every service",
      "Server-side discovery (AWS ALB, K8s Services) is simpler but less flexible for routing",
      "Consistency: stale service registry entries cause requests to dead instances",
      "CP vs AP: Consul (CP) may reject reads during partition; Eureka (AP) may return stale data",
    ],
    interviewTips: [
      "Distinguish client-side vs server-side discovery and explain when you would pick each",
      "Mention Kubernetes Services as built-in server-side discovery — kube-dns resolves service names",
      "Discuss health checks and how fast unhealthy instances are removed from the registry",
    ],
    commonPatterns: [
      { name: "Client-side Discovery", description: "Clients query a registry (Consul, eureka) and load-balance across returned instances" },
      { name: "Server-side Discovery", description: "Clients hit a load balancer; the LB queries the registry and routes to healthy instances" },
      { name: "DNS-based Discovery", description: "Services register DNS records; consumers resolve service names to IPs via DNS" },
    ],
    realWorldExamples: [
      "Netflix built Eureka for client-side service discovery across hundreds of microservices",
      "HashiCorp Consul is used by thousands of companies for service discovery and configuration",
      "Kubernetes kube-dns/CoreDNS provides built-in service discovery for all K8s workloads",
    ],
  },
  "reverse-proxy": {
    componentId: "reverse-proxy",
    whenToUse: [
      "SSL/TLS termination to offload encryption from backend servers",
      "Request routing, URL rewriting, and path-based routing to different backends",
      "Response caching and compression to reduce origin load and bandwidth",
      "Security filtering: block malicious requests, add security headers, hide backend topology",
    ],
    whenNotToUse: [
      "When a managed load balancer already handles SSL termination and routing",
      "Internal service-to-service communication in a service mesh (Envoy sidecars handle this)",
      "Simple single-backend deployments where the added layer provides no benefit",
    ],
    keyTradeoffs: [
      "Single point of failure if not deployed redundantly — always run in HA pairs",
      "Added latency from the extra network hop (usually <1ms for Nginx/Envoy)",
      "Configuration complexity: Nginx/Envoy configs can become large and hard to manage",
      "Feature overlap with load balancers and API gateways — avoid duplicating functionality",
    ],
    interviewTips: [
      "Explain the difference between reverse proxy, load balancer, and API gateway — they overlap but serve different primary purposes",
      "Mention Nginx as the default choice for reverse proxy in most architectures",
      "Discuss TLS termination and why it reduces backend CPU usage significantly",
    ],
    commonPatterns: [
      { name: "TLS Termination", description: "Decrypt HTTPS at the proxy layer and forward plain HTTP to backends — reduces backend CPU" },
      { name: "Path-based Routing", description: "Route /api to app servers, /static to CDN origin, /ws to WebSocket servers" },
      { name: "Response Caching", description: "Cache responses at the proxy for repeated requests — reduces origin load" },
    ],
    realWorldExamples: [
      "Nginx serves as a reverse proxy for over 30% of all websites on the internet",
      "Cloudflare acts as a reverse proxy for millions of websites providing DDoS protection and caching",
      "Envoy Proxy (created by Lyft) is the standard reverse proxy in cloud-native architectures",
    ],
  },
  "distributed-lock": {
    componentId: "distributed-lock",
    whenToUse: [
      "Preventing race conditions in distributed systems (double-spending, overselling inventory)",
      "Leader election: ensuring only one instance runs a singleton task (scheduler, cron)",
      "Coordinating distributed transactions across multiple services",
      "Exclusive access to a shared resource (file, external API with strict rate limits)",
    ],
    whenNotToUse: [
      "Single-server applications where in-process mutexes/semaphores are sufficient",
      "High-throughput hot paths where lock contention would create a bottleneck",
      "Scenarios where optimistic concurrency control (version checks) is simpler and sufficient",
    ],
    keyTradeoffs: [
      "Safety vs liveness: Redlock debates — can a Redis-based lock guarantee mutual exclusion during network partitions?",
      "Lock expiry: too short = premature release during GC pauses; too long = blocking on holder crash",
      "Performance: acquiring a distributed lock adds network round-trips (5-15ms with Redis)",
      "Fencing tokens: without them, an expired lock holder can still write — causing data corruption",
    ],
    interviewTips: [
      "Mention fencing tokens as a guard against expired locks — shows you understand the subtle failure modes",
      "Discuss the Redlock controversy (Martin Kleppmann vs Salvatore Sanfilippo) for bonus depth",
      "Explain ZooKeeper ephemeral nodes as an alternative that auto-releases locks on session disconnect",
    ],
    commonPatterns: [
      { name: "Redis SET NX + TTL", description: "Acquire lock with SET key value NX EX ttl — simple and widely used for short-duration locks" },
      { name: "ZooKeeper Ephemeral Nodes", description: "Create ephemeral sequential nodes — lock holder has the lowest sequence number, auto-releases on disconnect" },
      { name: "Fencing Token", description: "Each lock acquisition returns a monotonically increasing token; storage rejects writes with stale tokens" },
    ],
    realWorldExamples: [
      "Amazon uses distributed locks for inventory management to prevent overselling during flash sales",
      "Google uses Chubby (their distributed lock service) for leader election and GFS master coordination",
      "Stripe uses Redis-based locks to prevent double-charging during payment processing retries",
    ],
  },
  "id-generator": {
    componentId: "id-generator",
    whenToUse: [
      "Any distributed system needing globally unique identifiers without coordination",
      "Database primary keys that must be sortable by creation time (Snowflake, ULID)",
      "URL shorteners, tweet IDs, order IDs, trace IDs in distributed tracing",
      "Sharding keys where sequential IDs cause hot partitions",
    ],
    whenNotToUse: [
      "Single-database systems where auto-increment is sufficient",
      "When IDs don't need to be globally unique (session-local counters)",
    ],
    keyTradeoffs: [
      "Snowflake IDs are sortable but leak creation time; UUIDs are random but unsortable",
      "Centralized ID services are simple but become SPOFs; embedded generators are resilient but need clock sync",
      "64-bit Snowflake IDs are compact but overflow in ~69 years; 128-bit UUIDs never overflow but use more storage",
      "Sequential IDs reveal volume/growth; random IDs prevent enumeration but fragment B-tree indexes",
    ],
    interviewTips: [
      "Always mention Snowflake IDs by name — interviewers expect it for any ID generation discussion",
      "Explain the bit layout: timestamp (41 bits) + machine ID (10 bits) + sequence (12 bits)",
      "Discuss clock skew mitigation — NTP sync, logical clocks, or waiting for clock catch-up",
    ],
    commonPatterns: [
      { name: "Twitter Snowflake", description: "64-bit IDs: 41-bit timestamp + 10-bit worker + 12-bit sequence; 4096 IDs/ms per worker" },
      { name: "ULID", description: "128-bit: 48-bit timestamp + 80-bit random; lexicographically sortable, URL-safe" },
      { name: "Database Ticket Server", description: "Central DB with auto-increment (Flickr pattern); simple but SPOF without replication" },
    ],
    realWorldExamples: [
      "Twitter created Snowflake to generate ~10K unique IDs per second per process for tweet IDs",
      "Instagram uses a PostgreSQL-based ID generator with epoch + shard ID + sequence",
      "Discord uses Snowflake IDs for messages, enabling time-based sorting and sharding",
    ],
  },
  "sharded-counter": {
    componentId: "sharded-counter",
    whenToUse: [
      "High-write counters: like counts, view counts, follower counts at millions of writes/sec",
      "Any counter where a single key would become a hot partition under concurrent writes",
      "Real-time vote tallying, poll results, trending scores",
      "Inventory count decrements during flash sales",
    ],
    whenNotToUse: [
      "Low-volume counters where a single atomic increment is sufficient",
      "When exact real-time accuracy is required (sharded reads are eventually consistent)",
    ],
    keyTradeoffs: [
      "More shards = higher write throughput but slower reads (must aggregate across all shards)",
      "Trade-off between read latency and write scalability — tune shard count per counter",
      "Background reconciliation adds complexity but enables approximate real-time reads",
      "Negative counts possible during race conditions — need floor checks or two-phase counting",
    ],
    interviewTips: [
      "Mention this pattern whenever designing social media (likes, views, shares) at scale",
      "Explain the read path: SUM across N shards, optionally cached for fast approximate reads",
      "Discuss how YouTube counts views: sharded writes + periodic batch aggregation",
    ],
    commonPatterns: [
      { name: "Redis Sharded Counter", description: "N Redis keys per logical counter; INCR random shard on write, MGET all shards on read" },
      { name: "Database Counter Table", description: "N rows per counter; random row on write, SUM on read with caching" },
      { name: "Approximate Counter", description: "Probabilistic counting (HyperLogLog) for unique counts; Count-Min Sketch for frequency" },
    ],
    realWorldExamples: [
      "YouTube uses sharded counters for video view counts, aggregating periodically for display",
      "Instagram shards like counts across multiple Redis keys to handle viral post spikes",
      "Twitter uses distributed counters for tweet impression and engagement metrics",
    ],
  },
  "pub-sub": {
    componentId: "pub-sub",
    whenToUse: [
      "Event-driven fan-out: one event triggers multiple independent consumers (analytics, notifications, cache invalidation)",
      "Decoupling services that don't need to know about each other",
      "Change Data Capture (CDC) — broadcasting database changes to downstream systems",
      "Real-time feed updates, live dashboards, IoT event distribution",
    ],
    whenNotToUse: [
      "Point-to-point task distribution (use a message queue with competing consumers instead)",
      "When message ordering across topics is critical (pub/sub topics are independently ordered)",
    ],
    keyTradeoffs: [
      "Fan-out amplifies traffic: 1 publish to N subscribers = N message deliveries",
      "At-least-once delivery is standard; exactly-once requires idempotent subscribers",
      "Topic-based routing is simple but inflexible; content-based routing adds complexity",
      "Push (server pushes to subscribers) vs pull (subscribers poll) affects latency and resource usage",
    ],
    interviewTips: [
      "Clearly distinguish pub/sub (fan-out, all subscribers get every message) from queues (competing consumers, each message processed once)",
      "Mention it whenever you have multiple downstream systems reacting to the same event",
      "Discuss dead letter topics for failed message processing",
    ],
    commonPatterns: [
      { name: "Topic Fan-out", description: "Publish to a topic; all subscriptions receive a copy. AWS SNS -> multiple SQS queues" },
      { name: "Event Bus", description: "Central pub/sub for all domain events; subscribers filter by event type" },
      { name: "CDC Stream", description: "Database changes published as events; consumers build materialized views" },
    ],
    realWorldExamples: [
      "Google Cloud Pub/Sub handles trillions of messages per month across Google's infrastructure",
      "Netflix uses Apache Kafka topics for real-time event streaming across 1000+ microservices",
      "Slack uses a pub/sub system to fan out messages to all connected clients in a channel",
    ],
  },
  "vector-db": {
    componentId: "vector-db",
    whenToUse: [
      "Semantic/similarity search: find items similar to a query by meaning, not keywords",
      "Recommendation engines: suggest content based on embedding similarity",
      "RAG (Retrieval Augmented Generation) for LLM applications",
      "Image search, audio fingerprinting, fraud detection via behavioral similarity",
    ],
    whenNotToUse: [
      "Exact-match lookups (use a key-value store or traditional index instead)",
      "Small datasets where brute-force search is fast enough",
      "When you need ACID transactions or complex relational queries",
    ],
    keyTradeoffs: [
      "ANN (approximate) search is fast but not exact — recall vs latency trade-off",
      "HNSW indexing gives low latency but uses significant memory; IVF uses less memory but higher latency",
      "Embedding dimension affects storage and query cost: 768-dim vs 1536-dim is 2x difference",
      "Index build time can be hours for large datasets; incremental updates are challenging",
    ],
    interviewTips: [
      "Mention vector databases when designing recommendation or search systems — it shows awareness of modern ML infrastructure",
      "Explain the pipeline: raw data -> embedding model -> vector DB -> ANN query -> ranked results",
      "Discuss hybrid search: combine vector similarity with keyword filters for better relevance",
    ],
    commonPatterns: [
      { name: "Embedding + ANN", description: "Convert items to vectors via ML model; index in vector DB; query with cosine/dot-product similarity" },
      { name: "Hybrid Search", description: "Combine dense vector similarity with sparse keyword matching (BM25) for best relevance" },
      { name: "RAG Pipeline", description: "Chunk documents -> embed -> store in vector DB -> retrieve context for LLM prompt" },
    ],
    realWorldExamples: [
      "Spotify uses embeddings for podcast and music recommendations via approximate nearest-neighbor search",
      "Pinterest uses vector search for visual similarity in their 'More like this' feature",
      "OpenAI's ChatGPT uses vector databases for retrieval-augmented generation in enterprise deployments",
    ],
  },
  "geospatial-index": {
    componentId: "geospatial-index",
    whenToUse: [
      "Proximity search: find nearby drivers, restaurants, businesses within a radius",
      "Geo-fenced operations: determine which zone/region a point belongs to",
      "Route optimization and ETA estimation with location data",
      "Real-time location tracking with spatial queries",
    ],
    whenNotToUse: [
      "Non-geographic data that happens to have coordinates (use a regular index)",
      "When exact geometric calculations aren't needed (approximate distance formulas suffice)",
    ],
    keyTradeoffs: [
      "Geohash is simple and works with any sorted index but has edge-case issues at cell boundaries",
      "Quadtree adapts to data density but requires custom implementation",
      "H3 (Uber's hex grid) provides uniform area cells but adds a library dependency",
      "PostGIS is powerful but ties you to PostgreSQL; Redis GEO is simpler but less feature-rich",
    ],
    interviewTips: [
      "Always mention geohash or quadtree when designing Uber, Yelp, or any location-based system",
      "Explain the precision trade-off: shorter geohash = larger cell = faster but less precise",
      "Discuss how to handle boundary issues: query neighboring cells to avoid missing nearby results",
    ],
    commonPatterns: [
      { name: "Geohash Grid", description: "Encode lat/lng into a string prefix; nearby points share prefixes; query by prefix range" },
      { name: "Quadtree", description: "Recursively subdivide space into 4 quadrants; leaf nodes contain points; adapts to data density" },
      { name: "H3 Hexagonal Grid", description: "Uber's hierarchical hex grid; uniform-area cells; 16 resolution levels from continent to sub-meter" },
    ],
    realWorldExamples: [
      "Uber uses H3 hexagonal indexing for surge pricing zones and driver-rider matching",
      "Yelp uses Elasticsearch geo_point queries for 'restaurants near me' with distance sorting",
      "DoorDash uses geospatial indexing to match orders with nearby delivery drivers in real time",
    ],
  },
  "config-service": {
    componentId: "config-service",
    whenToUse: [
      "Feature flags: toggle features on/off without redeployment",
      "A/B testing: route percentages of traffic to different code paths",
      "Gradual rollouts: canary new features to 1% -> 10% -> 50% -> 100% of users",
      "Runtime tuning: adjust rate limits, cache TTLs, algorithm parameters without restarts",
    ],
    whenNotToUse: [
      "Static configuration that changes only at deploy time (use environment variables)",
      "Secrets management (use a dedicated vault like HashiCorp Vault or AWS Secrets Manager)",
    ],
    keyTradeoffs: [
      "Push (server pushes config changes) vs pull (clients poll periodically) — push is faster but needs persistent connections",
      "Strong consistency (all nodes see same config) vs eventual consistency (faster propagation)",
      "Centralized config service is a potential SPOF — need local caching with fallback",
      "Feature flag complexity grows quickly — need cleanup processes for stale flags",
    ],
    interviewTips: [
      "Mention feature flags when discussing deployment strategies — shows operational maturity",
      "Explain how gradual rollouts reduce blast radius of bugs",
      "Discuss config propagation latency — stale config can cause inconsistent behavior across nodes",
    ],
    commonPatterns: [
      { name: "Feature Flag", description: "Boolean or multivariate flag checked at runtime; enables trunk-based development and dark launches" },
      { name: "Percentage Rollout", description: "Hash user ID to determine if they're in the rollout percentage; deterministic per user" },
      { name: "Config Hierarchy", description: "Default -> environment -> service -> instance overrides; most specific wins" },
    ],
    realWorldExamples: [
      "Netflix uses their internal config service to manage thousands of feature flags across 1000+ microservices",
      "Facebook evaluates millions of feature flag checks per second using their Gatekeeper system",
      "LaunchDarkly processes 30+ trillion feature flag evaluations per month for enterprise customers",
    ],
  },
};

export function getConceptByComponentId(componentId: string): ComponentConcept | undefined {
  return CONCEPT_LIBRARY[componentId];
}
