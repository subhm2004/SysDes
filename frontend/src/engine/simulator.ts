import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { NodeMetrics, NodeStatus, SimulationResult } from "@/types/simulation";
import {
  UTILIZATION_WARNING,
  UTILIZATION_CRITICAL,
  LATENCY_SPIKE_THRESHOLD,
  LATENCY_SPIKE_MULTIPLIER,
} from "./constants";

/** Component IDs that split (load-balance) traffic across children. */
const LOAD_BALANCING_COMPONENTS = new Set(["load-balancer", "api-gateway"]);

function getStatus(utilization: number): NodeStatus {
  if (utilization > UTILIZATION_CRITICAL) return "critical";
  if (utilization > UTILIZATION_WARNING) return "warning";
  return "healthy";
}

function computeLatency(baseLatency: number, utilization: number): number {
  if (utilization > LATENCY_SPIKE_THRESHOLD) {
    return baseLatency * (1 + Math.max(0, utilization - LATENCY_SPIKE_THRESHOLD) * LATENCY_SPIKE_MULTIPLIER);
  }
  return baseLatency;
}

export function runSimulation(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[],
  requestsPerSec: number
): SimulationResult {
  const warnings: string[] = [];
  const nodeMetrics = new Map<string, NodeMetrics>();
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Build adjacency list and in-degree map
  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  // Find entry nodes (no inbound edges)
  const entryNodes = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);

  // Initialize incoming QPS for entry nodes
  const incomingQPS = new Map<string, number>();
  const qpsPerEntry = entryNodes.length > 0 ? requestsPerSec / entryNodes.length : 0;
  for (const entry of entryNodes) {
    incomingQPS.set(entry.id, qpsPerEntry);
  }

  // Build node lookup map for O(1) access
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // --- Kahn's algorithm for topological-order QPS propagation ---
  // Clone inDegree so we can decrement without corrupting the original
  const remaining = new Map(inDegree);
  const queue: string[] = [];
  const bottleneckNodes: string[] = [];
  const processed = new Set<string>();

  // Seed queue with all zero-indegree nodes
  for (const entry of entryNodes) {
    queue.push(entry.id);
  }

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const data = node.data;
    const incoming = incomingQPS.get(nodeId) ?? 0;
    const replicas = data.replicas ?? 1; // Fix #6: nullish coalescing
    const effectiveQPS = data.maxQPS * replicas;
    // Fix #9: guard against 0/0 NaN
    const utilization = effectiveQPS === 0 || effectiveQPS === Infinity
      ? 0
      : incoming / effectiveQPS;
    const latency = computeLatency(data.latencyMs, utilization);
    const status = getStatus(utilization);
    const isBottleneck = utilization > UTILIZATION_CRITICAL;

    if (isBottleneck) bottleneckNodes.push(nodeId);

    nodeMetrics.set(nodeId, {
      nodeId,
      incomingQPS: incoming,
      effectiveQPS,
      utilization: Math.min(utilization, 2), // cap at 200% for display
      latencyMs: latency,
      status,
      isBottleneck,
    });

    // Propagate to children
    const children = adjacency.get(nodeId) ?? [];
    // Output QPS is capped by effective capacity
    const outputQPS = Math.min(incoming, effectiveQPS);

    // Fix #2: load-balancers split traffic, everything else fans out
    const isSplitter = LOAD_BALANCING_COMPONENTS.has(data.componentId);

    for (const childId of children) {
      const qpsToChild = isSplitter && children.length > 0
        ? outputQPS / children.length
        : outputQPS; // fan-out: full traffic to each child
      const existing = incomingQPS.get(childId) ?? 0;
      incomingQPS.set(childId, existing + qpsToChild);

      // Decrement in-degree; enqueue when all predecessors processed
      const newDeg = (remaining.get(childId) ?? 1) - 1;
      remaining.set(childId, newDeg);
      if (newDeg === 0) {
        queue.push(childId);
      }
    }
  }

  // Fix #8: Detect cycles — nodes with remaining inDegree > 0 that weren't processed
  const cycleNodes: string[] = [];
  for (const node of nodes) {
    if (!processed.has(node.id) && (inDegree.get(node.id) ?? 0) > 0) {
      cycleNodes.push(node.id);
    }
  }

  if (cycleNodes.length > 0) {
    warnings.push(
      `Cycle detected involving node(s): ${cycleNodes.join(", ")}. Processing with accumulated QPS.`
    );
    // Process cycle nodes with whatever QPS they've accumulated
    for (const nodeId of cycleNodes) {
      if (nodeMetrics.has(nodeId)) continue;
      const node = nodeMap.get(nodeId);
      if (!node) continue;

      const data = node.data;
      const incoming = incomingQPS.get(nodeId) ?? 0;
      const replicas = data.replicas ?? 1;
      const effectiveQPS = data.maxQPS * replicas;
      const utilization = effectiveQPS === 0 || effectiveQPS === Infinity
        ? 0
        : incoming / effectiveQPS;
      const latency = computeLatency(data.latencyMs, utilization);
      const status = getStatus(utilization);
      const isBottleneck = utilization > UTILIZATION_CRITICAL;

      if (isBottleneck) bottleneckNodes.push(nodeId);

      nodeMetrics.set(nodeId, {
        nodeId,
        incomingQPS: incoming,
        effectiveQPS,
        utilization: Math.min(utilization, 2),
        latencyMs: latency,
        status,
        isBottleneck,
      });
    }
  }

  // Fix #7: Disconnected/idle nodes get their base latency, not 0
  for (const node of nodes) {
    if (!nodeMetrics.has(node.id)) {
      const replicas = node.data.replicas ?? 1;
      nodeMetrics.set(node.id, {
        nodeId: node.id,
        incomingQPS: 0,
        effectiveQPS: node.data.maxQPS * replicas,
        utilization: 0,
        latencyMs: node.data.latencyMs, // base latency, not 0
        status: "idle",
        isBottleneck: false,
      });
    }
  }

  // Fix #4: Pass adjacency/inDegree to avoid rebuilding
  const totalLatencyMs = computeLongestPathLatency(nodes, adjacency, inDegree, nodeMetrics);

  // Fix #5: If no nodes, throughput = 0
  const throughput = nodes.length === 0
    ? 0
    : bottleneckNodes.length > 0
      ? Math.min(...bottleneckNodes.map((id) => nodeMetrics.get(id)!.effectiveQPS))
      : requestsPerSec;

  return {
    nodeMetrics,
    totalLatencyMs,
    bottleneckNodes,
    throughput,
    timestamp: Date.now(),
    warnings,
  };
}

// Fix #3 & #4: Use topological sort (Kahn's), accept adjacency/inDegree as params
function computeLongestPathLatency(
  nodes: Node<ComponentNodeData>[],
  adjacency: Map<string, string[]>,
  inDegree: Map<string, number>,
  metrics: Map<string, NodeMetrics>
): number {
  if (nodes.length === 0) return 0;

  // Clone inDegree so we can decrement
  const remaining = new Map(inDegree);

  const dist = new Map<string, number>();
  const entryNodes = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);

  for (const entry of entryNodes) {
    dist.set(entry.id, metrics.get(entry.id)?.latencyMs ?? 0);
  }

  // Kahn's algorithm for longest-path
  const queue = [...entryNodes.map((n) => n.id)];
  const processed = new Set<string>();

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);

    const currentDist = dist.get(nodeId) ?? 0;
    const children = adjacency.get(nodeId) ?? [];

    for (const childId of children) {
      const childLatency = metrics.get(childId)?.latencyMs ?? 0;
      const newDist = currentDist + childLatency;
      if (newDist > (dist.get(childId) ?? 0)) {
        dist.set(childId, newDist);
      }

      // Decrement in-degree; enqueue only when all predecessors are processed
      const newDeg = (remaining.get(childId) ?? 1) - 1;
      remaining.set(childId, newDeg);
      if (newDeg === 0) {
        queue.push(childId);
      }
    }
  }

  return Math.max(0, ...dist.values());
}
