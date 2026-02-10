export interface LearningTier {
  name: string;
  description: string;
  problemIds: string[];
}

export const LEARNING_PATH: LearningTier[] = [
  {
    name: "Foundations",
    description: "Master the basic building blocks",
    problemIds: ["url-shortener", "rate-limiter", "parking-lot"],
  },
  {
    name: "Intermediate",
    description: "Combine multiple systems",
    problemIds: [
      "notification-system",
      "typeahead-autocomplete",
      "distributed-cache",
      "instagram",
      "music-streaming",
    ],
  },
  {
    name: "Advanced",
    description: "Complex distributed systems",
    problemIds: [
      "twitter-feed",
      "chat-system",
      "web-crawler",
      "file-storage",
      "ecommerce",
    ],
  },
  {
    name: "Expert",
    description: "Multi-concern architectures",
    problemIds: [
      "ride-sharing",
      "video-streaming",
      "payment-system",
      "ticket-booking",
      "collaborative-editor",
      "team-messaging",
      "metrics-monitoring",
    ],
  },
];

export interface ConceptPrerequisite {
  problemId: string;
  concepts: string[];
  prerequisites: string[];
}

export const PROBLEM_CONCEPTS: ConceptPrerequisite[] = [
  {
    problemId: "url-shortener",
    concepts: ["caching", "hashing", "read-heavy-design"],
    prerequisites: [],
  },
  {
    problemId: "rate-limiter",
    concepts: ["rate-limiting", "sliding-window", "token-bucket"],
    prerequisites: [],
  },
  {
    problemId: "parking-lot",
    concepts: ["object-modeling", "state-management", "concurrency"],
    prerequisites: [],
  },
  {
    problemId: "notification-system",
    concepts: ["async-processing", "message-queue", "priority-queue"],
    prerequisites: ["rate-limiting"],
  },
  {
    problemId: "typeahead-autocomplete",
    concepts: ["trie", "prefix-search", "ranking"],
    prerequisites: ["caching", "read-heavy-design"],
  },
  {
    problemId: "distributed-cache",
    concepts: ["consistent-hashing", "cache-eviction", "replication"],
    prerequisites: ["caching", "hashing"],
  },
  {
    problemId: "instagram",
    concepts: ["media-storage", "feed-generation", "cdn"],
    prerequisites: ["caching", "async-processing"],
  },
  {
    problemId: "music-streaming",
    concepts: ["streaming-protocol", "content-delivery", "recommendation"],
    prerequisites: ["caching", "cdn"],
  },
  {
    problemId: "twitter-feed",
    concepts: ["fan-out", "timeline", "hybrid-approach"],
    prerequisites: ["caching", "async-processing", "feed-generation"],
  },
  {
    problemId: "chat-system",
    concepts: ["websocket", "presence", "message-ordering"],
    prerequisites: ["async-processing", "message-queue"],
  },
  {
    problemId: "web-crawler",
    concepts: ["crawling", "url-frontier", "politeness"],
    prerequisites: ["hashing", "async-processing", "rate-limiting"],
  },
  {
    problemId: "file-storage",
    concepts: ["chunking", "deduplication", "metadata-db"],
    prerequisites: ["consistent-hashing", "replication"],
  },
  {
    problemId: "ecommerce",
    concepts: ["inventory-management", "search-indexing", "payment-flow"],
    prerequisites: ["caching", "async-processing", "message-queue"],
  },
  {
    problemId: "ride-sharing",
    concepts: ["geospatial-indexing", "matching-algorithm", "real-time-tracking"],
    prerequisites: ["websocket", "async-processing", "consistent-hashing"],
  },
  {
    problemId: "video-streaming",
    concepts: ["adaptive-bitrate", "transcoding", "edge-caching"],
    prerequisites: ["cdn", "streaming-protocol", "async-processing"],
  },
  {
    problemId: "payment-system",
    concepts: ["idempotency", "saga-pattern", "ledger"],
    prerequisites: ["async-processing", "message-queue", "state-management"],
  },
  {
    problemId: "ticket-booking",
    concepts: ["distributed-locking", "seat-reservation", "optimistic-concurrency"],
    prerequisites: ["concurrency", "caching", "async-processing"],
  },
  {
    problemId: "collaborative-editor",
    concepts: ["crdt", "operational-transform", "conflict-resolution"],
    prerequisites: ["websocket", "message-ordering", "replication"],
  },
  {
    problemId: "team-messaging",
    concepts: ["channel-model", "search", "notification-routing"],
    prerequisites: ["websocket", "message-queue", "async-processing"],
  },
  {
    problemId: "metrics-monitoring",
    concepts: ["time-series-db", "aggregation-pipeline", "alerting"],
    prerequisites: ["streaming-protocol", "async-processing", "message-queue"],
  },
];
