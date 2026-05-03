import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import { getComponentById } from "@/data/components";
import type { CanvasAiOperation } from "@/lib/ai/canvasOps";

export interface ComponentNodeData {
  componentId: string;
  label: string;
  icon: string;
  category: string;
  replicas: number;
  maxQPS: number;
  latencyMs: number;
  scalable: boolean;
  utilization?: number;
  status?: string;
  isBottleneck?: boolean;
  // ReactFlow v12 requires an index signature on custom node data types
  [key: string]: unknown;
}

export interface TextNodeData {
  text: string;
  fontSize?: "sm" | "base" | "lg";
  [key: string]: unknown;
}

export interface CustomEdgeData {
  label?: string;
  protocol?: 'http' | 'grpc' | 'websocket' | 'pubsub' | 'tcp' | 'custom';
  async?: boolean;
  [key: string]: unknown;
}

export interface CanvasTab {
  id: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
  readOnly?: boolean;
}

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Tab system
  tabs: CanvasTab[];
  activeTabId: string;
  addTab: (tab: CanvasTab) => void;
  switchTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  renameTab: (tabId: string, label: string) => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<ComponentNodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<CustomEdgeData>) => void;
  updateAllNodeData: (
    updates: Map<string, Partial<ComponentNodeData>>
  ) => void;
  clearCanvas: () => void;
  deleteNode: (nodeId: string) => void;
  /** Apply AI-suggested canvas edits (skips when active tab is read-only). */
  applyAiOperations: (operations: CanvasAiOperation[]) => { warnings: string[] };
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, _get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,

      // Tab system — "my-design" is the default tab
      tabs: [{ id: "my-design", label: "My Design", nodes: [], edges: [] }],
      activeTabId: "my-design",

      addTab: (tab) => {
        set((state) => {
          // Save current tab state before switching
          const updatedTabs = state.tabs.map((t) =>
            t.id === state.activeTabId ? { ...t, nodes: state.nodes, edges: state.edges } : t
          );
          // Check if tab already exists (reuse it)
          const existing = updatedTabs.find((t) => t.id === tab.id);
          if (existing) {
            return {
              tabs: updatedTabs.map((t) => (t.id === tab.id ? { ...t, ...tab } : t)),
              activeTabId: tab.id,
              nodes: tab.nodes,
              edges: tab.edges,
              selectedNodeId: null,
              selectedEdgeId: null,
            };
          }
          return {
            tabs: [...updatedTabs, tab],
            activeTabId: tab.id,
            nodes: tab.nodes,
            edges: tab.edges,
            selectedNodeId: null,
            selectedEdgeId: null,
          };
        });
      },

      switchTab: (tabId) => {
        set((state) => {
          const target = state.tabs.find((t) => t.id === tabId);
          if (!target || tabId === state.activeTabId) return state;
          // Save current tab state
          const updatedTabs = state.tabs.map((t) =>
            t.id === state.activeTabId ? { ...t, nodes: state.nodes, edges: state.edges } : t
          );
          return {
            tabs: updatedTabs,
            activeTabId: tabId,
            nodes: target.nodes,
            edges: target.edges,
            selectedNodeId: null,
            selectedEdgeId: null,
          };
        });
      },

      closeTab: (tabId) => {
        set((state) => {
          if (tabId === "my-design") return state; // Can't close the main tab
          const remaining = state.tabs.filter((t) => t.id !== tabId);
          if (state.activeTabId === tabId) {
            // Switch to my-design tab
            const myDesign = remaining.find((t) => t.id === "my-design") ?? remaining[0];
            return {
              tabs: remaining,
              activeTabId: myDesign.id,
              nodes: myDesign.nodes,
              edges: myDesign.edges,
              selectedNodeId: null,
              selectedEdgeId: null,
            };
          }
          return { tabs: remaining };
        });
      },

      renameTab: (tabId, label) => {
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, label } : t)),
        }));
      },

      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as Node[],
        }));
      },
      onEdgesChange: (changes) => {
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
      },
      onConnect: (connection) => {
        if (!connection.source || !connection.target) return;
        if (connection.source === connection.target) return;
        set((state) => {
          const exists = state.edges.some(
            (e) => e.source === connection.source && e.target === connection.target
          );
          if (exists) return state;
          return {
            edges: addEdge(
              {
                ...connection,
                type: "animated",
                data: { label: "", protocol: "http", async: false } satisfies CustomEdgeData,
              },
              state.edges
            ),
          };
        });
      },
      addNode: (node) => {
        set((state) => ({ nodes: [...state.nodes, node] }));
      },
      setSelectedNode: (id) => {
        set({ selectedNodeId: id, selectedEdgeId: null });
      },
      setSelectedEdge: (id) => {
        set({ selectedEdgeId: id, selectedNodeId: null });
      },
      updateNodeData: (nodeId, data) => {
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        }));
      },
      updateEdgeData: (edgeId, data) => {
        set((state) => ({
          edges: state.edges.map((e) =>
            e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e
          ),
        }));
      },
      updateAllNodeData: (updates) => {
        set((state) => ({
          nodes: state.nodes.map((n) => {
            const update = updates.get(n.id);
            return update ? { ...n, data: { ...n.data, ...update } } : n;
          }),
        }));
      },
      clearCanvas: () => {
        set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null });
      },
      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        }));
      },

      applyAiOperations: (operations) => {
        const warnings: string[] = [];
        set((state) => {
          const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
          if (activeTab?.readOnly) {
            warnings.push("This tab is read-only; switch to “My Design” to edit.");
            return state;
          }

          let nodes = [...state.nodes];
          let edges = [...state.edges];

          const findByLabel = (label: string) => {
            const q = label.trim().toLowerCase();
            if (!q) return undefined;
            return nodes.find((n) => {
              if (n.type === "component") {
                const d = n.data as ComponentNodeData;
                return (
                  d.label.toLowerCase().includes(q) ||
                  d.componentId.toLowerCase() === q ||
                  d.componentId.toLowerCase().includes(q)
                );
              }
              if (n.type === "text") {
                const d = n.data as TextNodeData;
                const t = String(d.text ?? "");
                return t.toLowerCase().includes(q);
              }
              return false;
            });
          };

          for (const operation of operations) {
            switch (operation.op) {
              case "clear_canvas":
                nodes = [];
                edges = [];
                break;
              case "add_component": {
                const comp = getComponentById(operation.componentId);
                if (!comp) {
                  warnings.push(`Unknown componentId: ${operation.componentId}`);
                  break;
                }
                const nx = operation.x ?? 100 + (nodes.filter((n) => n.type === "component").length % 6) * 72;
                const ny = operation.y ?? 80 + Math.floor(nodes.filter((n) => n.type === "component").length / 6) * 110;
                const id = `${comp.id}-${crypto.randomUUID()}`;
                nodes.push({
                  id,
                  type: "component",
                  position: { x: nx, y: ny },
                  data: {
                    componentId: comp.id,
                    label: comp.label,
                    icon: comp.icon,
                    category: comp.category,
                    replicas: 1,
                    maxQPS: comp.maxQPS,
                    latencyMs: comp.latencyMs,
                    scalable: comp.scalable,
                  },
                });
                break;
              }
              case "add_text": {
                const id = `text-${crypto.randomUUID()}`;
                nodes.push({
                  id,
                  type: "text",
                  position: { x: operation.x ?? 140, y: operation.y ?? 160 },
                  data: { text: operation.text },
                  connectable: false,
                });
                break;
              }
              case "connect": {
                const s = findByLabel(operation.sourceLabel);
                const t = findByLabel(operation.targetLabel);
                if (!s || !t) {
                  warnings.push(
                    `Could not connect “${operation.sourceLabel}” → “${operation.targetLabel}” (node not found).`
                  );
                  break;
                }
                if (s.type === "text" || t.type === "text") {
                  warnings.push("Connect only between component nodes, not text notes.");
                  break;
                }
                if (s.id === t.id) break;
                if (edges.some((e) => e.source === s.id && e.target === t.id)) break;
                edges.push({
                  id: `e-${s.id}-${t.id}-${Date.now()}`,
                  source: s.id,
                  target: t.id,
                  type: "animated",
                  data: { label: "", protocol: "http", async: false } satisfies CustomEdgeData,
                });
                break;
              }
              case "remove_node": {
                const n = findByLabel(operation.label);
                if (!n) {
                  warnings.push(`No node matched: ${operation.label}`);
                  break;
                }
                nodes = nodes.filter((x) => x.id !== n.id);
                edges = edges.filter((e) => e.source !== n.id && e.target !== n.id);
                break;
              }
              default: {
                const _exhaustive: never = operation;
                warnings.push(`Unsupported op: ${JSON.stringify(_exhaustive)}`);
              }
            }
          }

          const tabs = state.tabs.map((t) =>
            t.id === state.activeTabId ? { ...t, nodes, edges } : t
          );

          return {
            nodes,
            edges,
            tabs,
            selectedNodeId: null,
            selectedEdgeId: null,
          };
        });
        return { warnings };
      },
    }),
    {
      name: "sysdes-canvas",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);
