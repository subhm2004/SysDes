export interface RequirementItem {
  id: string;
  text: string;
  category: 'functional' | 'non-functional';
  importance: 'critical' | 'important' | 'nice-to-have';
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  category: 'failure' | 'scale' | 'consistency' | 'security' | 'optimization';
  hint: string;
  answer: string;
}

export interface ReferenceAPI {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  response?: string;
}

export interface DataModelEntity {
  name: string;
  type: 'sql' | 'nosql' | 'cache' | 'search';
  fields: { name: string; type: string; note?: string }[];
  indexes?: string[];
  partitionKey?: string;
}

export interface ProblemInterviewData {
  problemId: string;
  requirements: RequirementItem[];
  followUpQuestions: FollowUpQuestion[];
  referenceAPIs: ReferenceAPI[];
  dataModel: DataModelEntity[];
  estimationHints: {
    dailyActiveUsers: string;
    readWriteRatio: string;
    storagePerItem: string;
    peakMultiplier: string;
  };
}

export const INTERVIEW_DATA: ProblemInterviewData[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. URL SHORTENER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "url-shortener",
    requirements: [
      { id: "r1", text: "Create short URL from long URL", category: "functional", importance: "critical" },
      { id: "r2", text: "Redirect short URL to original URL", category: "functional", importance: "critical" },
      { id: "r3", text: "Custom alias support (user-chosen slugs)", category: "functional", importance: "nice-to-have" },
      { id: "r4", text: "URL expiration with configurable TTL", category: "functional", importance: "important" },
      { id: "r5", text: "Click analytics (count, geo, referrer, device)", category: "functional", importance: "nice-to-have" },
      { id: "r6", text: "100:1 read-to-write ratio", category: "non-functional", importance: "critical" },
      { id: "r7", text: "< 100ms redirect latency at p99", category: "non-functional", importance: "critical" },
      { id: "r8", text: "99.99% availability (52 min downtime/year)", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Short URLs should be 7-8 characters (base62)", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "What happens if your cache goes down?", category: "failure", hint: "Think about cache-aside pattern", answer: "With cache-aside, requests fall through to the database. Latency increases but the system remains functional. We can use Redis Cluster with replicas for cache HA." },
      { id: "q2", question: "How do you handle hash collisions when generating short URLs?", category: "consistency", hint: "Consider pre-generated keys or collision detection", answer: "Use a Key Generation Service (KGS) that pre-generates unique keys and stores them in a 'unused keys' table. On URL creation, atomically move a key from unused to used, eliminating collisions entirely." },
      { id: "q3", question: "How would you scale to 10x the current traffic?", category: "scale", hint: "Think about database sharding and cache layers", answer: "Add more cache replicas (Redis Cluster), shard the database by short URL hash across multiple nodes, and use a CDN for 301 redirects on popular URLs to bypass the app layer entirely." },
      { id: "q4", question: "How do you prevent abuse (spam URLs, phishing)?", category: "security", hint: "Rate limiting + URL scanning", answer: "Apply per-API-key rate limits (e.g., 100 creates/min). Scan destination URLs against phishing/malware databases (Google Safe Browsing API) before creating the short URL. Flag suspicious patterns for manual review." },
      { id: "q5", question: "Should redirects be 301 or 302?", category: "optimization", hint: "Think about caching implications", answer: "Use 302 (temporary) if you need analytics on every click, since browsers won't cache it. Use 301 (permanent) if you want browsers and CDNs to cache the redirect, reducing server load but losing per-click analytics." },
      { id: "q6", question: "How do you handle expired URLs?", category: "consistency", hint: "Lazy deletion vs background cleanup", answer: "Use lazy deletion: check TTL on read and return 404 if expired. Run a background job to purge expired entries from the database periodically to reclaim storage and free up short codes for reuse." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/urls", description: "Create a new short URL", requestBody: "{ longUrl: string, customAlias?: string, expiresAt?: ISO8601 }", response: "{ shortUrl: string, shortCode: string, expiresAt: string }" },
      { method: "GET", path: "/{shortCode}", description: "Redirect to original URL (302/301)", response: "HTTP 302 redirect with Location header" },
      { method: "GET", path: "/api/v1/urls/{shortCode}", description: "Get URL metadata and analytics", response: "{ shortCode, longUrl, createdAt, expiresAt, clickCount }" },
      { method: "DELETE", path: "/api/v1/urls/{shortCode}", description: "Delete/deactivate a short URL", response: "{ success: boolean }" },
    ],
    dataModel: [
      {
        name: "urls",
        type: "nosql",
        fields: [
          { name: "short_code", type: "string", note: "Primary key, 7-char base62" },
          { name: "long_url", type: "string", note: "Original destination URL" },
          { name: "user_id", type: "string", note: "Creator's user ID" },
          { name: "created_at", type: "datetime" },
          { name: "expires_at", type: "datetime", note: "TTL for auto-expiration" },
          { name: "click_count", type: "int", note: "Atomic counter" },
        ],
        partitionKey: "short_code",
      },
      {
        name: "analytics_events",
        type: "nosql",
        fields: [
          { name: "short_code", type: "string" },
          { name: "timestamp", type: "datetime" },
          { name: "ip", type: "string" },
          { name: "country", type: "string" },
          { name: "referrer", type: "string" },
          { name: "user_agent", type: "string" },
        ],
        partitionKey: "short_code",
      },
      {
        name: "url_cache",
        type: "cache",
        fields: [
          { name: "short_code", type: "string", note: "Cache key" },
          { name: "long_url", type: "string", note: "Cached destination" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "100M DAU, each triggering ~1 redirect/day = 100M reads/day",
      readWriteRatio: "100:1 read/write ratio, ~1K writes/sec, ~100K reads/sec at peak (with caching)",
      storagePerItem: "~500 bytes per URL record; 1K new URLs/sec = 86M/day = ~43 GB/year",
      peakMultiplier: "3x average during business hours (US + EU overlap)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. TWITTER / NEWS FEED
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "twitter-feed",
    requirements: [
      { id: "r1", text: "Post tweets (text up to 280 chars, images, video)", category: "functional", importance: "critical" },
      { id: "r2", text: "View personalized home timeline", category: "functional", importance: "critical" },
      { id: "r3", text: "Follow/unfollow other users", category: "functional", importance: "critical" },
      { id: "r4", text: "Like, retweet, quote-tweet, and reply", category: "functional", importance: "important" },
      { id: "r5", text: "Full-text search across all public tweets", category: "functional", importance: "important" },
      { id: "r6", text: "Trending topics and hashtag aggregation", category: "functional", importance: "nice-to-have" },
      { id: "r7", text: "Timeline eventually consistent within 5 seconds", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Feed load latency < 200ms at p99", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Handle celebrity accounts with 50M+ followers", category: "non-functional", importance: "critical" },
      { id: "r10", text: "Graceful degradation: serve stale timelines during overload", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you handle fan-out for a user with 50 million followers?", category: "scale", hint: "Think hybrid: fan-out-on-write vs fan-out-on-read", answer: "Use a hybrid approach. For normal users (< 10K followers), fan-out-on-write: push the tweet to each follower's cached timeline. For celebrities, fan-out-on-read: merge their tweets into the timeline at read time. This prevents write amplification storms." },
      { id: "q2", question: "What happens if a timeline cache node goes down?", category: "failure", hint: "Consider cache rebuilding strategies", answer: "Each user's timeline cache has a replica. On primary failure, promote the replica. If both fail, rebuild the timeline from the database by querying tweets from followed users, sorted by time. Serve a stale CDN-cached version while rebuilding." },
      { id: "q3", question: "How do you rank tweets in the timeline?", category: "optimization", hint: "Think about ML ranking signals", answer: "Score each candidate tweet using signals: recency, engagement velocity (likes/retweets in first hour), relationship strength (interaction history with author), content-type preference, and explicit user feedback. A lightweight ML model scores and re-ranks the top 1000 candidates." },
      { id: "q4", question: "How do you prevent fake accounts from manipulating trending topics?", category: "security", hint: "Bot detection and weighted signals", answer: "Weight trending topic signals by account age, verification status, and behavioral patterns. Use velocity-based anomaly detection: if a hashtag spikes from accounts created within 24 hours, flag it. Apply CAPTCHA challenges on suspicious engagement patterns." },
      { id: "q5", question: "How would you implement real-time notifications for mentions?", category: "scale", hint: "Think about push vs pull", answer: "When a tweet is posted, a mentions extractor parses @handles and pushes notification events to a message queue. A notification service consumes these events and delivers them via WebSocket to online users or stores them for offline users." },
      { id: "q6", question: "How do you handle tweet deletion across all fan-out copies?", category: "consistency", hint: "Tombstones vs eventual cleanup", answer: "Mark the tweet as deleted in the primary store (soft delete). For fan-out-on-write timelines, either send a delete event through the same pipeline to remove from caches, or let it be filtered at read time. Eventual consistency is acceptable here." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/tweets", description: "Create a new tweet", requestBody: "{ text: string, mediaIds?: string[], replyToId?: string }", response: "{ tweetId, text, createdAt, author }" },
      { method: "GET", path: "/api/v1/timeline", description: "Get authenticated user's home timeline", response: "{ tweets: Tweet[], nextCursor: string }" },
      { method: "GET", path: "/api/v1/users/{userId}/tweets", description: "Get a user's profile tweets", response: "{ tweets: Tweet[], nextCursor: string }" },
      { method: "POST", path: "/api/v1/users/{userId}/follow", description: "Follow a user", response: "{ success: boolean }" },
      { method: "GET", path: "/api/v1/search?q={query}", description: "Search tweets", response: "{ tweets: Tweet[], nextCursor: string }" },
    ],
    dataModel: [
      {
        name: "tweets",
        type: "nosql",
        fields: [
          { name: "tweet_id", type: "snowflake_id", note: "Time-sortable unique ID" },
          { name: "user_id", type: "string" },
          { name: "text", type: "string", note: "Max 280 chars" },
          { name: "media_urls", type: "string[]" },
          { name: "reply_to_id", type: "string", note: "Null if top-level tweet" },
          { name: "retweet_of_id", type: "string" },
          { name: "like_count", type: "int" },
          { name: "retweet_count", type: "int" },
          { name: "created_at", type: "datetime" },
        ],
        partitionKey: "user_id",
        indexes: ["tweet_id", "created_at"],
      },
      {
        name: "user_timeline_cache",
        type: "cache",
        fields: [
          { name: "user_id", type: "string", note: "Cache key" },
          { name: "tweet_ids", type: "string[]", note: "Ordered list of tweet IDs, max 800" },
        ],
      },
      {
        name: "followers",
        type: "nosql",
        fields: [
          { name: "user_id", type: "string" },
          { name: "follower_id", type: "string" },
          { name: "followed_at", type: "datetime" },
        ],
        partitionKey: "user_id",
      },
      {
        name: "tweets_search",
        type: "search",
        fields: [
          { name: "tweet_id", type: "string" },
          { name: "text", type: "text", note: "Full-text indexed" },
          { name: "user_id", type: "keyword" },
          { name: "hashtags", type: "keyword[]" },
          { name: "created_at", type: "date" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "500M DAU, average user reads 20 tweets/session = 10B reads/day",
      readWriteRatio: "100:1 — timeline reads far exceed tweet writes",
      storagePerItem: "~1 KB per tweet (text + metadata); 500M tweets/day = 500 GB/day raw",
      peakMultiplier: "5x during major events (elections, Super Bowl, breaking news)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CHAT SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "chat-system",
    requirements: [
      { id: "r1", text: "Send and receive 1:1 messages in real time", category: "functional", importance: "critical" },
      { id: "r2", text: "Group chats with up to 1000 members", category: "functional", importance: "critical" },
      { id: "r3", text: "Offline message delivery (store-and-forward)", category: "functional", importance: "critical" },
      { id: "r4", text: "Read receipts (delivered, read indicators)", category: "functional", importance: "important" },
      { id: "r5", text: "Typing indicators", category: "functional", importance: "nice-to-have" },
      { id: "r6", text: "Online/offline presence status", category: "functional", importance: "important" },
      { id: "r7", text: "Message delivery latency < 50ms for online users", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Guaranteed message ordering within a conversation", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Multi-device sync across all logged-in devices", category: "non-functional", importance: "important" },
      { id: "r10", text: "End-to-end encryption for 1:1 chats", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you guarantee message ordering in a group chat?", category: "consistency", hint: "Think about per-conversation sequence numbers", answer: "Assign a monotonically increasing sequence number per conversation. The server assigns sequence numbers atomically using a Redis INCR or database sequence. Clients use sequence numbers to detect gaps and request missing messages." },
      { id: "q2", question: "How do you handle a WebSocket gateway server going down?", category: "failure", hint: "Connection-to-server mapping + reconnect", answer: "Store connection-to-gateway mapping in Redis. When a gateway dies, clients detect the broken connection and reconnect to another gateway via the load balancer. Undelivered messages are stored in the database and synced on reconnect using the client's last-seen sequence number." },
      { id: "q3", question: "How does the system handle a group with 1000 members?", category: "scale", hint: "Fan-out strategy for large groups", answer: "For large groups, fan-out through a message queue. The message is written once to the conversation store, then a fan-out worker sends it to each online member's WebSocket gateway. Offline members receive it on next sync. This avoids 1000 synchronous writes." },
      { id: "q4", question: "How do you implement end-to-end encryption?", category: "security", hint: "Signal Protocol / Double Ratchet", answer: "Use the Signal Protocol (Double Ratchet algorithm). Clients exchange public keys during initial setup. Each message is encrypted client-side before sending; the server only sees ciphertext. Key rotation happens with each message exchange for forward secrecy." },
      { id: "q5", question: "How do you avoid overwhelming the server with typing indicators?", category: "optimization", hint: "Ephemeral events, throttling", answer: "Typing indicators are ephemeral: send via WebSocket only (no database writes). Throttle to one event per 3 seconds per user per conversation. Auto-expire after 5 seconds of no typing. For large groups, only send to the most recent N active participants." },
      { id: "q6", question: "How do you implement presence (online/offline)?", category: "scale", hint: "Heartbeats + TTL keys", answer: "Each connected client sends a heartbeat every 30 seconds. The WebSocket gateway updates a Redis key with TTL of 60 seconds. If the key expires, the user is considered offline. Presence changes are broadcast to the user's contact list via pub/sub, with fan-out limited to contacts currently online." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/messages", description: "Send a message to a conversation", requestBody: "{ conversationId: string, content: string, type: 'text'|'image'|'file' }", response: "{ messageId, sequenceNumber, timestamp }" },
      { method: "GET", path: "/api/v1/conversations/{conversationId}/messages", description: "Fetch message history (paginated)", response: "{ messages: Message[], hasMore: boolean }" },
      { method: "POST", path: "/api/v1/conversations", description: "Create a new conversation (1:1 or group)", requestBody: "{ participantIds: string[], name?: string, type: '1:1'|'group' }", response: "{ conversationId, participants, createdAt }" },
      { method: "PUT", path: "/api/v1/messages/{messageId}/read", description: "Mark message as read", response: "{ success: boolean }" },
      { method: "GET", path: "/api/v1/conversations", description: "List user's conversations", response: "{ conversations: Conversation[], nextCursor: string }" },
    ],
    dataModel: [
      {
        name: "messages",
        type: "nosql",
        fields: [
          { name: "conversation_id", type: "string" },
          { name: "sequence_number", type: "bigint", note: "Per-conversation monotonic counter" },
          { name: "sender_id", type: "string" },
          { name: "content", type: "string", note: "Encrypted ciphertext for E2E chats" },
          { name: "type", type: "enum", note: "text, image, file, system" },
          { name: "created_at", type: "datetime" },
        ],
        partitionKey: "conversation_id",
        indexes: ["sequence_number"],
      },
      {
        name: "conversations",
        type: "nosql",
        fields: [
          { name: "conversation_id", type: "string" },
          { name: "type", type: "enum", note: "1:1 or group" },
          { name: "participant_ids", type: "string[]" },
          { name: "name", type: "string", note: "Group name, null for 1:1" },
          { name: "last_message_at", type: "datetime" },
          { name: "last_message_preview", type: "string" },
        ],
        partitionKey: "conversation_id",
      },
      {
        name: "presence_cache",
        type: "cache",
        fields: [
          { name: "user_id", type: "string", note: "Key with TTL of 60s" },
          { name: "status", type: "enum", note: "online, away, offline" },
          { name: "last_active_at", type: "datetime" },
          { name: "gateway_server_id", type: "string", note: "Which WS gateway holds this connection" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "200M DAU, average 40 messages sent/day per user = 8B messages/day",
      readWriteRatio: "~2:1 write-heavy (writes exceed reads) — more messages sent than conversation list views",
      storagePerItem: "~200 bytes per message; 8B messages/day = 1.6 TB/day",
      peakMultiplier: "2x average during evening hours (6-10 PM local time)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. RIDE SHARING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "ride-sharing",
    requirements: [
      { id: "r1", text: "Request a ride from current location to destination", category: "functional", importance: "critical" },
      { id: "r2", text: "Match riders with nearby available drivers", category: "functional", importance: "critical" },
      { id: "r3", text: "Real-time location tracking during trip", category: "functional", importance: "critical" },
      { id: "r4", text: "ETA calculation using real-time traffic data", category: "functional", importance: "important" },
      { id: "r5", text: "Dynamic surge pricing based on supply/demand", category: "functional", importance: "important" },
      { id: "r6", text: "Trip history and receipts", category: "functional", importance: "important" },
      { id: "r7", text: "Driver matching within 5 seconds", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Handle 1M+ concurrent driver location updates (every 3 seconds)", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Payment processing with idempotent charges", category: "non-functional", importance: "critical" },
      { id: "r10", text: "Graceful handling of disconnections mid-trip", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you efficiently find nearby drivers?", category: "optimization", hint: "Think about geospatial indexing (geohash, S2 cells)", answer: "Use geohashing to convert lat/lng to a string prefix. Store driver locations in Redis using GEOADD. Find nearby drivers with GEORADIUS in O(log N + M) time where M is results returned. Partition by geohash prefix so each shard covers a geographic region." },
      { id: "q2", question: "What happens if a driver's app crashes mid-trip?", category: "failure", hint: "Heartbeats and trip state persistence", answer: "The server detects missing heartbeats after 30 seconds and marks the driver as disconnected. Trip state is persisted in the database so it survives app crashes. When the driver reconnects, the app resumes the trip from the last known state. If the driver doesn't reconnect within 5 minutes, reassign the rider." },
      { id: "q3", question: "How do you prevent double-charging riders?", category: "consistency", hint: "Idempotency keys", answer: "Every charge request includes an idempotency key (trip_id). The payment service checks if a charge with that key already exists before processing. If it does, return the existing result. Store idempotency keys with outcomes for at least 24 hours." },
      { id: "q4", question: "How do you handle surge pricing fairly?", category: "scale", hint: "Think about geo-zone based pricing", answer: "Divide the city into hexagonal geo-zones. Compute supply/demand ratio per zone every 30 seconds using streaming data. Lock the surge multiplier at the time of ride request so it doesn't change during the booking flow. Display the fare estimate before the rider confirms." },
      { id: "q5", question: "How do you handle the thundering herd when a popular event ends?", category: "scale", hint: "Virtual queue + graduated dispatch", answer: "When a geo-zone sees a sudden spike in requests (e.g., concert ending), activate a virtual queue. Process ride requests in batches, prioritizing by wait time. Dynamically expand the search radius for available drivers. Send push notifications to nearby off-duty drivers to incentivize coming online." },
      { id: "q6", question: "How do you ensure rider safety?", category: "security", hint: "Identity verification, trip sharing, emergency features", answer: "Verify driver identity via background checks and periodic selfie verification. Share live trip details with trusted contacts. Implement an SOS button that records audio and shares live location with safety team. Log all driver locations for audit purposes." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/rides", description: "Request a new ride", requestBody: "{ pickupLat, pickupLng, destLat, destLng, rideType: 'standard'|'premium' }", response: "{ rideId, estimatedFare, surgeMultiplier, estimatedPickupETA }" },
      { method: "PUT", path: "/api/v1/drivers/{driverId}/location", description: "Update driver location (called every 3s)", requestBody: "{ lat: number, lng: number, heading: number, speed: number }", response: "{ success: boolean }" },
      { method: "GET", path: "/api/v1/rides/{rideId}", description: "Get ride details and live tracking", response: "{ rideId, status, driverLocation, eta, fare }" },
      { method: "POST", path: "/api/v1/rides/{rideId}/complete", description: "Complete the ride and trigger payment", response: "{ finalFare, paymentStatus, receiptUrl }" },
      { method: "GET", path: "/api/v1/rides/estimate", description: "Get fare estimate before requesting", response: "{ estimatedFare, surgeMultiplier, estimatedPickupTime }" },
    ],
    dataModel: [
      {
        name: "rides",
        type: "sql",
        fields: [
          { name: "ride_id", type: "uuid" },
          { name: "rider_id", type: "string" },
          { name: "driver_id", type: "string" },
          { name: "status", type: "enum", note: "requested, matched, in_progress, completed, cancelled" },
          { name: "pickup_lat", type: "decimal" },
          { name: "pickup_lng", type: "decimal" },
          { name: "dest_lat", type: "decimal" },
          { name: "dest_lng", type: "decimal" },
          { name: "fare", type: "decimal" },
          { name: "surge_multiplier", type: "decimal" },
          { name: "started_at", type: "datetime" },
          { name: "completed_at", type: "datetime" },
        ],
        indexes: ["rider_id", "driver_id", "status", "created_at"],
      },
      {
        name: "driver_locations",
        type: "cache",
        fields: [
          { name: "driver_id", type: "string" },
          { name: "lat", type: "decimal" },
          { name: "lng", type: "decimal" },
          { name: "geohash", type: "string", note: "For GEORADIUS queries" },
          { name: "status", type: "enum", note: "available, on_trip, offline" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "trip_location_log",
        type: "nosql",
        fields: [
          { name: "ride_id", type: "string" },
          { name: "timestamp", type: "datetime" },
          { name: "lat", type: "decimal" },
          { name: "lng", type: "decimal" },
          { name: "speed", type: "decimal" },
        ],
        partitionKey: "ride_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "50M DAU (riders + drivers), ~20M rides/day",
      readWriteRatio: "1:3 write-heavy — location updates dominate (1M drivers x every 3s = 333K writes/sec)",
      storagePerItem: "~500 bytes per ride record; location log ~100 bytes per point, ~600 points per 30-min ride",
      peakMultiplier: "4x during rush hours (8-9 AM, 5-7 PM) and event endings",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. VIDEO STREAMING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "video-streaming",
    requirements: [
      { id: "r1", text: "Upload videos with resumable upload support", category: "functional", importance: "critical" },
      { id: "r2", text: "Transcode videos into multiple resolutions and codecs", category: "functional", importance: "critical" },
      { id: "r3", text: "Adaptive bitrate streaming (HLS/DASH)", category: "functional", importance: "critical" },
      { id: "r4", text: "Video search by title, description, tags", category: "functional", importance: "important" },
      { id: "r5", text: "Personalized recommendations", category: "functional", importance: "important" },
      { id: "r6", text: "Comments, likes, and subscriptions", category: "functional", importance: "important" },
      { id: "r7", text: "< 200ms video start time at p95", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Global delivery via CDN with edge caching", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Support live streaming with < 5s glass-to-glass latency", category: "non-functional", importance: "nice-to-have" },
      { id: "r10", text: "Copyright detection before video goes live", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you handle a viral video that suddenly gets millions of views?", category: "scale", hint: "CDN cache warming and origin shielding", answer: "CDN edge nodes cache the video segments on first access. For viral content, proactively push the video to edge nodes in high-traffic regions (cache warming). Use origin shielding — a mid-tier CDN cache between edge and origin — to prevent thundering herd on the origin storage." },
      { id: "q2", question: "What happens if transcoding fails halfway through?", category: "failure", hint: "Checkpointing and retry", answer: "Implement checkpoint-based transcoding: save progress after each segment is transcoded. On failure, retry from the last checkpoint rather than restarting. Use a dead letter queue for videos that fail repeatedly, flagging them for manual investigation." },
      { id: "q3", question: "How do you minimize storage costs for billions of videos?", category: "optimization", hint: "Tiered storage based on access patterns", answer: "Use tiered storage: hot (SSD + CDN) for videos < 30 days old or frequently accessed, warm (standard S3) for moderate access, cold (S3 Glacier) for rarely accessed old videos. Automatic tiering based on view count and recency saves 60-70% on storage costs." },
      { id: "q4", question: "How does adaptive bitrate streaming work?", category: "optimization", hint: "Manifest files + segment-based delivery", answer: "The video is transcoded into segments (2-10 seconds each) at multiple quality levels. A manifest file (M3U8 for HLS) lists all available qualities and segment URLs. The client player monitors bandwidth and buffer levels, dynamically switching quality levels between segments for smooth playback." },
      { id: "q5", question: "How do you prevent unauthorized content downloads?", category: "security", hint: "Signed URLs and DRM", answer: "Use signed URLs with short TTLs for CDN access, so URLs expire after a few hours. For premium content, implement DRM (Widevine/FairPlay) which encrypts video segments and requires a license server handshake before playback. Token-based authentication prevents URL sharing." },
      { id: "q6", question: "How do you handle the upload of a 100GB video over unreliable networks?", category: "failure", hint: "Chunked resumable uploads", answer: "Split the upload into chunks (5-10 MB each). Track uploaded chunks server-side. On network failure, the client queries which chunks are complete and resumes from the last incomplete chunk. Use content hashing per chunk to verify integrity. Google's resumable upload protocol is the industry standard." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/videos/upload", description: "Initiate a resumable video upload", requestBody: "{ title, description, tags, fileSize, mimeType }", response: "{ uploadId, uploadUrl, chunkSize }" },
      { method: "PUT", path: "/api/v1/videos/upload/{uploadId}", description: "Upload a chunk of the video", requestBody: "Binary chunk data with Content-Range header", response: "{ bytesReceived, complete: boolean }" },
      { method: "GET", path: "/api/v1/videos/{videoId}", description: "Get video metadata and playback URLs", response: "{ videoId, title, manifestUrl, thumbnailUrl, viewCount }" },
      { method: "GET", path: "/api/v1/feed", description: "Get personalized video recommendations", response: "{ videos: Video[], nextPageToken: string }" },
      { method: "GET", path: "/api/v1/search?q={query}", description: "Search videos", response: "{ videos: Video[], totalResults: number }" },
    ],
    dataModel: [
      {
        name: "videos",
        type: "sql",
        fields: [
          { name: "video_id", type: "uuid" },
          { name: "uploader_id", type: "string" },
          { name: "title", type: "string" },
          { name: "description", type: "text" },
          { name: "status", type: "enum", note: "uploading, transcoding, published, removed" },
          { name: "duration_seconds", type: "int" },
          { name: "view_count", type: "bigint" },
          { name: "like_count", type: "int" },
          { name: "manifest_url", type: "string", note: "HLS/DASH manifest location" },
          { name: "created_at", type: "datetime" },
        ],
        indexes: ["uploader_id", "status", "created_at"],
      },
      {
        name: "video_segments",
        type: "nosql",
        fields: [
          { name: "video_id", type: "string" },
          { name: "quality", type: "string", note: "360p, 720p, 1080p, 4K" },
          { name: "segment_index", type: "int" },
          { name: "storage_url", type: "string", note: "S3 path to segment file" },
          { name: "duration_ms", type: "int" },
          { name: "byte_size", type: "int" },
        ],
        partitionKey: "video_id",
      },
      {
        name: "video_search",
        type: "search",
        fields: [
          { name: "video_id", type: "string" },
          { name: "title", type: "text" },
          { name: "description", type: "text" },
          { name: "tags", type: "keyword[]" },
          { name: "category", type: "keyword" },
          { name: "upload_date", type: "date" },
          { name: "view_count", type: "long", note: "For popularity boosting in search ranking" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "1B DAU, ~5 videos watched per session = 5B views/day",
      readWriteRatio: "1000:1 — 5B views/day vs ~5M uploads/day",
      storagePerItem: "Average video: 300 MB original, ~1.5 GB across all quality levels; 5M uploads/day = 7.5 PB/day",
      peakMultiplier: "3x average during evening hours globally (staggered by timezone)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. RATE LIMITER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "rate-limiter",
    requirements: [
      { id: "r1", text: "Limit requests per client/IP/API key within a time window", category: "functional", importance: "critical" },
      { id: "r2", text: "Support multiple algorithms (token bucket, sliding window, fixed window)", category: "functional", importance: "important" },
      { id: "r3", text: "Return HTTP 429 with Retry-After header when limit exceeded", category: "functional", importance: "critical" },
      { id: "r4", text: "Return remaining quota in response headers (X-RateLimit-*)", category: "functional", importance: "important" },
      { id: "r5", text: "Configurable rules per endpoint, per client tier", category: "functional", importance: "important" },
      { id: "r6", text: "Support burst allowance above sustained rate", category: "functional", importance: "nice-to-have" },
      { id: "r7", text: "Sub-millisecond decision latency", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Distributed counting consistent across all instances", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Configurable fail-open vs fail-closed when Redis is unavailable", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "What happens when your Redis rate-limit store goes down?", category: "failure", hint: "Fail-open vs fail-closed tradeoff", answer: "Configurable per rule. For most APIs, fail-open (allow traffic through) to maintain availability. For sensitive endpoints (login, payments), fail-closed or fall back to local in-memory rate limiting with higher thresholds. Use Redis Cluster with replicas for HA." },
      { id: "q2", question: "How do you handle rate limiting across multiple data centers?", category: "scale", hint: "Local + global counters", answer: "Use a two-tier approach: local rate limits enforced per data center for low latency, plus a global limit synced via async replication between data center Redis instances. Accept slight over-counting (e.g., allow 105% of the limit globally) in exchange for eliminating cross-DC latency from the request path." },
      { id: "q3", question: "What's the tradeoff between fixed window and sliding window?", category: "optimization", hint: "Accuracy vs memory/compute cost", answer: "Fixed window is simplest (single counter per window) but allows 2x burst at window boundaries. Sliding window log is most accurate but uses O(N) memory per key. Sliding window counter is the sweet spot: uses two fixed window counters with weighted overlap, giving near-accurate results with O(1) memory." },
      { id: "q4", question: "How do you prevent a sophisticated attacker from bypassing rate limits?", category: "security", hint: "Multiple layers of identification", answer: "Layer multiple identifiers: IP address, API key, user ID, device fingerprint, and session token. Apply limits at each layer independently. Use behavioral analysis to detect distributed attacks from botnets that rotate IPs. Implement CAPTCHA challenges for suspicious traffic patterns." },
      { id: "q5", question: "How do you handle rate limiting for WebSocket connections?", category: "optimization", hint: "Message rate vs connection rate", answer: "Limit both connection establishment rate (per IP) and message rate per connection. Use a token bucket per WebSocket connection that refills at the allowed message rate. Disconnect clients that exceed limits. This prevents a single connection from flooding the server with messages." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/rate-limit/check", description: "Check if a request should be allowed", requestBody: "{ clientId: string, endpoint: string, weight?: number }", response: "{ allowed: boolean, remaining: number, retryAfterMs?: number }" },
      { method: "GET", path: "/api/v1/rate-limit/rules", description: "Get all configured rate limit rules", response: "{ rules: Rule[] }" },
      { method: "PUT", path: "/api/v1/rate-limit/rules/{ruleId}", description: "Update a rate limit rule", requestBody: "{ maxRequests: number, windowSizeMs: number, algorithm: string }", response: "{ rule: Rule }" },
    ],
    dataModel: [
      {
        name: "rate_limit_counters",
        type: "cache",
        fields: [
          { name: "key", type: "string", note: "Format: {clientId}:{endpoint}:{window}" },
          { name: "count", type: "int", note: "Atomic counter via INCR" },
          { name: "ttl", type: "int", note: "Auto-expire with window size" },
        ],
      },
      {
        name: "rate_limit_rules",
        type: "sql",
        fields: [
          { name: "rule_id", type: "uuid" },
          { name: "endpoint_pattern", type: "string", note: "Glob or regex for endpoint matching" },
          { name: "client_tier", type: "string", note: "free, pro, enterprise" },
          { name: "max_requests", type: "int" },
          { name: "window_size_ms", type: "int" },
          { name: "algorithm", type: "enum", note: "token_bucket, sliding_window, fixed_window" },
          { name: "burst_allowance", type: "int", note: "Extra tokens above sustained rate" },
          { name: "fail_strategy", type: "enum", note: "open or closed" },
        ],
        indexes: ["endpoint_pattern", "client_tier"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "50M DAU generating API requests; rate limiter itself handles 50K+ checks/sec",
      readWriteRatio: "1:1 — every check is both a read (check counter) and write (increment counter)",
      storagePerItem: "~100 bytes per counter key in Redis; 10M active keys = ~1 GB",
      peakMultiplier: "10x during traffic spikes or DDoS attempts",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. NOTIFICATION SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "notification-system",
    requirements: [
      { id: "r1", text: "Send push notifications (iOS/Android/Web)", category: "functional", importance: "critical" },
      { id: "r2", text: "Send email notifications", category: "functional", importance: "critical" },
      { id: "r3", text: "Send SMS notifications", category: "functional", importance: "important" },
      { id: "r4", text: "Template engine with variable substitution and localization", category: "functional", importance: "important" },
      { id: "r5", text: "Priority-based routing (critical > marketing)", category: "functional", importance: "critical" },
      { id: "r6", text: "Per-user notification preferences and opt-out", category: "functional", importance: "important" },
      { id: "r7", text: "Delivery tracking with status (sent, delivered, read, bounced)", category: "functional", importance: "important" },
      { id: "r8", text: "At-least-once delivery with deduplication", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Rate limiting per provider to avoid throttling by APNS/FCM/email gateways", category: "non-functional", importance: "critical" },
      { id: "r10", text: "Process 100K+ notifications per second", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you prevent duplicate notifications to the same user?", category: "consistency", hint: "Deduplication keys", answer: "Generate a deduplication key per notification (hash of user_id + event_type + event_id). Store recent dedup keys in Redis with a TTL (e.g., 24 hours). Before sending, check if the key exists. This prevents retries or duplicate events from sending the same notification twice." },
      { id: "q2", question: "How do you handle a downstream provider (e.g., APNS) being down?", category: "failure", hint: "Circuit breaker + retry with backoff", answer: "Implement a circuit breaker per provider. When failure rate exceeds a threshold, open the circuit and queue messages for retry. Use exponential backoff with jitter for retries. Optionally fall back to an alternative channel (e.g., if push fails, try email) based on notification criticality." },
      { id: "q3", question: "How do you handle sending a notification to 10 million users at once?", category: "scale", hint: "Segmented fan-out with backpressure", answer: "Don't fan out all 10M at once. Segment users into batches (e.g., 10K per batch). Push batches to the message queue with rate limiting. Workers process batches, respecting per-provider rate limits (APNS allows ~10K/sec per connection). Use multiple connections and throttle to stay within provider limits." },
      { id: "q4", question: "How do you ensure critical alerts aren't delayed by marketing notifications?", category: "optimization", hint: "Priority queues or separate lanes", answer: "Use separate message queues (or priority lanes within a queue) for different priority levels: critical (security alerts, payment confirmations), standard (social notifications), and marketing (promotions). Critical queue workers always run at capacity; marketing workers are throttled and can be paused during system stress." },
      { id: "q5", question: "How do you handle unsubscribes and compliance (GDPR, CAN-SPAM)?", category: "security", hint: "Preference service as a central gate", answer: "Every notification must pass through a Preference Service that checks: user opt-in status per channel and category, legal unsubscribes, quiet hours, and frequency caps. Store preferences in a cache for fast lookup. Provide one-click unsubscribe links in every email (legally required). Log all consent changes for audit." },
      { id: "q6", question: "How do you handle device token invalidation?", category: "failure", hint: "Feedback from push providers", answer: "APNS and FCM return feedback on invalid tokens (device uninstalled app, token expired). Process this feedback asynchronously: remove invalid tokens from the device registry, and update user preference to prevent future delivery attempts to dead endpoints. Run periodic token validation sweeps." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/notifications", description: "Send a notification", requestBody: "{ userId: string, templateId: string, variables: object, channels: string[], priority: 'critical'|'standard'|'marketing' }", response: "{ notificationId, status }" },
      { method: "POST", path: "/api/v1/notifications/bulk", description: "Send notification to a segment of users", requestBody: "{ segmentQuery: object, templateId: string, variables: object, channels: string[] }", response: "{ batchId, estimatedRecipients: number }" },
      { method: "GET", path: "/api/v1/notifications/{notificationId}/status", description: "Get delivery status of a notification", response: "{ notificationId, channel, status, deliveredAt, readAt }" },
      { method: "PUT", path: "/api/v1/users/{userId}/preferences", description: "Update notification preferences", requestBody: "{ email: boolean, push: boolean, sms: boolean, categories: object }", response: "{ preferences: Preferences }" },
    ],
    dataModel: [
      {
        name: "notifications",
        type: "nosql",
        fields: [
          { name: "notification_id", type: "uuid" },
          { name: "user_id", type: "string" },
          { name: "template_id", type: "string" },
          { name: "channel", type: "enum", note: "push, email, sms" },
          { name: "priority", type: "enum", note: "critical, standard, marketing" },
          { name: "status", type: "enum", note: "pending, sent, delivered, read, failed, bounced" },
          { name: "rendered_content", type: "string" },
          { name: "created_at", type: "datetime" },
          { name: "sent_at", type: "datetime" },
        ],
        partitionKey: "user_id",
        indexes: ["status", "created_at"],
      },
      {
        name: "templates",
        type: "sql",
        fields: [
          { name: "template_id", type: "string" },
          { name: "name", type: "string" },
          { name: "channel", type: "enum" },
          { name: "locale", type: "string", note: "e.g., en-US, ja-JP" },
          { name: "subject", type: "string", note: "For email" },
          { name: "body_template", type: "text", note: "Handlebars/Mustache template" },
          { name: "version", type: "int" },
        ],
        indexes: ["name", "channel", "locale"],
      },
      {
        name: "user_preferences",
        type: "cache",
        fields: [
          { name: "user_id", type: "string" },
          { name: "email_enabled", type: "boolean" },
          { name: "push_enabled", type: "boolean" },
          { name: "sms_enabled", type: "boolean" },
          { name: "category_preferences", type: "json", note: "Per-category opt-in/out" },
          { name: "quiet_hours", type: "json", note: "Timezone-aware quiet hours" },
        ],
      },
      {
        name: "device_tokens",
        type: "nosql",
        fields: [
          { name: "user_id", type: "string" },
          { name: "device_id", type: "string" },
          { name: "platform", type: "enum", note: "ios, android, web" },
          { name: "token", type: "string", note: "APNS/FCM token" },
          { name: "is_active", type: "boolean" },
          { name: "last_validated_at", type: "datetime" },
        ],
        partitionKey: "user_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "500M DAU, average 5 notifications/day per user = 2.5B notifications/day",
      readWriteRatio: "1:10 write-heavy — mostly writes (sending) with some reads (status checks)",
      storagePerItem: "~500 bytes per notification record; 2.5B/day = ~1.25 TB/day",
      peakMultiplier: "10x during marketing campaigns or breaking news alerts",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. TYPEAHEAD / AUTOCOMPLETE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "typeahead-autocomplete",
    requirements: [
      { id: "r1", text: "Return top 5-10 suggestions as user types each character", category: "functional", importance: "critical" },
      { id: "r2", text: "Rank suggestions by popularity, recency, and personalization", category: "functional", importance: "critical" },
      { id: "r3", text: "Support prefix matching (starts-with queries)", category: "functional", importance: "critical" },
      { id: "r4", text: "Fuzzy matching to handle typos (edit distance <= 2)", category: "functional", importance: "important" },
      { id: "r5", text: "Real-time trend updates (breaking news within minutes)", category: "functional", importance: "important" },
      { id: "r6", text: "Filter offensive/inappropriate suggestions", category: "functional", importance: "important" },
      { id: "r7", text: "Response time < 50ms at p99", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Multi-language support with Unicode and transliteration", category: "non-functional", importance: "nice-to-have" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you keep suggestions fresh as trends change?", category: "optimization", hint: "Offline pipeline + real-time overlay", answer: "Run an offline pipeline every 15 minutes that aggregates search logs, computes new frequency rankings, and rebuilds the trie. For real-time trends (breaking news), maintain a separate hot-trends overlay in Redis that is updated in real-time from a streaming pipeline. Merge results from both at query time." },
      { id: "q2", question: "How do you handle the load of every keystroke triggering a request?", category: "scale", hint: "Client-side debouncing + CDN caching", answer: "Client-side: debounce requests (wait 100-200ms after last keystroke before sending). Cache short prefixes (1-2 chars) aggressively at the CDN since they're common and stable. Server-side: cache popular prefix results in Redis. The top 10K prefixes account for the vast majority of queries." },
      { id: "q3", question: "What data structure do you use for prefix matching?", category: "optimization", hint: "Trie with top-K at each node", answer: "Use a trie (prefix tree) where each node stores the top-K (e.g., 10) suggestions for that prefix, pre-computed by the offline pipeline. This allows O(L) lookup where L is the prefix length, and avoids traversing the entire subtree at query time. Serialize the trie for fast loading into memory." },
      { id: "q4", question: "How do you implement personalized suggestions?", category: "optimization", hint: "Per-user history + blending", answer: "Store each user's recent search history (last 100 queries) in a user-specific cache. At query time, blend generic top-K results with the user's matching history. Weight recent personal searches higher. This can be done client-side by merging two result sets to avoid personalizing at the server for every request." },
      { id: "q5", question: "How do you prevent showing offensive autocomplete suggestions?", category: "security", hint: "Blocklist + ML classifier", answer: "Maintain a blocklist of offensive terms and patterns. Run new suggestion candidates through an ML classifier before adding them to the trie. Additionally, filter at query time against the blocklist. Implement a feedback loop where users can report offensive suggestions for removal." },
      { id: "q6", question: "What if a trie node becomes a hot key in your cache?", category: "scale", hint: "Replicate hot prefixes", answer: "Short prefixes (1-2 chars) are naturally hot. Replicate them across all app server instances in local memory. For mid-length prefixes that become hot (trending topics), detect via sampling and replicate to multiple Redis shards with random suffix in the key, then load-balance reads across replicas." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/suggestions?q={prefix}&limit={n}", description: "Get autocomplete suggestions for a prefix", response: "{ suggestions: [{ text: string, score: number, type: 'trending'|'personal'|'popular' }] }" },
      { method: "POST", path: "/api/v1/search/log", description: "Log a completed search (for ranking updates)", requestBody: "{ query: string, userId?: string, resultClicked?: string }", response: "{ success: boolean }" },
      { method: "GET", path: "/api/v1/trending", description: "Get current trending searches", response: "{ trending: [{ query: string, volume: number, trend: 'rising'|'stable' }] }" },
    ],
    dataModel: [
      {
        name: "trie_nodes",
        type: "cache",
        fields: [
          { name: "prefix", type: "string", note: "Trie node key" },
          { name: "top_suggestions", type: "json", note: "Pre-computed top-K suggestions with scores" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "search_logs",
        type: "nosql",
        fields: [
          { name: "query", type: "string" },
          { name: "user_id", type: "string" },
          { name: "timestamp", type: "datetime" },
          { name: "result_clicked", type: "string" },
          { name: "session_id", type: "string" },
        ],
        partitionKey: "query",
      },
      {
        name: "suggestion_index",
        type: "search",
        fields: [
          { name: "phrase", type: "text", note: "Completion text, indexed as edge-ngrams" },
          { name: "frequency", type: "long" },
          { name: "category", type: "keyword" },
          { name: "language", type: "keyword" },
          { name: "last_searched", type: "date" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "1B queries/day, average 4 keystrokes per query = 4B suggestion requests/day",
      readWriteRatio: "1000:1 — overwhelmingly reads (suggestions) vs writes (search logs)",
      storagePerItem: "~200 bytes per suggestion entry; 100M unique suggestions = ~20 GB trie data",
      peakMultiplier: "5x during breaking news events",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. WEB CRAWLER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "web-crawler",
    requirements: [
      { id: "r1", text: "Crawl web pages starting from seed URLs", category: "functional", importance: "critical" },
      { id: "r2", text: "Extract links and add new URLs to the frontier", category: "functional", importance: "critical" },
      { id: "r3", text: "Respect robots.txt and per-domain crawl delays", category: "functional", importance: "critical" },
      { id: "r4", text: "Deduplicate URLs and near-duplicate content", category: "functional", importance: "important" },
      { id: "r5", text: "Store crawled page content for indexing", category: "functional", importance: "important" },
      { id: "r6", text: "Priority-based URL frontier (important pages first)", category: "functional", importance: "important" },
      { id: "r7", text: "Crawl rate of 1000+ pages per second across the cluster", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Incremental re-crawling based on page change frequency", category: "non-functional", importance: "important" },
      { id: "r9", text: "Handle spider traps, redirect loops, and soft 404s", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you avoid overwhelming a single website?", category: "optimization", hint: "Per-domain rate limiting + politeness delay", answer: "Implement per-domain rate limits in Redis. Before fetching a URL, check the domain's last crawl timestamp. Enforce a minimum delay between requests to the same domain (typically 1-5 seconds, or as specified in robots.txt Crawl-delay). Partition URLs by domain in the back queue to enable per-domain throttling." },
      { id: "q2", question: "How do you detect and avoid spider traps?", category: "failure", hint: "URL depth limits, pattern detection", answer: "Set a maximum URL depth (e.g., 15 levels from the seed). Detect repeating URL patterns (e.g., calendar pages generating infinite date URLs). Limit the number of pages crawled per domain per cycle. Use URL normalization to collapse equivalent URLs. Set a per-page crawl timeout to avoid hanging on slow-loading traps." },
      { id: "q3", question: "How do you deduplicate content efficiently?", category: "optimization", hint: "SimHash for near-duplicate detection", answer: "For exact URL dedup, use a Bloom filter (space-efficient, allows false positives but not false negatives). For content dedup, compute SimHash of page content — two pages with SimHash Hamming distance < 3 are near-duplicates. Store SimHash fingerprints in a lookup table for O(1) comparison." },
      { id: "q4", question: "How do you prioritize which URLs to crawl first?", category: "scale", hint: "Multi-signal scoring", answer: "Score URLs by: PageRank (link authority), freshness (time since last crawl), change frequency (how often the page has historically changed), and depth from seed (shallower = higher priority). Use a priority queue with these scores. Re-crawl news sites hourly, blogs weekly, and static pages monthly." },
      { id: "q5", question: "How do you coordinate multiple crawler workers?", category: "scale", hint: "Domain-partitioned queues", answer: "Use a URL frontier with two layers: front queues (priority-based) feed into back queues (one per domain). Workers pull from back queues to ensure per-domain politeness. Use consistent hashing to assign domains to workers, so each worker is responsible for a set of domains. This prevents multiple workers from hammering the same site." },
      { id: "q6", question: "How do you handle pages that require JavaScript rendering?", category: "optimization", hint: "Headless browser rendering pipeline", answer: "Use a two-pass approach: first crawl with a fast HTTP client for static HTML pages (90%+ of the web). For JavaScript-heavy pages, queue them for a headless browser pool (Puppeteer/Playwright). The browser pool is expensive, so limit it to domains known to require JS rendering and cache the rendered HTML." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/crawl/seed", description: "Add seed URLs to the frontier", requestBody: "{ urls: string[], priority: number }", response: "{ accepted: number, duplicates: number }" },
      { method: "GET", path: "/api/v1/crawl/status", description: "Get crawler status and statistics", response: "{ pagesPerSec, totalCrawled, frontierSize, activeWorkers }" },
      { method: "GET", path: "/api/v1/pages/{urlHash}", description: "Get crawled page content and metadata", response: "{ url, htmlContent, statusCode, crawledAt, contentHash }" },
      { method: "PUT", path: "/api/v1/crawl/config", description: "Update crawl configuration", requestBody: "{ maxDepth, defaultDelay, maxPagesPerDomain, allowedDomains? }", response: "{ config: Config }" },
    ],
    dataModel: [
      {
        name: "crawl_frontier",
        type: "nosql",
        fields: [
          { name: "url_hash", type: "string", note: "SHA-256 of normalized URL" },
          { name: "url", type: "string" },
          { name: "domain", type: "string" },
          { name: "priority", type: "float" },
          { name: "depth", type: "int" },
          { name: "last_crawled_at", type: "datetime" },
          { name: "next_crawl_after", type: "datetime" },
          { name: "status", type: "enum", note: "pending, in_progress, completed, failed" },
        ],
        partitionKey: "domain",
        indexes: ["priority", "next_crawl_after"],
      },
      {
        name: "crawled_pages",
        type: "nosql",
        fields: [
          { name: "url_hash", type: "string" },
          { name: "url", type: "string" },
          { name: "status_code", type: "int" },
          { name: "content_hash", type: "string", note: "SimHash for near-duplicate detection" },
          { name: "content_storage_path", type: "string", note: "S3 path to raw HTML" },
          { name: "extracted_links", type: "int" },
          { name: "crawled_at", type: "datetime" },
        ],
        partitionKey: "url_hash",
      },
      {
        name: "robots_txt_cache",
        type: "cache",
        fields: [
          { name: "domain", type: "string" },
          { name: "rules", type: "json", note: "Parsed robots.txt directives" },
          { name: "crawl_delay", type: "int", note: "Seconds between requests" },
          { name: "fetched_at", type: "datetime" },
          { name: "ttl", type: "int", note: "Typically 24 hours" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "N/A — internal system; target: 1B pages crawled/month",
      readWriteRatio: "1:1 — each crawl involves reading the frontier and writing crawl results",
      storagePerItem: "~100 KB average per page (HTML); 1B pages/month = 100 TB/month raw content",
      peakMultiplier: "Steady-state — crawler operates at a constant rate, not user-driven",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. DISTRIBUTED CACHE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "distributed-cache",
    requirements: [
      { id: "r1", text: "Key-value get/set with sub-millisecond latency", category: "functional", importance: "critical" },
      { id: "r2", text: "TTL-based expiration per key", category: "functional", importance: "critical" },
      { id: "r3", text: "Multiple eviction policies (LRU, LFU, random)", category: "functional", importance: "important" },
      { id: "r4", text: "Support for data structures: lists, sets, sorted sets, hash maps", category: "functional", importance: "important" },
      { id: "r5", text: "Consistent hashing for data distribution across nodes", category: "functional", importance: "critical" },
      { id: "r6", text: "Primary-replica replication for fault tolerance", category: "functional", importance: "critical" },
      { id: "r7", text: "1M+ operations per second per node", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Hot key detection and mitigation", category: "non-functional", importance: "important" },
      { id: "r9", text: "Automatic failover when a primary node goes down", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How does consistent hashing work, and why use virtual nodes?", category: "scale", hint: "Hash ring with virtual nodes for even distribution", answer: "Consistent hashing maps both keys and servers onto a ring (0 to 2^32). A key is assigned to the first server clockwise from its position. With only physical nodes, distribution can be uneven. Virtual nodes (e.g., 150 per physical node) spread each server's responsibility across the ring, giving much more uniform distribution and smoother rebalancing when nodes join/leave." },
      { id: "q2", question: "What happens when a cache node goes down?", category: "failure", hint: "Failover to replica + consistent hashing minimizes data loss", answer: "The sentinel/coordinator detects the failure via heartbeats. It promotes the replica to primary and updates the cluster topology. Clients are notified of the new topology. With consistent hashing, only the keys belonging to the failed node are affected — other nodes continue serving their keys normally. The new primary starts accepting writes immediately." },
      { id: "q3", question: "How do you handle a hot key that gets 100K requests per second?", category: "scale", hint: "Replicate hot keys across nodes", answer: "Detect hot keys by sampling (e.g., 1% of requests). When a key exceeds a threshold (e.g., 1000 QPS), replicate it to all nodes with a random suffix in the routing key. Client-side load balancing distributes reads across all replicas. Alternatively, use a local in-memory L1 cache on app servers with short TTL for known hot keys." },
      { id: "q4", question: "How do you choose between LRU and LFU eviction?", category: "optimization", hint: "Access pattern dependent", answer: "LRU is best for recency-biased workloads (most recent = most likely to be accessed again). LFU is better for frequency-biased workloads (some items are consistently popular). LFU handles scan resistance better — a full-table scan won't evict frequently-used keys. Redis uses approximated LRU/LFU (sampling 5 random keys) for O(1) eviction." },
      { id: "q5", question: "How do you prevent thundering herd when a popular cache entry expires?", category: "scale", hint: "Locking + stale-while-revalidate", answer: "Use a distributed lock: when a key expires, the first requester acquires a lock and rebuilds the cache while other requesters either wait briefly or are served stale data (stale-while-revalidate pattern). Alternatively, use probabilistic early expiration: randomly refresh the key before it expires, with probability increasing as TTL approaches zero." },
      { id: "q6", question: "How do you handle cache coherence when the database is updated?", category: "consistency", hint: "Cache invalidation strategies", answer: "Three common patterns: (1) Cache-aside: application manages cache reads and invalidation on writes. (2) Write-through: writes go to cache and database synchronously. (3) Write-behind: writes go to cache immediately and database asynchronously. Cache-aside is most common because it's simple and handles failure gracefully — stale data self-corrects on TTL expiry." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/cache/{key}", description: "Get value by key", response: "{ value: any, ttl: number } or 404" },
      { method: "PUT", path: "/cache/{key}", description: "Set a key-value pair", requestBody: "{ value: any, ttlMs?: number, evictionPolicy?: string }", response: "{ success: boolean }" },
      { method: "DELETE", path: "/cache/{key}", description: "Delete a key", response: "{ success: boolean, existed: boolean }" },
      { method: "GET", path: "/cluster/status", description: "Get cluster topology and health", response: "{ nodes: Node[], totalKeys: number, hitRate: number }" },
    ],
    dataModel: [
      {
        name: "cache_entry",
        type: "cache",
        fields: [
          { name: "key", type: "string" },
          { name: "value", type: "bytes", note: "Serialized value (string, list, set, etc.)" },
          { name: "ttl", type: "int", note: "Time-to-live in milliseconds" },
          { name: "created_at", type: "datetime" },
          { name: "last_accessed_at", type: "datetime", note: "For LRU eviction" },
          { name: "access_count", type: "int", note: "For LFU eviction" },
        ],
      },
      {
        name: "cluster_topology",
        type: "sql",
        fields: [
          { name: "node_id", type: "string" },
          { name: "host", type: "string" },
          { name: "port", type: "int" },
          { name: "role", type: "enum", note: "primary or replica" },
          { name: "primary_id", type: "string", note: "For replicas, the primary they replicate" },
          { name: "hash_slots", type: "int[]", note: "Assigned hash slot ranges" },
          { name: "status", type: "enum", note: "healthy, degraded, down" },
          { name: "last_heartbeat", type: "datetime" },
        ],
        indexes: ["role", "status"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "N/A — infrastructure service; handles 500K+ reads/sec, 100K+ writes/sec",
      readWriteRatio: "5:1 — caches are read-heavy by design",
      storagePerItem: "Average ~1 KB per entry; 500 GB total cache = ~500M entries across the cluster",
      peakMultiplier: "2x during application peak hours; hot keys can spike 100x",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. PAYMENT SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "payment-system",
    requirements: [
      { id: "r1", text: "Process payments (authorize, capture, settle)", category: "functional", importance: "critical" },
      { id: "r2", text: "Support refunds and partial refunds", category: "functional", importance: "critical" },
      { id: "r3", text: "Double-entry accounting ledger", category: "functional", importance: "critical" },
      { id: "r4", text: "Multiple payment methods (cards, bank transfers, wallets)", category: "functional", importance: "important" },
      { id: "r5", text: "Dispute/chargeback handling workflow", category: "functional", importance: "important" },
      { id: "r6", text: "Daily reconciliation with bank settlement files", category: "functional", importance: "important" },
      { id: "r7", text: "Exactly-once payment execution via idempotency keys", category: "non-functional", importance: "critical" },
      { id: "r8", text: "PCI DSS compliance — tokenize card numbers", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Multi-currency with proper rounding (banker's rounding)", category: "non-functional", importance: "important" },
      { id: "r10", text: "99.999% availability for payment processing", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you ensure a payment is never processed twice?", category: "consistency", hint: "Idempotency keys stored with the result", answer: "Every payment API call includes a client-generated idempotency key. Before processing, check if the key exists in the database. If it does, return the stored result. If not, process the payment and store the key + result atomically in the same transaction. Use a unique index on the idempotency key to prevent race conditions." },
      { id: "q2", question: "How do you handle a payment processor being down?", category: "failure", hint: "Circuit breaker + fallback processor", answer: "Implement a circuit breaker per payment processor. When the primary processor fails, route to a backup processor (e.g., Stripe → Adyen). Queue failed payments for retry with exponential backoff. For authorized-but-not-captured payments, the authorization has a TTL (typically 7 days) so there's time to retry." },
      { id: "q3", question: "How does the double-entry ledger work?", category: "consistency", hint: "Every transaction creates balanced debit + credit entries", answer: "Every financial operation creates at least two ledger entries that sum to zero. E.g., a $100 payment creates: debit customer_account $100, credit merchant_account $100. Refunds reverse: debit merchant_account $50, credit customer_account $50. The ledger is append-only — never update or delete entries. This provides a complete audit trail and self-balancing verification." },
      { id: "q4", question: "How do you handle a multi-step payment that fails midway?", category: "failure", hint: "Saga pattern with compensating transactions", answer: "Use the saga pattern: authorize → fraud check → capture → settle. Each step has a compensating action (void authorization, reverse capture). If step 3 fails, execute compensating actions in reverse order. A saga coordinator (backed by a message queue) tracks the state machine and triggers compensations on failure." },
      { id: "q5", question: "How do you ensure PCI DSS compliance?", category: "security", hint: "Tokenization and network segmentation", answer: "Never store raw card numbers. Tokenize at the entry point using a PCI-compliant vault service. The token (not the card number) flows through the system. The vault resides in an isolated PCI-scoped network segment with strict access controls, encryption at rest and in transit, and detailed audit logging." },
      { id: "q6", question: "How do you handle currency conversion in a multi-currency system?", category: "optimization", hint: "Store amounts in minor units with currency code", answer: "Store all amounts as integers in the smallest currency unit (cents for USD, yen for JPY). Store the currency code alongside. Use exchange rates from a reliable feed, updated every minute. Apply banker's rounding (round half to even) to avoid systematic bias. Lock the exchange rate at the time of transaction creation." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/payments", description: "Create and authorize a payment", requestBody: "{ amount: number, currency: string, paymentMethod: object, idempotencyKey: string, merchantId: string }", response: "{ paymentId, status: 'authorized'|'declined', authCode }" },
      { method: "POST", path: "/api/v1/payments/{paymentId}/capture", description: "Capture an authorized payment", requestBody: "{ amount?: number }", response: "{ paymentId, status: 'captured', capturedAmount }" },
      { method: "POST", path: "/api/v1/payments/{paymentId}/refund", description: "Refund a captured payment", requestBody: "{ amount: number, reason: string, idempotencyKey: string }", response: "{ refundId, status, refundedAmount }" },
      { method: "GET", path: "/api/v1/payments/{paymentId}", description: "Get payment details and status", response: "{ paymentId, status, amount, currency, timeline: Event[] }" },
      { method: "GET", path: "/api/v1/ledger/balance/{accountId}", description: "Get account balance from ledger", response: "{ accountId, balance, currency, lastUpdated }" },
    ],
    dataModel: [
      {
        name: "payments",
        type: "sql",
        fields: [
          { name: "payment_id", type: "uuid" },
          { name: "idempotency_key", type: "string", note: "Unique index for exactly-once" },
          { name: "merchant_id", type: "string" },
          { name: "amount", type: "bigint", note: "In minor currency units (cents)" },
          { name: "currency", type: "string", note: "ISO 4217 (USD, EUR, JPY)" },
          { name: "status", type: "enum", note: "created, authorized, captured, settled, refunded, failed" },
          { name: "payment_method_token", type: "string", note: "Tokenized card/method reference" },
          { name: "processor_ref", type: "string", note: "External processor transaction ID" },
          { name: "created_at", type: "datetime" },
        ],
        indexes: ["idempotency_key (unique)", "merchant_id", "status", "created_at"],
      },
      {
        name: "ledger_entries",
        type: "sql",
        fields: [
          { name: "entry_id", type: "uuid" },
          { name: "transaction_id", type: "string", note: "Groups debit+credit pair" },
          { name: "account_id", type: "string" },
          { name: "amount", type: "bigint", note: "Positive for debit, negative for credit" },
          { name: "currency", type: "string" },
          { name: "type", type: "enum", note: "debit or credit" },
          { name: "description", type: "string" },
          { name: "created_at", type: "datetime" },
        ],
        indexes: ["transaction_id", "account_id", "created_at"],
      },
      {
        name: "idempotency_store",
        type: "cache",
        fields: [
          { name: "idempotency_key", type: "string" },
          { name: "response_body", type: "json", note: "Stored response for replay" },
          { name: "status_code", type: "int" },
          { name: "created_at", type: "datetime" },
          { name: "ttl", type: "int", note: "24 hours" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "10M merchants, ~100M transactions/day",
      readWriteRatio: "1:1 — each payment involves writes (create, state transitions) and reads (status checks)",
      storagePerItem: "~2 KB per payment + 500 bytes per ledger entry pair; 100M transactions/day = ~250 GB/day",
      peakMultiplier: "10x during Black Friday / holiday shopping events",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. TICKET BOOKING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "ticket-booking",
    requirements: [
      { id: "r1", text: "Browse events and view seat availability maps", category: "functional", importance: "critical" },
      { id: "r2", text: "Select and temporarily hold seats during checkout", category: "functional", importance: "critical" },
      { id: "r3", text: "Complete booking with payment processing", category: "functional", importance: "critical" },
      { id: "r4", text: "Virtual waiting room queue for high-demand events", category: "functional", importance: "critical" },
      { id: "r5", text: "Bot detection and mitigation", category: "functional", importance: "important" },
      { id: "r6", text: "Dynamic pricing based on demand and remaining inventory", category: "functional", importance: "nice-to-have" },
      { id: "r7", text: "No double-booking of the same seat", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Seat hold auto-releases after 10 min timeout", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Real-time seat availability updates to all clients", category: "non-functional", importance: "important" },
      { id: "r10", text: "Handle 14M+ concurrent users during popular on-sale events", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you prevent two users from booking the same seat?", category: "consistency", hint: "Distributed locks or optimistic locking", answer: "Use Redis SETNX with a 10-minute TTL to atomically claim a seat. The key is seat_{event_id}_{seat_id}. If SETNX returns 0 (key exists), the seat is taken. On payment success, persist to the SQL database. On timeout, the Redis key auto-expires and the seat becomes available again." },
      { id: "q2", question: "How does the virtual waiting room work?", category: "scale", hint: "FIFO queue with controlled admission", answer: "When traffic exceeds capacity, redirect new users to a waiting room page. Assign each user a position in a Redis-backed FIFO queue. A rate controller admits users in batches (e.g., 1000 per minute) based on system capacity. Users see their position and estimated wait time. Use a signed JWT token to prove their queue position and prevent queue jumping." },
      { id: "q3", question: "What if payment fails after seats are held?", category: "failure", hint: "Seat release on payment timeout", answer: "The seat hold has a 10-minute TTL in Redis. If payment doesn't succeed within that window, the Redis key expires and the seat is automatically released back to inventory. The client is notified to retry. If payment succeeds after the hold expired, refund immediately and ask the user to re-select." },
      { id: "q4", question: "How do you detect and block ticket bots?", category: "security", hint: "Multi-layered detection", answer: "Layer multiple defenses: CAPTCHA challenges before entering the queue, device fingerprinting to detect multiple sessions from the same device, IP rate limiting, behavioral analysis (human-like mouse movements vs. bot scripts), and purchase history analysis (flagging accounts that buy tickets in bulk for resale)." },
      { id: "q5", question: "How do you provide real-time seat availability updates?", category: "optimization", hint: "Server-Sent Events or WebSocket", answer: "Use Server-Sent Events (SSE) to push seat availability changes to connected clients. When a seat is held or released, publish an event to Redis Pub/Sub. SSE gateway servers subscribe to the event's channel and push updates to clients. Only send diffs (seat X changed from available to held) to minimize bandwidth." },
      { id: "q6", question: "How do you handle a massive traffic spike the moment tickets go on sale?", category: "scale", hint: "Pre-warming and traffic shaping", answer: "Pre-warm all caches with event data before sale starts. Activate the virtual queue 5 minutes before sale time. Use CDN for static assets (venue map, event details). Rate-limit the booking API independently of the browse API. Horizontally scale the booking service ahead of time based on pre-registered interest numbers." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/events/{eventId}/seats", description: "Get seat map with availability", response: "{ sections: [{ seatId, row, number, status, price }] }" },
      { method: "POST", path: "/api/v1/events/{eventId}/hold", description: "Hold selected seats temporarily", requestBody: "{ seatIds: string[] }", response: "{ holdId, expiresAt, totalPrice }" },
      { method: "POST", path: "/api/v1/bookings", description: "Complete booking with payment", requestBody: "{ holdId: string, paymentMethod: object }", response: "{ bookingId, confirmationCode, tickets: Ticket[] }" },
      { method: "GET", path: "/api/v1/queue/{eventId}/position", description: "Get user's position in waiting room", response: "{ position: number, estimatedWaitMinutes: number }" },
      { method: "GET", path: "/api/v1/bookings/{bookingId}", description: "Get booking details", response: "{ bookingId, event, seats, totalPrice, status }" },
    ],
    dataModel: [
      {
        name: "events",
        type: "sql",
        fields: [
          { name: "event_id", type: "uuid" },
          { name: "name", type: "string" },
          { name: "venue_id", type: "string" },
          { name: "event_date", type: "datetime" },
          { name: "sale_start", type: "datetime" },
          { name: "total_seats", type: "int" },
          { name: "available_seats", type: "int" },
          { name: "status", type: "enum", note: "upcoming, on_sale, sold_out, completed" },
        ],
        indexes: ["event_date", "status", "venue_id"],
      },
      {
        name: "seats",
        type: "sql",
        fields: [
          { name: "seat_id", type: "string", note: "Composite: event_id + section + row + number" },
          { name: "event_id", type: "string" },
          { name: "section", type: "string" },
          { name: "row", type: "string" },
          { name: "number", type: "int" },
          { name: "price", type: "decimal" },
          { name: "status", type: "enum", note: "available, held, booked" },
          { name: "version", type: "int", note: "For optimistic locking" },
        ],
        indexes: ["event_id", "status"],
      },
      {
        name: "seat_holds",
        type: "cache",
        fields: [
          { name: "seat_key", type: "string", note: "seat_{eventId}_{seatId}" },
          { name: "user_id", type: "string" },
          { name: "hold_id", type: "string" },
          { name: "ttl", type: "int", note: "600 seconds (10 minutes)" },
        ],
      },
      {
        name: "bookings",
        type: "sql",
        fields: [
          { name: "booking_id", type: "uuid" },
          { name: "user_id", type: "string" },
          { name: "event_id", type: "string" },
          { name: "seat_ids", type: "string[]" },
          { name: "total_price", type: "decimal" },
          { name: "payment_id", type: "string" },
          { name: "confirmation_code", type: "string" },
          { name: "status", type: "enum", note: "confirmed, cancelled, refunded" },
          { name: "booked_at", type: "datetime" },
        ],
        indexes: ["user_id", "event_id", "confirmation_code"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "100M DAU browsing; 14M concurrent during hot on-sale events",
      readWriteRatio: "100:1 — browsing seat maps vs actual bookings",
      storagePerItem: "~2 KB per booking; ~100 bytes per seat record; large events have 50K-100K seats",
      peakMultiplier: "100x normal traffic at the moment tickets go on sale",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. COLLABORATIVE EDITOR
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "collaborative-editor",
    requirements: [
      { id: "r1", text: "Multiple users editing the same document simultaneously", category: "functional", importance: "critical" },
      { id: "r2", text: "Real-time visibility of all participants' changes (< 200ms)", category: "functional", importance: "critical" },
      { id: "r3", text: "Conflict resolution for concurrent edits (OT or CRDTs)", category: "functional", importance: "critical" },
      { id: "r4", text: "Cursor presence (see other editors' cursor positions)", category: "functional", importance: "important" },
      { id: "r5", text: "Full version history with diff between any two versions", category: "functional", importance: "important" },
      { id: "r6", text: "Offline editing with automatic merge on reconnect", category: "functional", importance: "nice-to-have" },
      { id: "r7", text: "Rich text: formatting, tables, images, embeds", category: "functional", importance: "important" },
      { id: "r8", text: "Document-level and block-level permissions", category: "non-functional", importance: "important" },
      { id: "r9", text: "Support up to 100 concurrent editors per document", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "What's the difference between OT and CRDTs, and which would you choose?", category: "consistency", hint: "Server-centric vs peer-to-peer tradeoffs", answer: "OT (Operational Transformation) transforms operations against concurrent edits, requires a central server for ordering, and is what Google Docs uses. CRDTs (Conflict-free Replicated Data Types) converge automatically without a central coordinator, making them better for offline/P2P scenarios. OT is simpler to implement for a server-based architecture; CRDTs are more robust for offline editing." },
      { id: "q2", question: "How do you handle the collaboration server crashing?", category: "failure", hint: "Persist operations + stateless recovery", answer: "Persist every operation to a durable message queue (Kafka) before acknowledging to the client. The collaboration server is stateless — it can be restarted and rebuild document state by replaying operations from the last snapshot. Use a separate snapshot service that periodically checkpoints documents so recovery doesn't require replaying the entire operation history." },
      { id: "q3", question: "How do you store and retrieve version history efficiently?", category: "optimization", hint: "Snapshots + operation logs", answer: "Take full document snapshots every N operations (e.g., every 100 operations). Between snapshots, store individual operations. To reconstruct any version, load the nearest prior snapshot and replay operations up to the target version. This balances storage (fewer full copies) with reconstruction speed (limited replay needed)." },
      { id: "q4", question: "How do you route all operations for a document to the same server?", category: "scale", hint: "Document-to-server affinity", answer: "Use consistent hashing to assign each document to a collaboration server instance. Store the mapping in a service registry (Redis or ZooKeeper). When a user opens a document, they connect to the assigned server's WebSocket. If the server fails, re-assign the document to another server, which rebuilds state from the operation log." },
      { id: "q5", question: "How do you handle offline edits being merged after reconnection?", category: "consistency", hint: "Buffer operations and transform on sync", answer: "The client buffers operations while offline. On reconnect, it sends its buffered operations along with the last-known server version. The server transforms the client's operations against all operations that occurred since that version (OT). If using CRDTs, the merge is automatic since CRDTs guarantee convergence regardless of operation ordering." },
      { id: "q6", question: "How do you implement cursor presence without overwhelming the server?", category: "optimization", hint: "Throttle + ephemeral broadcast", answer: "Throttle cursor position updates to every 100ms per user. Broadcast cursor positions via WebSocket to only the active editors of that document (not stored in the database). Use a lightweight presence channel separate from the operation channel. Cursor data is ephemeral — if lost, the next update corrects it." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/documents/{docId}", description: "Get document content and metadata", response: "{ docId, title, content, version, collaborators, permissions }" },
      { method: "POST", path: "/api/v1/documents", description: "Create a new document", requestBody: "{ title: string, content?: string }", response: "{ docId, title, version: 0 }" },
      { method: "POST", path: "/api/v1/documents/{docId}/operations", description: "Submit an operation (via WebSocket in practice)", requestBody: "{ operation: Operation, baseVersion: number }", response: "{ version: number, transformedOp: Operation }" },
      { method: "GET", path: "/api/v1/documents/{docId}/history", description: "Get version history", response: "{ versions: [{ version, author, timestamp, summary }] }" },
      { method: "PUT", path: "/api/v1/documents/{docId}/permissions", description: "Update document sharing/permissions", requestBody: "{ userId: string, role: 'viewer'|'commenter'|'editor' }", response: "{ success: boolean }" },
    ],
    dataModel: [
      {
        name: "documents",
        type: "sql",
        fields: [
          { name: "doc_id", type: "uuid" },
          { name: "title", type: "string" },
          { name: "owner_id", type: "string" },
          { name: "current_version", type: "int" },
          { name: "content_snapshot", type: "text", note: "Latest full document content" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
        indexes: ["owner_id", "updated_at"],
      },
      {
        name: "operations",
        type: "nosql",
        fields: [
          { name: "doc_id", type: "string" },
          { name: "version", type: "int", note: "Monotonic per document" },
          { name: "user_id", type: "string" },
          { name: "operation", type: "json", note: "OT operation (insert, delete, retain)" },
          { name: "timestamp", type: "datetime" },
        ],
        partitionKey: "doc_id",
        indexes: ["version"],
      },
      {
        name: "snapshots",
        type: "nosql",
        fields: [
          { name: "doc_id", type: "string" },
          { name: "version", type: "int" },
          { name: "content", type: "text", note: "Full document content at this version" },
          { name: "created_at", type: "datetime" },
        ],
        partitionKey: "doc_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "100M DAU, average 3 documents edited per day",
      readWriteRatio: "1:5 write-heavy — real-time edits generate many operations per document view",
      storagePerItem: "~50 bytes per operation; active document generates ~1000 ops/hour with 5 editors",
      peakMultiplier: "3x during business hours (9 AM - 5 PM across timezones)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. FILE STORAGE (DROPBOX)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "file-storage",
    requirements: [
      { id: "r1", text: "Upload and download files", category: "functional", importance: "critical" },
      { id: "r2", text: "Sync files across multiple devices automatically", category: "functional", importance: "critical" },
      { id: "r3", text: "File versioning with rollback support", category: "functional", importance: "important" },
      { id: "r4", text: "Share files/folders with granular permissions", category: "functional", importance: "important" },
      { id: "r5", text: "Block-level chunking for delta sync", category: "functional", importance: "critical" },
      { id: "r6", text: "Content deduplication across users", category: "functional", importance: "important" },
      { id: "r7", text: "Resumable uploads for large files", category: "non-functional", importance: "important" },
      { id: "r8", text: "Conflict resolution for simultaneous edits on different devices", category: "non-functional", importance: "important" },
      { id: "r9", text: "Real-time sync notifications across devices", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How does delta sync work and why is it important?", category: "optimization", hint: "Block-level diff to minimize bandwidth", answer: "Split files into 4 MB blocks and hash each block. When a file changes, compute the new block list and compare hashes against the stored version. Only upload blocks with new hashes. For a 100 MB file where 1 block changed, you upload 4 MB instead of 100 MB — a 96% bandwidth reduction. Use rolling hash (Rabin fingerprint) for content-defined chunking." },
      { id: "q2", question: "How do you handle a conflict when the same file is edited on two devices offline?", category: "consistency", hint: "Conflict copies with user resolution", answer: "Detect conflicts by comparing the base version. If device A and B both edit version 5, one wins (first to sync) and the other is saved as a conflict copy (e.g., 'report (Device B's conflicted copy).docx'). Notify the user of the conflict and let them choose which version to keep. Never silently discard changes." },
      { id: "q3", question: "How do you implement cross-user deduplication?", category: "optimization", hint: "Content-addressable storage", answer: "Use content-addressable storage: the block's SHA-256 hash is its storage key. Before uploading a block, check if a block with that hash already exists. If it does, just add a reference — no upload needed. This is especially effective for common files (OS updates, popular documents). A reference count tracks when blocks can be garbage collected." },
      { id: "q4", question: "How do you notify other devices when a file changes?", category: "scale", hint: "Long polling or push notifications", answer: "Desktop clients maintain a long-polling connection to the sync service. When a file changes, the sync service publishes an event to a message queue. A notification worker pushes the change event to all connected devices of that user. Mobile devices receive push notifications via APNS/FCM. Each device then pulls the specific block list changes." },
      { id: "q5", question: "What happens if object storage goes down?", category: "failure", hint: "Replication across regions", answer: "Replicate object storage across at least 2 regions (e.g., S3 cross-region replication). Metadata is stored in a separate database with its own replication. During an outage, fail over reads to the secondary region. Writes are queued and replayed when the primary recovers. Data durability (11 nines for S3) is the highest priority." },
      { id: "q6", question: "How do you handle a user with 500,000 files in a single folder?", category: "scale", hint: "Pagination and incremental sync", answer: "Never load the entire folder listing at once. Use cursor-based pagination for API responses. For sync, maintain a server-side changelog (journal) per user. The client stores a cursor and fetches only changes since the last sync. This makes sync O(changes) instead of O(total files), even for massive folders." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/files/upload/init", description: "Initiate a chunked upload", requestBody: "{ path: string, fileSize: number, blockHashes: string[] }", response: "{ uploadId, blocksToUpload: string[] }" },
      { method: "PUT", path: "/api/v1/files/upload/{uploadId}/block/{blockHash}", description: "Upload a single block", requestBody: "Binary block data", response: "{ success: boolean }" },
      { method: "POST", path: "/api/v1/files/upload/{uploadId}/commit", description: "Commit the upload after all blocks are uploaded", response: "{ fileId, version, path }" },
      { method: "GET", path: "/api/v1/files/{fileId}/download", description: "Download a file", response: "Binary file data (streamed block-by-block)" },
      { method: "GET", path: "/api/v1/sync/changes?cursor={cursor}", description: "Get changes since last sync cursor", response: "{ changes: Change[], cursor: string, hasMore: boolean }" },
    ],
    dataModel: [
      {
        name: "files",
        type: "sql",
        fields: [
          { name: "file_id", type: "uuid" },
          { name: "user_id", type: "string" },
          { name: "path", type: "string", note: "Full path including filename" },
          { name: "is_directory", type: "boolean" },
          { name: "size_bytes", type: "bigint" },
          { name: "version", type: "int" },
          { name: "block_list", type: "string[]", note: "Ordered list of block hashes" },
          { name: "content_hash", type: "string", note: "SHA-256 of entire file" },
          { name: "updated_at", type: "datetime" },
          { name: "deleted", type: "boolean" },
        ],
        indexes: ["user_id + path (unique)", "updated_at"],
      },
      {
        name: "blocks",
        type: "nosql",
        fields: [
          { name: "block_hash", type: "string", note: "SHA-256 content hash = storage key" },
          { name: "storage_url", type: "string", note: "S3 path" },
          { name: "size_bytes", type: "int" },
          { name: "reference_count", type: "int", note: "Number of files referencing this block" },
        ],
        partitionKey: "block_hash",
      },
      {
        name: "sync_journal",
        type: "nosql",
        fields: [
          { name: "user_id", type: "string" },
          { name: "sequence_number", type: "bigint" },
          { name: "file_id", type: "string" },
          { name: "action", type: "enum", note: "create, update, delete, move" },
          { name: "timestamp", type: "datetime" },
        ],
        partitionKey: "user_id",
        indexes: ["sequence_number"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "500M DAU, average 10 file syncs/day per user",
      readWriteRatio: "1:1 — balanced between downloads and uploads/syncs",
      storagePerItem: "Average file: 1 MB; with dedup and versioning, effective storage is ~60% of raw",
      peakMultiplier: "2x during business hours; Monday mornings see highest sync volume",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. PARKING LOT
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "parking-lot",
    requirements: [
      { id: "r1", text: "Track vehicle entry and exit in real time", category: "functional", importance: "critical" },
      { id: "r2", text: "Show available spots by type (compact, regular, EV, handicapped)", category: "functional", importance: "critical" },
      { id: "r3", text: "Reservation system with time slots", category: "functional", importance: "important" },
      { id: "r4", text: "Payment processing (hourly, daily, monthly passes)", category: "functional", importance: "critical" },
      { id: "r5", text: "Dynamic pricing based on demand and occupancy", category: "functional", importance: "nice-to-have" },
      { id: "r6", text: "Automatic license plate recognition (LPR)", category: "functional", importance: "important" },
      { id: "r7", text: "Real-time availability updated within 2 seconds of entry/exit", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Prevent double-booking of reserved spots", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Multi-lot management dashboard with analytics", category: "non-functional", importance: "nice-to-have" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you handle an IoT sensor failing on a parking spot?", category: "failure", hint: "Redundancy + fallback detection", answer: "Use redundant sensors (e.g., ground sensor + overhead camera). If a sensor goes offline, mark the spot's status as 'unknown' and rely on the entry/exit gate count for total availability. Alert maintenance for repair. Keep the system functional by using gate-based counting as a fallback, even though per-spot accuracy degrades." },
      { id: "q2", question: "How do you prevent two users from reserving the same spot?", category: "consistency", hint: "Optimistic locking at commit time", answer: "Use optimistic locking with a version column on the spot reservation table. When committing a reservation, check that the version hasn't changed since the user selected the spot. If it has (another user reserved it), return an error and ask the user to select a different spot. For high-contention lots, use a Redis distributed lock with short TTL." },
      { id: "q3", question: "How does dynamic pricing work?", category: "optimization", hint: "Supply-demand signals", answer: "Calculate price multiplier based on: current occupancy percentage, time of day (peak hours), day of week, nearby events (concert, sports game), and historical demand patterns. Update prices every 5-15 minutes. Display the current rate clearly before the user enters or reserves. Cap the maximum surge multiplier for fairness." },
      { id: "q4", question: "How do you handle a payment system failure at exit?", category: "failure", hint: "Capture on exit with fallback", answer: "Pre-authorize the card at entry or reservation. At exit, capture the final amount. If the payment system is down, record the unpaid exit in a retry queue and open the gate (prioritize traffic flow). Process the charge once the payment system recovers. For monthly pass holders, verification is done locally from a cached pass database." },
      { id: "q5", question: "How do you integrate LPR (License Plate Recognition)?", category: "optimization", hint: "Camera at entry/exit + OCR pipeline", answer: "Cameras at entry and exit gates capture plate images. An OCR service (ML-based, e.g., OpenALPR) reads the plate number in under 500ms. Match against registered vehicles for automatic gate opening. Store plate + timestamp for billing. Accuracy is ~95-99%; fallback to ticket-based entry for unrecognized plates." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/lots/{lotId}/availability", description: "Get real-time spot availability", response: "{ total, available, byType: { compact, regular, ev, handicapped } }" },
      { method: "POST", path: "/api/v1/lots/{lotId}/reservations", description: "Reserve a parking spot", requestBody: "{ spotType: string, startTime: ISO8601, endTime: ISO8601, vehiclePlate?: string }", response: "{ reservationId, spotId, confirmationCode }" },
      { method: "POST", path: "/api/v1/lots/{lotId}/entry", description: "Record vehicle entry (from IoT/LPR)", requestBody: "{ licensePlate: string, gateId: string, timestamp: ISO8601 }", response: "{ sessionId, assignedSpot?, rate }" },
      { method: "POST", path: "/api/v1/sessions/{sessionId}/exit", description: "Record vehicle exit and process payment", requestBody: "{ gateId: string, timestamp: ISO8601 }", response: "{ duration, totalCharge, paymentStatus }" },
    ],
    dataModel: [
      {
        name: "parking_lots",
        type: "sql",
        fields: [
          { name: "lot_id", type: "uuid" },
          { name: "name", type: "string" },
          { name: "address", type: "string" },
          { name: "total_spots", type: "int" },
          { name: "floors", type: "int" },
          { name: "hourly_rate", type: "decimal" },
          { name: "surge_multiplier", type: "decimal" },
        ],
        indexes: ["name"],
      },
      {
        name: "spots",
        type: "sql",
        fields: [
          { name: "spot_id", type: "string", note: "lot_id + floor + zone + number" },
          { name: "lot_id", type: "string" },
          { name: "floor", type: "int" },
          { name: "zone", type: "string" },
          { name: "type", type: "enum", note: "compact, regular, handicapped, ev" },
          { name: "status", type: "enum", note: "available, occupied, reserved, maintenance" },
          { name: "sensor_status", type: "enum", note: "online, offline, unknown" },
          { name: "version", type: "int", note: "For optimistic locking" },
        ],
        indexes: ["lot_id + type + status"],
      },
      {
        name: "availability_cache",
        type: "cache",
        fields: [
          { name: "lot_id", type: "string" },
          { name: "available_compact", type: "int" },
          { name: "available_regular", type: "int" },
          { name: "available_ev", type: "int" },
          { name: "available_handicapped", type: "int" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "parking_sessions",
        type: "sql",
        fields: [
          { name: "session_id", type: "uuid" },
          { name: "lot_id", type: "string" },
          { name: "spot_id", type: "string" },
          { name: "license_plate", type: "string" },
          { name: "entry_time", type: "datetime" },
          { name: "exit_time", type: "datetime" },
          { name: "total_charge", type: "decimal" },
          { name: "payment_status", type: "enum", note: "pending, paid, failed" },
        ],
        indexes: ["lot_id", "license_plate", "entry_time"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "10M DAU, ~5M parking sessions/day across all lots",
      readWriteRatio: "5:1 — availability checks dominate over entry/exit writes",
      storagePerItem: "~500 bytes per session; 5M sessions/day = 2.5 GB/day",
      peakMultiplier: "3x during morning rush (8-9 AM) and evening rush (5-6 PM)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 16. INSTAGRAM / PHOTO SHARING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "instagram",
    requirements: [
      { id: "r1", text: "Upload photos with resizing and optional filters", category: "functional", importance: "critical" },
      { id: "r2", text: "View personalized ranked feed", category: "functional", importance: "critical" },
      { id: "r3", text: "Follow/unfollow users", category: "functional", importance: "critical" },
      { id: "r4", text: "Like, comment, and share posts", category: "functional", importance: "important" },
      { id: "r5", text: "Stories (24h ephemeral content)", category: "functional", importance: "important" },
      { id: "r6", text: "Reels (short video up to 90 seconds)", category: "functional", importance: "important" },
      { id: "r7", text: "Content moderation pipeline", category: "functional", importance: "important" },
      { id: "r8", text: "Image delivery via CDN with < 200ms latency globally", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Feed load time < 200ms at p99", category: "non-functional", importance: "critical" },
      { id: "r10", text: "Handle 100M+ photo uploads per day", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you generate a ranked feed for 500M daily active users?", category: "scale", hint: "Hybrid fan-out + ML ranking", answer: "For users following < 10K accounts, fan-out-on-write: push new post IDs to their cached feed (Redis list). For users following celebrities, fan-out-on-read: merge celebrity posts at read time. Then rank the top 500 candidate posts using an ML model scoring recency, engagement, relationship strength, and content-type preference. Return the top 50." },
      { id: "q2", question: "How does the image processing pipeline work?", category: "optimization", hint: "Async pipeline: upload → queue → workers → CDN", answer: "Upload the original to object storage and publish a processing job to a message queue. Workers generate multiple sizes (thumbnail 150px, feed 640px, full 1080px), strip EXIF metadata, apply optional filters, and upload resized versions to object storage. Update the CDN to serve the processed images. The original is kept for reprocessing if needed." },
      { id: "q3", question: "How do you handle stories that expire after 24 hours?", category: "optimization", hint: "TTL-based cleanup", answer: "Store stories with a TTL. Use Redis with ZRANGEBYSCORE to fetch active stories (timestamp > now - 24h). A background job cleans up expired story media from object storage after a grace period (e.g., 48h). Stories are stored separately from permanent posts because they have different access patterns and lifecycle." },
      { id: "q4", question: "How do you prevent inappropriate content from being published?", category: "security", hint: "Automated ML + human review pipeline", answer: "Multi-stage pipeline: (1) On upload, run ML classifiers for nudity, violence, hate speech — block obvious violations immediately. (2) For borderline content, queue for human review. (3) Post-publication, monitor user reports and re-evaluate. Use a confidence threshold: high-confidence violations are auto-removed, medium-confidence goes to human review, low-confidence passes through." },
      { id: "q5", question: "How do you handle the social graph at Instagram's scale?", category: "scale", hint: "Dedicated graph storage", answer: "Store the follow graph in a dedicated graph storage (like TAO at Facebook). Partition by user_id. For fan-out, maintain a materialized follower list (who follows this user) and following list (who this user follows). Cache hot users' follower lists in Redis. Use graph traversal for feed generation and friend suggestions." },
      { id: "q6", question: "How do you serve images globally with low latency?", category: "optimization", hint: "Multi-tier CDN strategy", answer: "Serve all images through a multi-tier CDN. Edge nodes (100+ PoPs globally) cache popular images. A mid-tier shield layer prevents thundering herd on the origin. Use different CDN cache policies by image type: profile pictures (long TTL, small size), feed images (medium TTL), stories (short TTL, high churn). Pre-warm CDN for trending/viral content." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/posts", description: "Create a new post with photo/video", requestBody: "{ mediaIds: string[], caption: string, location?: object, tags?: string[] }", response: "{ postId, mediaUrls, createdAt }" },
      { method: "GET", path: "/api/v1/feed", description: "Get personalized home feed", response: "{ posts: Post[], nextCursor: string }" },
      { method: "GET", path: "/api/v1/users/{userId}/stories", description: "Get a user's active stories", response: "{ stories: Story[] }" },
      { method: "POST", path: "/api/v1/posts/{postId}/like", description: "Like a post", response: "{ success: boolean, likeCount: number }" },
      { method: "POST", path: "/api/v1/media/upload", description: "Upload media (photo or video)", requestBody: "Multipart form data with media file", response: "{ mediaId, processingStatus }" },
    ],
    dataModel: [
      {
        name: "posts",
        type: "nosql",
        fields: [
          { name: "post_id", type: "snowflake_id" },
          { name: "user_id", type: "string" },
          { name: "caption", type: "string" },
          { name: "media_urls", type: "json", note: "{ original, thumbnail, feed, full } per image" },
          { name: "location", type: "json" },
          { name: "like_count", type: "int" },
          { name: "comment_count", type: "int" },
          { name: "created_at", type: "datetime" },
        ],
        partitionKey: "user_id",
        indexes: ["post_id", "created_at"],
      },
      {
        name: "stories",
        type: "nosql",
        fields: [
          { name: "story_id", type: "string" },
          { name: "user_id", type: "string" },
          { name: "media_url", type: "string" },
          { name: "type", type: "enum", note: "photo, video, boomerang" },
          { name: "created_at", type: "datetime" },
          { name: "expires_at", type: "datetime", note: "created_at + 24 hours" },
          { name: "view_count", type: "int" },
        ],
        partitionKey: "user_id",
      },
      {
        name: "feed_cache",
        type: "cache",
        fields: [
          { name: "user_id", type: "string" },
          { name: "post_ids", type: "string[]", note: "Pre-computed ranked feed, max 500 entries" },
          { name: "updated_at", type: "datetime" },
        ],
      },
      {
        name: "social_graph",
        type: "nosql",
        fields: [
          { name: "user_id", type: "string" },
          { name: "follower_id", type: "string" },
          { name: "followed_at", type: "datetime" },
          { name: "is_close_friend", type: "boolean" },
        ],
        partitionKey: "user_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "500M DAU, average user scrolls 30 posts/session, 100M uploads/day",
      readWriteRatio: "50:1 — feed views and media downloads vastly exceed uploads",
      storagePerItem: "Average photo: 2 MB original, ~5 MB across all sizes; 100M/day = 500 TB/day raw media",
      peakMultiplier: "3x during holidays and cultural events (New Year's Eve, festivals)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 17. MUSIC STREAMING (SPOTIFY)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "music-streaming",
    requirements: [
      { id: "r1", text: "Stream audio tracks with adaptive bitrate", category: "functional", importance: "critical" },
      { id: "r2", text: "Search tracks by title, artist, album, lyrics", category: "functional", importance: "critical" },
      { id: "r3", text: "Create, edit, and share playlists", category: "functional", importance: "important" },
      { id: "r4", text: "Personalized recommendations (Discover Weekly, daily mixes)", category: "functional", importance: "important" },
      { id: "r5", text: "Offline download with encrypted local storage", category: "functional", importance: "important" },
      { id: "r6", text: "Gapless playback with pre-buffering", category: "functional", importance: "important" },
      { id: "r7", text: "Real-time play count tracking for royalty calculations", category: "functional", importance: "critical" },
      { id: "r8", text: "Adaptive bitrate: 96/160/320 kbps based on network", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Catalog of 100M+ tracks searchable in < 200ms", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you handle millions of concurrent audio streams efficiently?", category: "scale", hint: "CDN + edge caching for popular tracks", answer: "Store audio files at multiple bitrates in object storage. Serve through a CDN with edge caching. The top 1% of tracks (popular hits) account for ~80% of streams, so CDN cache hit ratio is very high. For long-tail tracks, use an origin shield to prevent thundering herd. Pre-buffer the next track 30 seconds before the current track ends." },
      { id: "q2", question: "How do you build the recommendation engine?", category: "optimization", hint: "Collaborative filtering + content features", answer: "Combine collaborative filtering (users who listened to X also liked Y — matrix factorization on the user-track interaction matrix) with content-based features (audio analysis: tempo, energy, key, mood). Process listening events through Kafka into a batch pipeline (Spark) that recomputes recommendations daily. Serve from a precomputed cache per user." },
      { id: "q3", question: "How do you accurately track play counts for royalty payments?", category: "consistency", hint: "At-least-once delivery + dedup", answer: "The client reports a 'stream completed' event (after 30+ seconds of playback per industry standard). Events are sent to Kafka for durability. A stream processing pipeline deduplicates (using user_id + track_id + timestamp window) and aggregates play counts. Counts feed into the royalty calculation system. Accuracy is contractually required, so data integrity is paramount." },
      { id: "q4", question: "How do you implement offline download securely?", category: "security", hint: "Encrypted local storage with license checks", answer: "Downloaded tracks are encrypted with a device-specific key derived from the user's DRM license. The app checks the license validity on each playback start. Licenses expire after 30 days offline, requiring an internet connection to renew. If the subscription lapses, the license server revokes the key and downloaded tracks become unplayable." },
      { id: "q5", question: "How do you implement gapless playback?", category: "optimization", hint: "Pre-fetch + client-side audio buffer", answer: "When the current track has ~30 seconds remaining, the client requests the next track's audio data. The audio decoder prepares both tracks in memory. At the transition point, crossfade or gap-fill based on metadata (some albums have intentional gaps, others expect gapless). The server provides track boundary metadata so the client can handle both cases correctly." },
      { id: "q6", question: "How do you handle a new album release by a top artist?", category: "scale", hint: "Pre-warming and traffic management", answer: "Pre-upload and transcode the album hours before release. Push the audio files to CDN edge nodes in advance (cache warming). At release time, update the metadata database and invalidate the search cache. Stagger notifications to avoid a thundering herd — send push notifications in batches over 5-10 minutes rather than all at once." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/tracks/{trackId}/stream", description: "Get streaming URL for a track", response: "{ streamUrl: string, bitrates: number[], duration: number, cdnUrl: string }" },
      { method: "GET", path: "/api/v1/search?q={query}&type={tracks|artists|albums}", description: "Search the catalog", response: "{ tracks?: Track[], artists?: Artist[], albums?: Album[] }" },
      { method: "GET", path: "/api/v1/playlists/{playlistId}", description: "Get playlist details and tracks", response: "{ playlistId, name, tracks: Track[], followerCount }" },
      { method: "POST", path: "/api/v1/playlists", description: "Create a new playlist", requestBody: "{ name: string, trackIds?: string[], isPublic: boolean }", response: "{ playlistId, name }" },
      { method: "POST", path: "/api/v1/streams/report", description: "Report a stream event for royalty tracking", requestBody: "{ trackId, duration, bitrate, timestamp, offline: boolean }", response: "{ success: boolean }" },
    ],
    dataModel: [
      {
        name: "tracks",
        type: "nosql",
        fields: [
          { name: "track_id", type: "string" },
          { name: "title", type: "string" },
          { name: "artist_ids", type: "string[]" },
          { name: "album_id", type: "string" },
          { name: "duration_ms", type: "int" },
          { name: "audio_urls", type: "json", note: "{ 96kbps: url, 160kbps: url, 320kbps: url }" },
          { name: "genre", type: "string[]" },
          { name: "release_date", type: "date" },
          { name: "play_count", type: "bigint" },
          { name: "audio_features", type: "json", note: "tempo, energy, key, danceability for recommendations" },
        ],
        partitionKey: "track_id",
      },
      {
        name: "playlists",
        type: "nosql",
        fields: [
          { name: "playlist_id", type: "string" },
          { name: "owner_id", type: "string" },
          { name: "name", type: "string" },
          { name: "track_ids", type: "string[]" },
          { name: "is_public", type: "boolean" },
          { name: "follower_count", type: "int" },
          { name: "updated_at", type: "datetime" },
        ],
        partitionKey: "playlist_id",
      },
      {
        name: "track_search",
        type: "search",
        fields: [
          { name: "track_id", type: "string" },
          { name: "title", type: "text" },
          { name: "artist_name", type: "text" },
          { name: "album_name", type: "text" },
          { name: "lyrics", type: "text", note: "Full-text searchable" },
          { name: "genre", type: "keyword[]" },
          { name: "popularity", type: "long", note: "For relevance boosting" },
        ],
      },
      {
        name: "stream_events",
        type: "nosql",
        fields: [
          { name: "event_id", type: "string" },
          { name: "user_id", type: "string" },
          { name: "track_id", type: "string" },
          { name: "duration_ms", type: "int" },
          { name: "bitrate", type: "int" },
          { name: "timestamp", type: "datetime" },
          { name: "country", type: "string", note: "For regional royalty reporting" },
        ],
        partitionKey: "track_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "200M DAU, average 30 songs/day per user = 6B streams/day",
      readWriteRatio: "100:1 — streaming reads far exceed playlist edits and play count writes",
      storagePerItem: "Average track: 3.5 MB at 160kbps for 3 min; ~10 MB across all bitrates; 100M tracks = 1 PB",
      peakMultiplier: "3x during commute hours (7-9 AM, 5-7 PM) and new album releases",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 18. E-COMMERCE (AMAZON)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "ecommerce",
    requirements: [
      { id: "r1", text: "Product catalog with search and filters", category: "functional", importance: "critical" },
      { id: "r2", text: "Shopping cart that persists across sessions and devices", category: "functional", importance: "critical" },
      { id: "r3", text: "Order placement with payment processing", category: "functional", importance: "critical" },
      { id: "r4", text: "Real-time inventory tracking across warehouses", category: "functional", importance: "critical" },
      { id: "r5", text: "Personalized product recommendations", category: "functional", importance: "important" },
      { id: "r6", text: "Order tracking from placement to delivery", category: "functional", importance: "important" },
      { id: "r7", text: "Product reviews and ratings", category: "functional", importance: "important" },
      { id: "r8", text: "Prevent overselling during concurrent purchases", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Product search with filters in < 200ms", category: "non-functional", importance: "critical" },
      { id: "r10", text: "Handle 100x traffic spikes during flash sales (Prime Day)", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you prevent overselling when 10,000 users try to buy the last 5 items?", category: "consistency", hint: "Inventory reservation with optimistic locking", answer: "Use optimistic locking with a version number on the inventory count. At checkout, execute an atomic UPDATE inventory SET count = count - 1, version = version + 1 WHERE product_id = X AND version = Y AND count > 0. If the WHERE clause matches 0 rows, the item is sold out. For extreme concurrency, pre-partition inventory into Redis counters per warehouse." },
      { id: "q2", question: "How do you handle the shopping cart across devices?", category: "optimization", hint: "Server-side cart with merge logic", answer: "Store carts server-side in a NoSQL database (DynamoDB) keyed by user_id. Anonymous users get a session-based cart. On sign-in, merge the anonymous cart with the user's existing cart (combine items, keep higher quantity). Cart reads are served from cache with a short TTL. This ensures carts survive browser closure and work across devices." },
      { id: "q3", question: "How do you handle a flash sale with 100x normal traffic?", category: "scale", hint: "Pre-scaling + queue-based checkout", answer: "Pre-scale all services 24 hours before the sale. Use a virtual queue for the checkout flow to control concurrency. Cache product pages aggressively (CDN + app cache). Separate the browse path (read-heavy, cacheable) from the buy path (write-heavy, needs consistency). Disable non-essential features (recommendations, reviews) during peak to free up resources." },
      { id: "q4", question: "How do you build product search with faceted filtering?", category: "optimization", hint: "Elasticsearch with denormalized product data", answer: "Index products in Elasticsearch with all filterable attributes denormalized into the document (category, brand, price, rating, availability). Use Elasticsearch aggregations for faceted counts. Boost results by relevance, popularity, and availability. Cache popular search queries in Redis. For autocomplete, use the completion suggester." },
      { id: "q5", question: "How do you implement the order processing pipeline?", category: "scale", hint: "Event-driven saga pattern", answer: "Model orders as an event stream: created -> payment_authorized -> inventory_reserved -> warehouse_assigned -> picked -> packed -> shipped -> delivered. Each step is a separate service consuming events from a message queue. Failed steps trigger compensating actions (release inventory, void payment). This decouples services and provides full order auditability." },
      { id: "q6", question: "How do you handle returns and refunds?", category: "consistency", hint: "Reverse flow through the pipeline", answer: "A return request triggers a reverse saga: verify return eligibility -> generate return label -> receive item at warehouse -> quality inspection -> restock inventory -> process refund. Each step updates the order status. Refunds use the same idempotent payment system. Inventory is only restocked after quality check passes." },
    ],
    referenceAPIs: [
      { method: "GET", path: "/api/v1/products/search?q={query}&filters={filters}", description: "Search products with filters", response: "{ products: Product[], facets: Facet[], totalResults: number }" },
      { method: "GET", path: "/api/v1/products/{productId}", description: "Get product details", response: "{ productId, name, price, variants, reviews, availability }" },
      { method: "POST", path: "/api/v1/cart/items", description: "Add item to cart", requestBody: "{ productId: string, variantId: string, quantity: number }", response: "{ cartId, items: CartItem[], total }" },
      { method: "POST", path: "/api/v1/orders", description: "Place an order from cart", requestBody: "{ cartId: string, shippingAddress: object, paymentMethod: object }", response: "{ orderId, status, estimatedDelivery }" },
      { method: "GET", path: "/api/v1/orders/{orderId}/tracking", description: "Get order tracking info", response: "{ orderId, status, timeline: Event[], trackingNumber }" },
    ],
    dataModel: [
      {
        name: "products",
        type: "nosql",
        fields: [
          { name: "product_id", type: "string" },
          { name: "name", type: "string" },
          { name: "description", type: "text" },
          { name: "category", type: "string" },
          { name: "brand", type: "string" },
          { name: "price", type: "decimal" },
          { name: "variants", type: "json", note: "Size, color, etc. with per-variant pricing" },
          { name: "image_urls", type: "string[]" },
          { name: "avg_rating", type: "decimal" },
          { name: "review_count", type: "int" },
          { name: "seller_id", type: "string" },
        ],
        partitionKey: "product_id",
      },
      {
        name: "inventory",
        type: "sql",
        fields: [
          { name: "product_id", type: "string" },
          { name: "warehouse_id", type: "string" },
          { name: "variant_id", type: "string" },
          { name: "quantity", type: "int" },
          { name: "reserved", type: "int", note: "Held for pending orders" },
          { name: "version", type: "int", note: "For optimistic locking" },
        ],
        indexes: ["product_id + warehouse_id + variant_id (unique)"],
      },
      {
        name: "orders",
        type: "sql",
        fields: [
          { name: "order_id", type: "uuid" },
          { name: "user_id", type: "string" },
          { name: "items", type: "json", note: "Snapshot of items, prices, quantities at order time" },
          { name: "total_amount", type: "decimal" },
          { name: "status", type: "enum", note: "placed, paid, processing, shipped, delivered, returned" },
          { name: "shipping_address", type: "json" },
          { name: "payment_id", type: "string" },
          { name: "created_at", type: "datetime" },
        ],
        indexes: ["user_id", "status", "created_at"],
      },
      {
        name: "carts",
        type: "nosql",
        fields: [
          { name: "user_id", type: "string" },
          { name: "items", type: "json", note: "[{ productId, variantId, quantity, price }]" },
          { name: "updated_at", type: "datetime" },
        ],
        partitionKey: "user_id",
      },
    ],
    estimationHints: {
      dailyActiveUsers: "300M DAU, ~50M orders/day, 200M+ product searches/day",
      readWriteRatio: "100:1 — product browsing and search vastly exceed order placement",
      storagePerItem: "~5 KB per product, ~2 KB per order; 100M products = 500 GB catalog",
      peakMultiplier: "100x during Prime Day / Black Friday flash sales",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 19. TEAM MESSAGING (SLACK)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "team-messaging",
    requirements: [
      { id: "r1", text: "Real-time messaging in channels and DMs", category: "functional", importance: "critical" },
      { id: "r2", text: "Workspace isolation (multi-tenant data security)", category: "functional", importance: "critical" },
      { id: "r3", text: "Threaded conversations with reply counts", category: "functional", importance: "important" },
      { id: "r4", text: "Full-text search across all workspace messages", category: "functional", importance: "important" },
      { id: "r5", text: "File sharing with preview generation", category: "functional", importance: "important" },
      { id: "r6", text: "Integration framework (bots, webhooks, slash commands)", category: "functional", importance: "important" },
      { id: "r7", text: "Channel types: public, private, DM, group DM", category: "functional", importance: "critical" },
      { id: "r8", text: "Message delivery in real time via WebSocket", category: "non-functional", importance: "critical" },
      { id: "r9", text: "Offline message queuing for disconnected clients", category: "non-functional", importance: "important" },
      { id: "r10", text: "Search across billions of messages in < 500ms", category: "non-functional", importance: "important" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you ensure workspace data isolation in a multi-tenant system?", category: "security", hint: "Tenant-scoped data access at every layer", answer: "Every database query includes a workspace_id in the WHERE clause. Partition the search index by workspace_id. Use workspace-scoped auth tokens that are validated at the API gateway. Row-level security in the database as a defense-in-depth measure. Encrypt data at rest per workspace with distinct keys for compliance-sensitive customers." },
      { id: "q2", question: "How do you build full-text search across billions of messages?", category: "scale", hint: "Elasticsearch partitioned by workspace", answer: "Index messages in Elasticsearch, partitioned by workspace_id for tenant isolation. Index asynchronously via a message queue to avoid slowing down message sends. Support rich query syntax: 'from:alice in:#engineering has:file after:2025-01-01'. Use per-workspace result limits and relevance scoring based on recency and channel membership." },
      { id: "q3", question: "How do you deliver a message to 10,000 members of a large channel?", category: "scale", hint: "Pub/Sub with connection registry", answer: "When a message is sent to a channel, publish it to a Redis Pub/Sub topic for that channel. Each WebSocket gateway server subscribes to topics for its connected users' channels. The gateway pushes the message to all locally connected members. Users not currently connected receive the message on next sync. This avoids iterating over all 10K members in the app server." },
      { id: "q4", question: "How do you implement threaded conversations?", category: "optimization", hint: "Parent-child message relationship", answer: "Store a thread_id (parent message ID) on reply messages. Maintain a thread metadata record with reply_count, last_reply_at, and participant_ids. When loading a channel, show thread previews (reply count + latest reply) without loading full threads. Fetch full thread content on demand when the user clicks 'View thread'. Index threads separately for thread-specific search." },
      { id: "q5", question: "How do you handle the integration framework (bots, webhooks)?", category: "optimization", hint: "Event-driven with app-scoped permissions", answer: "Expose a webhook URL per integration. When events occur (message posted, reaction added, user joined), publish events to a message queue. Integration workers deliver events to registered webhook URLs. Slash commands route through the API gateway to the registered handler URL. Each integration has scoped permissions (which channels it can read/write) and rate limits." },
      { id: "q6", question: "What happens when a WebSocket gateway server goes down?", category: "failure", hint: "Stateless gateway + reconnect protocol", answer: "WebSocket gateways are stateless: connection-to-user mappings are stored in Redis. When a gateway dies, connected clients detect the broken socket and reconnect to another gateway via the load balancer. The new gateway registers the connection in Redis. The client sends its last-seen message sequence number, and the server replays any missed messages from the message store." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/workspaces/{workspaceId}/channels/{channelId}/messages", description: "Send a message to a channel", requestBody: "{ text: string, threadId?: string, attachments?: string[] }", response: "{ messageId, timestamp, sequenceNumber }" },
      { method: "GET", path: "/api/v1/workspaces/{workspaceId}/channels/{channelId}/messages", description: "Get channel message history", response: "{ messages: Message[], hasMore: boolean }" },
      { method: "GET", path: "/api/v1/workspaces/{workspaceId}/search?q={query}", description: "Search messages in workspace", response: "{ messages: Message[], totalResults: number }" },
      { method: "POST", path: "/api/v1/workspaces/{workspaceId}/channels", description: "Create a channel", requestBody: "{ name: string, type: 'public'|'private', description?: string }", response: "{ channelId, name, type }" },
      { method: "POST", path: "/api/v1/workspaces/{workspaceId}/integrations", description: "Register a new integration", requestBody: "{ name, webhookUrl, events: string[], permissions: string[] }", response: "{ integrationId, token }" },
    ],
    dataModel: [
      {
        name: "messages",
        type: "nosql",
        fields: [
          { name: "workspace_id", type: "string" },
          { name: "channel_id", type: "string" },
          { name: "message_id", type: "string" },
          { name: "sequence_number", type: "bigint", note: "Per-channel monotonic" },
          { name: "user_id", type: "string" },
          { name: "text", type: "string" },
          { name: "thread_id", type: "string", note: "Null if top-level message" },
          { name: "attachments", type: "json" },
          { name: "reactions", type: "json", note: "{ emoji: [userId, ...] }" },
          { name: "edited_at", type: "datetime" },
          { name: "created_at", type: "datetime" },
        ],
        partitionKey: "workspace_id + channel_id",
        indexes: ["sequence_number", "thread_id"],
      },
      {
        name: "channels",
        type: "sql",
        fields: [
          { name: "channel_id", type: "uuid" },
          { name: "workspace_id", type: "string" },
          { name: "name", type: "string" },
          { name: "type", type: "enum", note: "public, private, dm, group_dm" },
          { name: "description", type: "string" },
          { name: "member_count", type: "int" },
          { name: "created_at", type: "datetime" },
          { name: "last_message_at", type: "datetime" },
        ],
        indexes: ["workspace_id + name (unique)", "workspace_id + type"],
      },
      {
        name: "message_search",
        type: "search",
        fields: [
          { name: "message_id", type: "string" },
          { name: "workspace_id", type: "keyword", note: "Mandatory filter for tenant isolation" },
          { name: "channel_id", type: "keyword" },
          { name: "user_id", type: "keyword" },
          { name: "text", type: "text" },
          { name: "has_attachment", type: "boolean" },
          { name: "created_at", type: "date" },
        ],
      },
      {
        name: "connection_registry",
        type: "cache",
        fields: [
          { name: "user_id", type: "string" },
          { name: "gateway_server_id", type: "string" },
          { name: "workspace_id", type: "string" },
          { name: "subscribed_channels", type: "string[]" },
          { name: "connected_at", type: "datetime" },
        ],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "100M DAU across millions of workspaces, ~50 messages sent/day per user",
      readWriteRatio: "5:1 — reading message history and search exceed message sends",
      storagePerItem: "~500 bytes per message; 5B messages/day = 2.5 TB/day",
      peakMultiplier: "3x during business hours (9 AM - 12 PM across US and EU timezones)",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 20. METRICS / MONITORING SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    problemId: "metrics-monitoring",
    requirements: [
      { id: "r1", text: "Ingest time-series metrics from thousands of servers", category: "functional", importance: "critical" },
      { id: "r2", text: "Flexible query language with aggregations (avg, sum, percentiles, rate)", category: "functional", importance: "critical" },
      { id: "r3", text: "Real-time dashboards with auto-refresh", category: "functional", importance: "important" },
      { id: "r4", text: "Alerting engine with threshold and anomaly detection", category: "functional", importance: "critical" },
      { id: "r5", text: "Alert routing with escalation policies and on-call schedules", category: "functional", importance: "important" },
      { id: "r6", text: "Automatic downsampling (raw -> 1min -> 1hour)", category: "functional", importance: "important" },
      { id: "r7", text: "Ingest 500K+ data points per second", category: "non-functional", importance: "critical" },
      { id: "r8", text: "Tag-based metric organization with high-cardinality support", category: "non-functional", importance: "important" },
      { id: "r9", text: "Query response < 100ms for recent data (last 1 hour)", category: "non-functional", importance: "critical" },
    ],
    followUpQuestions: [
      { id: "q1", question: "How do you store time-series data efficiently?", category: "optimization", hint: "Column-oriented storage + compression", answer: "Use a time-series database optimized for append-heavy, time-ordered data. Partition by metric name + time range (e.g., 1-hour chunks). Within each chunk, use delta-of-delta encoding for timestamps (saves 80%+) and XOR encoding for values (saves 50%+ for slowly-changing metrics). This is the approach used by Gorilla (Facebook) and achieves 12:1 compression ratios." },
      { id: "q2", question: "How does the alerting pipeline work without missing alerts?", category: "failure", hint: "Separate evaluation from ingestion", answer: "Run an independent alert evaluation service that queries recent data every 15-60 seconds per rule. Decouple alerting from ingestion so ingestion lag doesn't affect alerting. Use a state machine per alert rule: OK -> PENDING (threshold breached once) -> FIRING (breached for configurable duration) -> RESOLVED. Persist alert state so it survives service restarts." },
      { id: "q3", question: "How do you handle high-cardinality tags?", category: "scale", hint: "Inverted index + cardinality limits", answer: "Maintain an inverted index mapping tag values to metric series IDs for fast lookups. Set cardinality limits per tag (e.g., max 10K unique values) to prevent combinatorial explosion. For high-cardinality dimensions like request_id, recommend using logs/traces instead of metrics. Monitor and alert on tag cardinality to prevent runaway growth." },
      { id: "q4", question: "How does the downsampling pipeline work?", category: "optimization", hint: "Background aggregation with retention policies", answer: "A scheduled job reads raw metrics older than 7 days, computes per-minute aggregates (avg, min, max, sum, count), writes them to a separate 1-minute resolution table, and marks the raw data for deletion. At 30 days, repeat for 1-hour resolution. This reduces storage by ~100x for historical data while preserving statistical accuracy. Queries automatically route to the appropriate resolution based on the time range." },
      { id: "q5", question: "How do you ensure alerts don't create noise (alert fatigue)?", category: "optimization", hint: "Grouping, dedup, and routing", answer: "Group related alerts (e.g., all instances of the same service) into a single notification. Require a configurable 'for' duration (e.g., 5 minutes) before firing to filter transient spikes. Implement escalation policies: page on-call after 5 minutes, escalate to team lead after 15, escalate to manager after 30. Support silencing and maintenance windows." },
      { id: "q6", question: "How do you handle a monitoring system outage — who monitors the monitor?", category: "failure", hint: "Self-monitoring + external watchdog", answer: "The monitoring system monitors itself (meta-monitoring) with dedicated health checks. Additionally, use a simple external watchdog service (even a cron job on a separate machine) that pings the monitoring system and alerts via a completely separate channel (e.g., PagerDuty direct integration) if it's unreachable. The watchdog must have zero dependencies on the main monitoring stack." },
    ],
    referenceAPIs: [
      { method: "POST", path: "/api/v1/metrics/ingest", description: "Ingest a batch of metric data points", requestBody: "{ dataPoints: [{ metric: string, value: number, timestamp: number, tags: object }] }", response: "{ accepted: number, rejected: number }" },
      { method: "GET", path: "/api/v1/metrics/query", description: "Query metrics with aggregations", response: "{ series: [{ metric, tags, datapoints: [timestamp, value][] }] }" },
      { method: "POST", path: "/api/v1/alerts/rules", description: "Create an alert rule", requestBody: "{ name, query: string, condition: string, forDuration: string, severity: string, notifyChannels: string[] }", response: "{ ruleId, status: 'active' }" },
      { method: "GET", path: "/api/v1/alerts/active", description: "List currently firing alerts", response: "{ alerts: [{ ruleId, status, firedAt, metric, value }] }" },
      { method: "GET", path: "/api/v1/dashboards/{dashboardId}", description: "Get dashboard layout and widget queries", response: "{ dashboardId, name, widgets: Widget[] }" },
    ],
    dataModel: [
      {
        name: "metric_data",
        type: "nosql",
        fields: [
          { name: "metric_name", type: "string" },
          { name: "tags", type: "json", note: "{ host: 'web-01', region: 'us-east-1', ... }" },
          { name: "timestamp", type: "bigint", note: "Unix epoch milliseconds" },
          { name: "value", type: "double" },
          { name: "resolution", type: "enum", note: "raw, 1min, 1hour" },
        ],
        partitionKey: "metric_name + time_bucket",
      },
      {
        name: "alert_rules",
        type: "sql",
        fields: [
          { name: "rule_id", type: "uuid" },
          { name: "name", type: "string" },
          { name: "query", type: "string", note: "Metric query expression" },
          { name: "condition", type: "string", note: "e.g., '> 90' or 'anomaly'" },
          { name: "for_duration", type: "string", note: "e.g., '5m' — must be true for this long" },
          { name: "severity", type: "enum", note: "critical, warning, info" },
          { name: "notify_channels", type: "string[]", note: "Slack, PagerDuty, email" },
          { name: "state", type: "enum", note: "ok, pending, firing, resolved" },
          { name: "last_evaluated_at", type: "datetime" },
        ],
        indexes: ["state", "severity"],
      },
      {
        name: "tag_index",
        type: "nosql",
        fields: [
          { name: "tag_key", type: "string" },
          { name: "tag_value", type: "string" },
          { name: "series_ids", type: "string[]", note: "Inverted index: tag value -> matching series" },
          { name: "cardinality", type: "int", note: "Number of unique values for this tag key" },
        ],
        partitionKey: "tag_key",
      },
      {
        name: "dashboards",
        type: "sql",
        fields: [
          { name: "dashboard_id", type: "uuid" },
          { name: "name", type: "string" },
          { name: "owner_id", type: "string" },
          { name: "widgets", type: "json", note: "Layout + query definition per widget" },
          { name: "refresh_interval", type: "int", note: "Auto-refresh in seconds" },
          { name: "created_at", type: "datetime" },
          { name: "updated_at", type: "datetime" },
        ],
        indexes: ["owner_id"],
      },
    ],
    estimationHints: {
      dailyActiveUsers: "N/A — infrastructure service; ingests from 100K+ hosts, ~500K data points/sec",
      readWriteRatio: "1:10 write-heavy — continuous metric ingestion dominates dashboard queries",
      storagePerItem: "~16 bytes per data point (8 timestamp + 8 value); 500K/sec = 43B/day = ~690 GB/day raw",
      peakMultiplier: "2x during deployments and incident investigations (more dashboards open, more queries)",
    },
  },
];

export function getInterviewData(problemId: string): ProblemInterviewData | undefined {
  return INTERVIEW_DATA.find((d) => d.problemId === problemId);
}
