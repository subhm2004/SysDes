"use client";

import { useCallback, useEffect, useMemo, useRef, type DragEvent } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes/nodeTypes";
import { edgeTypes } from "./edges/edgeTypes";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { usePenStore } from "@/store/penStore";
import { getComponentById } from "@/data/components";
import { BookOpen, GraduationCap, Layers, MousePointer2, Sparkles } from "lucide-react";
import { CanvasTabBar } from "./CanvasTabBar";
import { PenOverlay } from "./PenOverlay";
import { PenToolbar } from "./PenToolbar";
import { STUDIO_COPY } from "@/lib/studio-copy";

/** Studio canvas: nodes and edges are native `@xyflow/react` `Node` / `Edge` values from the store. */

interface DesignCanvasProps {
  onPickProblem?: () => void;
  onLoadReference?: () => void;
  onStartInterview?: () => void;
  onOpenShortcuts?: () => void;
}

export function DesignCanvas({
  onPickProblem,
  onLoadReference,
  onStartInterview,
  onOpenShortcuts,
}: DesignCanvasProps = {}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode);
  const setSelectedEdge = useCanvasStore((s) => s.setSelectedEdge);
  const penMode = usePenStore((s) => s.mode);
  const penActive = penMode !== "off";

  // Listen for text node edits and persist them to the store
  useEffect(() => {
    function handleTextNodeUpdate(e: Event) {
      const { id, text } = (e as CustomEvent).detail;
      updateNodeData(id, { text } as Record<string, unknown>);
    }
    window.addEventListener("textnode:update", handleTextNodeUpdate);
    return () => window.removeEventListener("textnode:update", handleTextNodeUpdate);
  }, [updateNodeData]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const componentId = event.dataTransfer.getData(
        "application/sysdes-component"
      );
      if (!componentId) return;

      const component = getComponentById(componentId);
      if (!component) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<ComponentNodeData> = {
        id: `${componentId}-${crypto.randomUUID()}`,
        type: "component",
        position,
        data: {
          componentId: component.id,
          label: component.label,
          icon: component.icon,
          category: component.category,
          replicas: 1,
          maxQPS: component.maxQPS,
          latencyMs: component.latencyMs,
          scalable: component.scalable,
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge.id);
    },
    [setSelectedEdge]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  const miniMapNodeColor = useMemo(
    () => (node: Node) => {
      const data = node.data as ComponentNodeData;
      const status = data.status as string;
      if (status === "critical") return "#ef4444";
      if (status === "warning") return "#f59e0b";
      if (status === "healthy") return "#10b981";
      return "#52525b";
    },
    []
  );

  const isEmpty = nodes.length === 0;

  return (
    <div ref={reactFlowWrapper} className="relative flex-1 flex flex-col">
      <CanvasTabBar onOpenShortcuts={onOpenShortcuts} />
      <div className="relative flex-1">
      <ReactFlow
        className="h-full w-full bg-zinc-100 dark:bg-zinc-950"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "animated" }}
        fitView
        proOptions={{ hideAttribution: true }}
        panOnDrag={!penActive}
        zoomOnScroll={!penActive}
        zoomOnPinch={!penActive}
        nodesDraggable={!penActive}
        nodesConnectable={!penActive}
        elementsSelectable={!penActive}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(120, 120, 128, 0.45)"
          className="!bg-zinc-100 dark:!bg-zinc-950"
        />
        <Controls
          className="!rounded-md !border !border-zinc-200 !bg-white !shadow-sm dark:!border-zinc-800 dark:!bg-zinc-900 [&>button]:!border-zinc-200 [&>button]:!bg-white [&>button]:!text-zinc-600 [&>button:hover]:!bg-zinc-100 [&>button:hover]:!text-zinc-900 dark:[&>button]:!border-zinc-800 dark:[&>button]:!bg-zinc-900 dark:[&>button]:!text-zinc-400 dark:[&>button:hover]:!bg-zinc-800 dark:[&>button:hover]:!text-zinc-200"
          position="bottom-left"
        />
        <MiniMap
          className="!hidden !rounded-md !border !border-zinc-200 !bg-zinc-100 md:!block dark:!border-zinc-800 dark:!bg-zinc-900"
          maskColor="rgba(24, 24, 27, 0.2)"
          nodeColor={miniMapNodeColor}
          position="bottom-right"
          style={{ width: 140, height: 90 }}
        />
      </ReactFlow>

        <PenOverlay />
        <PenToolbar />
      </div>

      {/* Welcome / empty state */}
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 pb-4 md:pb-0">
          <div className="pointer-events-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-transparent shadow-[0_0_40px_-10px_rgba(124,92,252,0.38)] dark:border-cyan-400/20 dark:from-cyan-500/12 dark:shadow-[0_0_40px_-10px_rgba(167,139,250,0.28)] sm:h-[4.25rem] sm:w-[4.25rem]">
              <Layers className="h-7 w-7 text-cyan-600 dark:text-cyan-400 sm:h-8 sm:w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {STUDIO_COPY.canvas.empty.title}
              </h1>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
                {STUDIO_COPY.canvas.empty.subtitle}
              </p>
            </div>

            <div className="grid w-full gap-2.5 sm:grid-cols-3">
              <QuickStartCard
                icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />}
                title={STUDIO_COPY.canvas.quickStart.pickProblem.title}
                hint={STUDIO_COPY.canvas.quickStart.pickProblem.hint}
                onClick={onPickProblem}
              />
              <QuickStartCard
                icon={<Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />}
                title={STUDIO_COPY.canvas.quickStart.loadReference.title}
                hint={STUDIO_COPY.canvas.quickStart.loadReference.hint}
                onClick={onLoadReference}
              />
              <QuickStartCard
                icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />}
                title={STUDIO_COPY.canvas.quickStart.interview.title}
                hint={STUDIO_COPY.canvas.quickStart.interview.hint}
                onClick={onStartInterview}
                accent
              />
            </div>

            <div className="hidden flex-wrap items-center justify-center gap-3 text-sm text-zinc-600 md:flex dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <MousePointer2 className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-500" />
                {STUDIO_COPY.canvas.hints.dragSidebar}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">·</span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-800">⌘E</kbd>
                {STUDIO_COPY.canvas.hints.export}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">·</span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-800">⌘↵</kbd>
                {STUDIO_COPY.canvas.hints.simulate}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickStartCard({
  icon,
  title,
  hint,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  onClick?: () => void;
  accent?: boolean;
}) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-start gap-2 rounded-xl border bg-white/80 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-900 sm:p-4 ${
        accent
          ? "border-cyan-500/35 hover:border-cyan-400/55 hover:shadow-[0_0_24px_-8px_rgba(124,92,252,0.45)] dark:border-cyan-400/30 dark:hover:border-cyan-400/50 dark:hover:shadow-[0_0_24px_-8px_rgba(167,139,250,0.35)]"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
          accent ? "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400" : "bg-zinc-200 text-zinc-600 group-hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-100">{title}</span>
      <span className="text-xs leading-snug text-zinc-600 sm:text-sm dark:text-zinc-400">{hint}</span>
    </button>
  );
}
