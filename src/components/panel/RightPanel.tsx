"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Info,
  Trash2,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  BookOpen,
  Target,
  AlertTriangle,
  MessageCircle,
  Layers,
  Play,
  ClipboardCheck,
  SlidersHorizontal,
  Gauge,
  Scale,
} from "lucide-react";
import { useCanvasStore, type ComponentNodeData, type CustomEdgeData } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import { getProblemById } from "@/data/problems";
import { getConceptByComponentId } from "@/data/conceptLibrary";
import { SimulationControls } from "./SimulationControls";
import { MetricsDisplay } from "./MetricsDisplay";
import { ScoreReport } from "./ScoreReport";
import { CapacityCalculator } from "./CapacityCalculator";
import { TradeoffLog } from "./TradeoffLog";
import { TradeoffCards } from "./TradeoffCards";
import { useInterviewStore } from "@/store/interviewStore";
import { InterviewPhasePanel } from "@/components/interview/InterviewPhasePanel";
import { STUDIO_COPY } from "@/lib/studio-copy";

interface RightPanelProps {
  open?: boolean;
  onSimulate: () => void;
  variant?: "desktop" | "mobile";
}

function RightTabs({ onSimulate }: { onSimulate: () => void }) {
  const activeRightTab = useAppStore((s) => s.activeRightTab);
  const setActiveRightTab = useAppStore((s) => s.setActiveRightTab);

  return (
    <Tabs value={activeRightTab} onValueChange={(v) => setActiveRightTab(v as typeof activeRightTab)} className="flex flex-1 flex-col min-h-0">
      <div className="mx-2 mt-2 shrink-0 overflow-x-auto">
        <TabsList className="h-auto min-h-10 w-max gap-0.5 bg-zinc-200 p-1 dark:bg-zinc-800">
          <TabsTrigger
            value="properties"
            className="h-9 gap-1 px-3 text-base font-sans text-zinc-600 after:bg-cyan-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:after:bg-cyan-400 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-cyan-600 opacity-90 dark:text-cyan-400" strokeWidth={2.25} aria-hidden />
            {STUDIO_COPY.rightPanel.tabs.properties}
          </TabsTrigger>
          <TabsTrigger
            value="simulation"
            className="h-9 gap-1 px-3 text-base font-sans text-zinc-600 after:bg-cyan-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:after:bg-cyan-400 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
          >
            <Play className="h-4 w-4 shrink-0 translate-x-[0.5px] text-cyan-600 opacity-90 dark:text-cyan-400" strokeWidth={2.5} aria-hidden />
            {STUDIO_COPY.rightPanel.tabs.simulation}
          </TabsTrigger>
          <TabsTrigger
            value="score"
            className="h-9 gap-1 px-3 text-base font-sans text-zinc-600 after:bg-cyan-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:after:bg-cyan-400 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
          >
            <ClipboardCheck className="h-4 w-4 shrink-0 text-cyan-600 opacity-90 dark:text-cyan-400" strokeWidth={2.25} aria-hidden />
            {STUDIO_COPY.rightPanel.tabs.score}
          </TabsTrigger>
          <TabsTrigger
            value="capacity"
            className="h-9 gap-1 px-3 text-base font-sans text-zinc-600 after:bg-cyan-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:after:bg-cyan-400 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
          >
            <Gauge className="h-4 w-4 shrink-0 text-cyan-600 opacity-90 dark:text-cyan-400" strokeWidth={2.25} aria-hidden />
            {STUDIO_COPY.rightPanel.tabs.capacity}
          </TabsTrigger>
          <TabsTrigger
            value="tradeoffs"
            className="h-9 gap-1 px-3 text-base font-sans text-zinc-600 after:bg-cyan-600 data-[state=active]:bg-white data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:after:bg-cyan-400 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
          >
            <Scale className="h-4 w-4 shrink-0 text-cyan-600 opacity-90 dark:text-cyan-400" strokeWidth={2.25} aria-hidden />
            {STUDIO_COPY.rightPanel.tabs.tradeoffs}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="properties" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <PropertiesTab />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="simulation" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            <SimulationControls onSimulate={onSimulate} />
            <Separator className="bg-border" />
            <MetricsDisplay />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="score" className="mt-0 flex-1 overflow-hidden">
        <div className="h-full p-4">
          <ScoreReport />
        </div>
      </TabsContent>

      <TabsContent value="capacity" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <CapacityCalculator />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="tradeoffs" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            <TradeoffLog />
            <Separator className="bg-border" />
            <TradeoffCards />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

export function RightPanel({ open = true, onSimulate, variant = "desktop" }: RightPanelProps) {
  const interviewMode = useInterviewStore((s) => s.mode);
  const currentPhase = useInterviewStore((s) => s.currentPhase);

  // During interview mode, show phase panel for all phases except phase 4 (HLD)
  const showInterviewPhasePanel = interviewMode === "interview" && currentPhase !== 4;

  if (variant === "mobile") {
    return (
      <div className="flex h-full w-full flex-col bg-zinc-50 dark:bg-zinc-900">
        {showInterviewPhasePanel ? <InterviewPhasePanel /> : <RightTabs onSimulate={onSimulate} />}
      </div>
    );
  }

  return (
    <aside
      className={`hidden shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-zinc-50 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 md:flex ${
        open ? "w-[320px] opacity-100" : "w-0 border-l-0 opacity-0"
      }`}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      {showInterviewPhasePanel ? (
        <InterviewPhasePanel />
      ) : (
        <div className="flex min-h-0 w-[320px] flex-1 flex-col">
          <RightTabs onSimulate={onSimulate} />
        </div>
      )}
    </aside>
  );
}

function EdgePropertiesPanel() {
  const selectedEdgeId = useCanvasStore((s) => s.selectedEdgeId);
  const edges = useCanvasStore((s) => s.edges);
  const updateEdgeData = useCanvasStore((s) => s.updateEdgeData);

  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);
  if (!selectedEdge) return null;

  const data = (selectedEdge.data ?? {}) as CustomEdgeData;
  const protocols: CustomEdgeData["protocol"][] = ["http", "grpc", "websocket", "pubsub", "tcp", "custom"];

  return (
    <div className="space-y-3">
      <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        Edge Properties
      </p>

      <div className="space-y-2">
        {/* Label */}
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Label</label>
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(e) => updateEdgeData(selectedEdge.id, { label: e.target.value })}
            placeholder="e.g. /api/users"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/50"
          />
        </div>

        {/* Protocol */}
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Protocol</label>
          <select
            value={data.protocol ?? "http"}
            onChange={(e) => updateEdgeData(selectedEdge.id, { protocol: e.target.value as CustomEdgeData["protocol"] })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/50"
          >
            {protocols.map((p) => (
              <option key={p} value={p}>
                {p === "http" ? "HTTP" : p === "grpc" ? "gRPC" : p === "websocket" ? "WebSocket" : p === "pubsub" ? "pub/sub" : p === "tcp" ? "TCP" : "Custom"}
              </option>
            ))}
          </select>
        </div>

        {/* Sync / Async toggle */}
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Communication</label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateEdgeData(selectedEdge.id, { async: false })}
              className={`flex-1 rounded-md border px-2.5 py-2 text-sm font-medium transition-colors ${
                !data.async
                  ? "border-cyan-500/35 bg-cyan-600/15 text-cyan-700 dark:text-cyan-400"
                  : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Sync
            </button>
            <button
              type="button"
              onClick={() => updateEdgeData(selectedEdge.id, { async: true })}
              className={`flex-1 rounded-md border px-2.5 py-2 text-sm font-medium transition-colors ${
                data.async
                  ? "border-cyan-500/35 bg-cyan-600/15 text-cyan-700 dark:text-cyan-400"
                  : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Async
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.async ? "Dashed line — asynchronous (e.g. message queue)" : "Solid line — synchronous (e.g. HTTP call)"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PropertiesTab() {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId);
  const selectedEdgeId = useCanvasStore((s) => s.selectedEdgeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) as
    | (typeof nodes[number] & { data: ComponentNodeData })
    | undefined;
  const problem = getProblemById(selectedProblemId);

  return (
    <div className="space-y-4">
      {/* Problem requirements */}
      {problem && (
        <div className="space-y-2.5">
          <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            {STUDIO_COPY.rightPanel.requirementsTitle(problem.title)}
          </p>
          <div className="space-y-2">
            {[
              { label: "Reads/sec", value: new Intl.NumberFormat("en-US").format(problem.requirements.readsPerSec) },
              { label: "Writes/sec", value: new Intl.NumberFormat("en-US").format(problem.requirements.writesPerSec) },
              { label: "Storage", value: `${new Intl.NumberFormat("en-US").format(problem.requirements.storageGB)} GB` },
              { label: "Latency SLA", value: `< ${problem.requirements.latencyMs}ms` },
              { label: "Users", value: problem.requirements.users },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="font-mono text-sm tabular-nums text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem && problem.constraints.length > 0 && (
        <>
          <Separator className="bg-border" />
          <ConstraintsSection constraints={problem.constraints} />
        </>
      )}

      {/* Hints */}
      {problem && problem.hints.length > 0 && (
        <>
          <Separator className="bg-border" />
          <HintsSection hints={problem.hints} />
        </>
      )}

      <Separator className="bg-border" />

      {/* Selected node properties */}
      {selectedNode && selectedNode.type === "text" ? (
        <div className="space-y-3">
          <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            Text Annotation
          </p>
          <div className="space-y-2">
            <div className="rounded-md border border-border bg-card px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">Text Note</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Double-click on canvas to edit</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full gap-1.5 border-border text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove Note
            </Button>
          </div>
        </div>
      ) : selectedNode ? (
        (() => {
          const data = selectedNode.data as ComponentNodeData;
          return (
        <div className="space-y-3">
          <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            Component Properties
          </p>

          <div className="space-y-2">
            <div className="rounded-md border border-border bg-card px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">{data.label as string}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {data.category as string} · Max{" "}
                {(data.maxQPS as number) === Infinity
                  ? "\u221e"
                  : new Intl.NumberFormat("en-US").format(data.maxQPS as number)}{" "}
                QPS
              </p>
            </div>

            {/* Replicas slider */}
            {data.scalable && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Replicas</label>
                  <span className="font-mono text-sm tabular-nums text-cyan-600 dark:text-cyan-400">
                    {data.replicas as number}
                  </span>
                </div>
                <Slider
                  aria-label="Replicas"
                  value={[data.replicas as number]}
                  onValueChange={(v) =>
                    updateNodeData(selectedNode.id, { replicas: Array.isArray(v) ? v[0] : v })
                  }
                  min={1}
                  max={20}
                  step={1}
                  className=""
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Effective capacity: {(data.maxQPS as number) === Infinity ? "\u221e" : new Intl.NumberFormat("en-US").format((data.maxQPS as number) * (data.replicas as number))} QPS
                </p>
              </div>
            )}

            {/* Info */}
            <div className="space-y-1">
              {[
                { label: "Base Latency", value: `${data.latencyMs}ms` },
                { label: "Scalable", value: data.scalable ? "Yes" : "No" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full gap-1.5 border-border text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <Trash2 className="h-3 w-3" />
              Remove Component
            </Button>
          </div>

          <Separator className="bg-border" />
          <LearnSection componentId={data.componentId as string} label={data.label as string} />
        </div>
          );
        })()
      ) : selectedEdgeId ? (
        <EdgePropertiesPanel />
      ) : (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
            <Info className="h-5 w-5 text-cyan-600/80 dark:text-cyan-400/90" />
          </div>
          <div className="max-w-[16rem]">
            <p className="text-sm font-semibold text-foreground">No component selected</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Click a component or edge on the canvas to edit its properties.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConstraintsSection({ constraints }: { constraints: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? constraints : constraints.slice(0, 3);

  return (
    <div className="space-y-2">
      <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        {STUDIO_COPY.rightPanel.sections.constraints}
      </p>
      <div className="space-y-2">
        {shown.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm leading-relaxed text-muted-foreground">{c}</span>
          </div>
        ))}
      </div>
      {constraints.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          {expanded ? (
            <>
              <ChevronDown className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              Show {constraints.length - 3} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

function HintsSection({ hints }: { hints: { title: string; content: string }[] }) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());

  const toggleHint = (index: number) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        {STUDIO_COPY.rightPanel.sections.hints}
      </p>
      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => toggleHint(i)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
            >
              <Lightbulb className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">{hint.title}</span>
              {expandedHints.has(i) ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
            {expandedHints.has(i) && (
              <div className="border-t border-border px-3 py-2.5">
                <p className="text-sm leading-relaxed text-muted-foreground">{hint.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LearnSection({ componentId, label }: { componentId: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const concept = getConceptByComponentId(componentId);

  if (!concept) return null;

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const sections = [
    {
      key: "whenToUse",
      label: "When to use",
      icon: Target,
      items: concept.whenToUse,
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-400/10",
      borderAccent: "border-emerald-500/30",
    },
    {
      key: "tradeoffs",
      label: "Trade-offs",
      icon: AlertTriangle,
      items: concept.keyTradeoffs,
      accent: "text-amber-400",
      bgAccent: "bg-amber-400/10",
      borderAccent: "border-amber-500/30",
    },
    {
      key: "interviewTips",
      label: "Interview tips",
      icon: MessageCircle,
      items: concept.interviewTips,
      accent: "text-cyan-400",
      bgAccent: "bg-cyan-400/10",
      borderAccent: "border-cyan-500/30",
    },
    {
      key: "patterns",
      label: "Common patterns",
      icon: Layers,
      items: concept.commonPatterns.map((p) => p.name),
      accent: "text-cyan-400",
      bgAccent: "bg-cyan-400/10",
      borderAccent: "border-cyan-500/30",
    },
  ];

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2.5 text-left transition-colors hover:bg-muted"
      >
        <BookOpen className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
        <span className="flex-1 text-sm font-medium text-foreground">Learn about {label}</span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-1.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = activeSection === section.key;
            return (
              <div
                key={section.key}
                className={`overflow-hidden rounded-md border transition-colors ${
                  isOpen
                    ? `${section.borderAccent} bg-card`
                    : "border-border/80 bg-muted/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${section.accent}`} />
                  <span className="flex-1 text-sm font-medium text-foreground">{section.label}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <div className="space-y-2 border-t border-border/50 px-3 py-2.5">
                    {section.key === "patterns"
                      ? concept.commonPatterns.map((pattern, i) => (
                          <div key={i} className="space-y-0.5">
                            <p className={`text-sm font-medium ${section.accent}`}>
                              {pattern.name}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {pattern.description}
                            </p>
                          </div>
                        ))
                      : section.key === "interviewTips"
                        ? section.items.map((item, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-2 rounded-md ${section.bgAccent} px-2.5 py-2`}
                            >
                              <span className={`mt-0.5 text-xs font-bold ${section.accent}`}>
                                TIP
                              </span>
                              <span className="text-xs leading-relaxed text-foreground">{item}</span>
                            </div>
                          ))
                        : section.items.map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${section.accent.replace("text-", "bg-")}`} />
                              <span className="text-xs leading-relaxed text-muted-foreground">{item}</span>
                            </div>
                          ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
