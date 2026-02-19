import type { Node, Edge } from "@xyflow/react";
import type { ComponentNodeData } from "@/store/canvasStore";
import type { CategoryScore } from "@/types/scoring";

export function scoreScalability(
  nodes: Node<ComponentNodeData>[],
  edges: Edge[]
): CategoryScore {
  const feedback: string[] = [];
  const passed: string[] = [];
  let score = 0;

  const componentIds = nodes.map((n) => n.data.componentId);
  const hasLB = componentIds.includes("load-balancer");
  const hasCache = componentIds.includes("cache");
  const hasQueue = componentIds.includes("message-queue");
  const hasCDN = componentIds.includes("cdn");
  const hasScalableCompute = nodes.some(
    (n) => n.data.category === "compute" && n.data.scalable
  );
  const hasDBScaling =
    nodes.some(
      (n) =>
        (n.data.componentId === "nosql-db" || n.data.componentId === "sql-db") &&
        (n.data.replicas || 1) > 1
    );

  // Check load balancer (3 pts)
  if (hasLB) {
    score += 3;
    passed.push("Load balancer distributes traffic across servers, enabling horizontal scaling");
  } else {
    feedback.push(
      "Add a Load Balancer (e.g., AWS ALB, Nginx) to distribute traffic across multiple servers. Without one, a single server handles all requests and becomes a bottleneck — you can't scale horizontally."
    );
  }

  // Check horizontal scaling (3 pts)
  if (hasScalableCompute) {
    score += 3;
    passed.push("Horizontally scalable compute layer allows adding capacity on demand");
  } else {
    feedback.push(
      "Add stateless App Servers that can scale horizontally behind the load balancer. Stateless servers let you spin up new instances in seconds during traffic spikes, handling 10x load by simply adding more machines."
    );
  }

  // Check caching (3 pts)
  if (hasCache) {
    score += 3;
    passed.push("Caching layer (Redis/Memcached) absorbs read traffic and reduces backend load");
  } else {
    feedback.push(
      "Add a caching layer (Redis/Memcached) between your App Servers and Database. This can reduce DB load by 80-90% for read-heavy workloads by serving frequently accessed data from memory (~1ms) instead of disk (~5-10ms)."
    );
  }

  // Check async processing (3 pts)
  if (hasQueue) {
    score += 3;
    passed.push("Message queue enables async processing and absorbs traffic spikes");
  } else {
    feedback.push(
      "Add a Message Queue (Kafka, SQS, RabbitMQ) for asynchronous processing. Queues decouple producers from consumers, letting you buffer traffic spikes and process heavy tasks (email, transcoding, analytics) in the background without blocking user requests."
    );
  }

  // Check DB read scaling (3 pts)
  if (hasDBScaling) {
    score += 3;
    passed.push("Database layer supports read scaling via NoSQL or read replicas");
  } else {
    feedback.push(
      "Scale your database layer — use a NoSQL database (DynamoDB, Cassandra) for automatic horizontal scaling, or add SQL read replicas to distribute query load. A single SQL primary becomes a bottleneck beyond ~10K QPS."
    );
  }

  // Check CDN for static content offloading (3 pts)
  if (hasCDN) {
    score += 3;
    passed.push("CDN offloads static content delivery from origin servers");
  } else {
    feedback.push(
      "Add a CDN (CloudFront, Cloudflare) to offload static content delivery from your origin servers. CDNs serve cached content from 200+ edge locations worldwide, reducing origin load by 60-80% and cutting latency for global users from 200ms+ to under 20ms."
    );
  }

  // Check LB→compute connectivity (2 pts)
  const lbToCompute = hasLB && hasScalableCompute && edges.some(
    (e) => {
      const sourceNode = nodes.find((n) => n.id === e.source);
      const targetNode = nodes.find((n) => n.id === e.target);
      return (
        sourceNode?.data.componentId === "load-balancer" &&
        targetNode?.data.category === "compute"
      ) || (
        // LB → gateway → compute also counts
        sourceNode?.data.componentId === "load-balancer" &&
        (targetNode?.data.componentId === "api-gateway" || targetNode?.data.componentId === "rate-limiter")
      );
    }
  );
  if (lbToCompute) {
    score += 2;
    passed.push("Load balancer is properly connected to compute layer");
  } else if (hasLB && hasScalableCompute) {
    feedback.push(
      "Connect your Load Balancer to your App Servers (directly or via an API Gateway). Without this connection, the LB can't distribute traffic to your compute layer — it's like having a highway on-ramp that leads nowhere."
    );
  }

  return { category: "Scalability", score, maxScore: 20, feedback, passed };
}
