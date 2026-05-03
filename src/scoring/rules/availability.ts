import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreAvailability(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);

  // Check no single point of failure (3 pts)
  const scalableNodes = nodes.filter((n) => n.data.scalable || (n.data.replicas || 1) > 1);
  const noSpof = scalableNodes.length >= Math.floor(nodes.length * 0.7);
  if (noSpof && nodes.length > 0) {
    score += 3;
    passed.push("At least 70% of components are scalable or redundant, minimizing single points of failure");
  } else {
    feedback.push(
      "Too many single points of failure — over 30% of your components can't scale or failover. Most components on the critical path should be redundant. Use scalable components (App Server, Cache, NoSQL) and add replicas to stateful ones to target 99.9%+ availability."
    );
  }

  // Check DB redundancy (3 pts)
  const hasReplicatedStorage = nodes.some(
    (n) => n.data.category === "storage" && (n.data.replicas || 1) > 1
  );
  if (hasReplicatedStorage) {
    score += 3;
    passed.push("Database replication provides real redundancy — failover to replica if primary goes down");
  } else {
    feedback.push(
      "Add database replication (replicas > 1) to at least one storage component. Having multiple different storage types (e.g., Redis + PostgreSQL) isn't redundancy — if PostgreSQL goes down, Redis can't replace it. True redundancy means replicas of the same data store ready to take over on failure."
    );
  }

  // Check multi-path (3 pts)
  const entryComponents = ["load-balancer", "api-gateway", "cdn"];
  const entryNodes = nodes.filter((n) => entryComponents.includes(n.data.componentId));
  const entryWithMultipleDownstream = entryNodes.some((entry) => {
    const downstreamTargets = edges.filter((e) => e.source === entry.id);
    return downstreamTargets.length >= 2;
  });
  const componentTypeCounts = new Map<string, number>();
  for (const n of nodes) {
    const cid = n.data.componentId;
    componentTypeCounts.set(cid, (componentTypeCounts.get(cid) ?? 0) + 1);
  }
  const hasRedundantInstances = Array.from(componentTypeCounts.values()).some((count) => count >= 2);
  const hasMultiPath = entryWithMultipleDownstream || hasRedundantInstances;
  if (hasMultiPath && nodes.length > 2) {
    score += 3;
    passed.push("Redundant paths exist — entry points fan out to multiple targets or duplicate instances provide failover");
  } else {
    feedback.push(
      "Add redundant data paths to avoid cascading failures. Entry-point components (load balancer, API gateway, CDN) should fan out to multiple downstream targets, or use multiple instances of the same component type for failover. A single chain (A→B→C→D) means any link failure takes down the entire system."
    );
  }

  // Check monitoring (3 pts)
  if (componentIds.includes("monitoring")) {
    score += 3;
    passed.push("Monitoring enables fast incident detection and reduces Mean Time To Recovery (MTTR)");
  } else {
    feedback.push(
      "Add a Monitoring stack (Prometheus/Grafana, CloudWatch, Datadog) for alerting and observability. Without monitoring, outages go undetected until users complain — increasing MTTR from minutes to hours. You can't improve what you can't measure."
    );
  }

  // Check rate limiter or API gateway for overload protection (3 pts)
  const hasOverloadProtection =
    componentIds.includes("rate-limiter") || componentIds.includes("api-gateway");
  if (hasOverloadProtection) {
    score += 3;
    passed.push("Rate limiting / API gateway protects backend from traffic surges and abuse");
  } else {
    feedback.push(
      "Add a Rate Limiter or API Gateway to protect your backend from traffic surges and DDoS attacks. Without overload protection, a sudden traffic spike (or malicious attack) can cascade through your entire system and cause a full outage."
    );
  }

  // Check cache for graceful degradation (3 pts)
  const hasCache = componentIds.includes("cache");
  const hasDB = componentIds.includes("sql-db") || componentIds.includes("nosql-db");
  if (hasCache && hasDB) {
    score += 3;
    passed.push("Cache enables graceful degradation — serves stale data if database becomes unavailable");
  } else if (hasDB && !hasCache) {
    feedback.push(
      "Add a Cache layer (Redis/Memcached) in front of your database. Beyond performance, caching enables graceful degradation: if your DB goes down, the cache can continue serving recent data while you recover, keeping the system partially available."
    );
  }

  // Check queue for resilience (2 pts)
  if (componentIds.includes("message-queue")) {
    score += 2;
    passed.push("Message queue buffers requests during downstream outages, preventing data loss");
  } else {
    feedback.push(
      "Add a Message Queue (Kafka, SQS) to buffer requests during downstream outages. If a consumer service goes down, messages are retained in the queue and processed when it recovers — no data loss, no user-facing errors for async operations."
    );
  }

  return { category: "Availability", score, maxScore: 20, feedback, passed };
}
