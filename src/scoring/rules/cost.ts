import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreCost(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);

  // Not over-provisioned (3 pts) — total component count reasonable
  if (nodes.length >= 3 && nodes.length <= 25) {
    score += 3;
    passed.push("Appropriate number of components (" + nodes.length + ") — not over-engineered or under-provisioned");
  } else if (nodes.length < 3) {
    score += 1;
    feedback.push(
      "System has only " + nodes.length + " component(s) — this is under-provisioned for any real workload. A minimal production system needs at least DNS → Load Balancer → App Server → Database. Add the missing layers."
    );
  } else if (nodes.length <= 35) {
    score += 1;
    feedback.push(
      "System has " + nodes.length + " components — this is getting complex. Each component adds operational cost (hosting, monitoring, on-call burden). Verify each component serves a distinct, necessary purpose."
    );
  } else {
    feedback.push(
      "System has " + nodes.length + " components — this is likely over-engineered. Each component adds operational cost (hosting, monitoring, on-call burden). Over-engineering a simple problem is as costly as under-engineering a complex one. Consider consolidating."
    );
  }

  // Appropriate storage choice (3 pts)
  const storageNodes = nodes.filter((n) => n.data.category === "storage");
  if (storageNodes.length >= 1 && storageNodes.length <= 5) {
    score += 3;
    passed.push("Appropriate number of storage components — each serves a distinct purpose");
  } else if (storageNodes.length === 0) {
    feedback.push(
      "No storage components in your design — where is data persisted? Every system needs at least one database. Without persistent storage, you lose all data on restart."
    );
  } else {
    feedback.push(
      "You have " + storageNodes.length + " storage components — consider consolidating. Each storage system requires backups, monitoring, and operational expertise. Use the minimum number of distinct stores that satisfy your access patterns."
    );
  }

  // Caching reduces DB load = cost savings (3 pts)
  const hasCache = nodes.some((n) => n.data.componentId === "cache");
  const hasDB = nodes.some(
    (n) => n.data.componentId === "sql-db" || n.data.componentId === "nosql-db"
  );
  if (hasCache && hasDB) {
    score += 3;
    passed.push("Cache reduces expensive database queries — a $50/mo Redis instance can save $500/mo in DB scaling costs");
  } else if (hasDB && !hasCache) {
    feedback.push(
      "Add a Cache (Redis/Memcached) to reduce database load and cost. Databases are one of the most expensive components to scale. A cache costing $50-100/month can handle reads that would otherwise require a $500+/month larger DB instance."
    );
  }
  // No cache or no DB = 0 points for this check (cache cost savings only apply when both exist)

  // No disconnected nodes (3 pts)
  const connectedNodes = new Set<string>();
  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }
  const disconnected = nodes.filter((n) => !connectedNodes.has(n.id));
  if (disconnected.length === 0) {
    score += 3;
    passed.push("All components are connected — no wasted resources sitting idle");
  } else {
    feedback.push(
      `${disconnected.length} disconnected component(s) are not connected to anything — they're costing money without providing value. Either connect them to your architecture or remove them. Idle infrastructure is pure waste.`
    );
  }

  // CDN offloads origin traffic (3 pts)
  const hasCDN = componentIds.includes("cdn");
  if (hasCDN) {
    score += 3;
    passed.push("CDN offloads traffic from origin servers, reducing compute and bandwidth costs significantly");
  } else {
    feedback.push(
      "Add a CDN to offload static content delivery from your origin servers. CDN bandwidth costs $0.01-0.08/GB vs $0.09-0.12/GB for origin egress. For a media-heavy service serving 100TB/month, a CDN can save $4,000-8,000/month in bandwidth alone."
    );
  }

  // Async processing avoids over-provisioning compute (3 pts)
  const hasQueue = componentIds.includes("message-queue");
  if (hasQueue) {
    score += 3;
    passed.push("Message queue enables right-sizing compute — process background tasks at lower priority instead of provisioning for peak");
  } else {
    feedback.push(
      "Add a Message Queue for background processing. Without async offloading, you must provision your App Servers for peak load including background tasks. With a queue, you can run cheaper, smaller worker instances that process tasks at their own pace."
    );
  }

  // Efficient architecture — not duplicating functionality (2 pts)
  const hasApiGw = componentIds.includes("api-gateway");
  const hasRateLimiter = componentIds.includes("rate-limiter");
  const hasServiceMesh = componentIds.includes("service-mesh");
  const duplicateNetworking = hasApiGw && hasRateLimiter && hasServiceMesh;
  if (!duplicateNetworking) {
    score += 2;
    passed.push("No excessive duplication of networking functionality");
  } else {
    feedback.push(
      "You have an API Gateway, Rate Limiter, and Service Mesh — some functionality overlaps. API Gateways often include rate limiting built-in. Consider whether you need all three or if consolidating would reduce complexity and cost."
    );
  }

  return { category: "Cost Efficiency", score, maxScore: 20, feedback, passed };
}
