"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  ClipboardCheck,
  ChevronDown,
  LayoutGrid,
  PanelLeft,
  PanelRight,
  Trash2,
  Download,
  ImageIcon,
  FileCode2,
  FileJson,
  Save,
  FolderOpen,
  StickyNote,
  GraduationCap,
  Plus,
  MoreHorizontal,
  Heart,
  BookOpen,
  Share2,
  Wand2,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAppStore } from "@/store/appStore";
import { useCanvasStore } from "@/store/canvasStore";
import { usePenStore } from "@/store/penStore";
import { PROBLEMS } from "@/data/problems";
import { useCustomProblemsStore } from "@/store/customProblemsStore";
import { type Node, type Edge, useReactFlow } from "@xyflow/react";
import { getComponentById } from "@/data/components";
import type { ComponentNodeData } from "@/store/canvasStore";
import { exportAsPng, exportAsSvg, exportAsJSON } from "@/lib/exportCanvas";

interface TopBarProps {
  onSimulate: () => void;
  onScore: () => void;
  onClearCanvas: () => void;
  onSave: () => void;
  onLoad: () => void;
  onStartInterview: () => void;
  onCreateProblem: () => void;
  onOpenSupport: () => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onPickProblem?: () => void;
  onToggleAiChat?: () => void;
  aiChatOpen?: boolean;
}

export function TopBar({
  onSimulate,
  onScore,
  onClearCanvas,
  onSave,
  onLoad,
  onStartInterview,
  onCreateProblem,
  onOpenSupport,
  onToggleLeft,
  onToggleRight,
  onPickProblem,
  onToggleAiChat,
  aiChatOpen,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const { getViewport } = useReactFlow();
  const addNode = useCanvasStore((s) => s.addNode);

  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const setSelectedProblem = useAppStore((s) => s.setSelectedProblem);

  const customProblems = useCustomProblemsStore((s) => s.problems);
  const currentProblem =
    PROBLEMS.find((p) => p.id === selectedProblemId) ??
    customProblems.find((p) => p.id === selectedProblemId);

  const addTextNote = useCallback(() => {
    const { x, y, zoom } = getViewport();
    const centerX = (-x + window.innerWidth / 2) / zoom;
    const centerY = (-y + window.innerHeight / 2) / zoom;

    const newNode: Node = {
      id: `text-${crypto.randomUUID()}`,
      type: "text",
      position: { x: centerX, y: centerY },
      data: { text: "" },
      connectable: false,
    };
    addNode(newNode);
  }, [getViewport, addNode]);

  const handleExportPng = useCallback(async () => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    try {
      await exportAsPng(name);
      useAppStore.getState().showToast("Exported as PNG", "success");
    } catch {
      useAppStore.getState().showToast("Export failed", "error");
    }
  }, [currentProblem]);

  const handleExportSvg = useCallback(async () => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    try {
      await exportAsSvg(name);
      useAppStore.getState().showToast("Exported as SVG", "success");
    } catch {
      useAppStore.getState().showToast("Export failed", "error");
    }
  }, [currentProblem]);

  const handleExportJson = useCallback(() => {
    setExportOpen(false);
    const name = currentProblem?.title ?? "design";
    const { nodes, edges } = useCanvasStore.getState();
    const { strokes } = usePenStore.getState();
    if (nodes.length === 0 && strokes.length === 0) {
      useAppStore.getState().showToast("Nothing to export", "info");
      return;
    }
    exportAsJSON(nodes, edges, name, strokes);
    useAppStore.getState().showToast("Exported as JSON", "success");
  }, [currentProblem]);

  const handleShare = useCallback(async () => {
    const title = currentProblem?.title ?? `${BRAND.name} design`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: "Architecture canvas", url });
      } else if (url) {
        await navigator.clipboard.writeText(url);
        useAppStore.getState().showToast("Link copied", "success");
      }
    } catch {
      /* user cancelled share */
    }
  }, [currentProblem]);

  // Keyboard shortcut: Ctrl/Cmd+E → Export as PNG
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.key === "e" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        handleExportPng();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExportPng]);

  const loadReference = useCallback(() => {
    const problem = PROBLEMS.find((p) => p.id === selectedProblemId);
    if (!problem) return;

    // Build reference nodes
    const nodeIdMap = new Map<string, string>();
    const refNodes: Node<ComponentNodeData>[] = [];

    problem.referenceSolution.nodes.forEach((ref, index) => {
      const comp = getComponentById(ref.componentId);
      if (!comp) return;

      const nodeId = `${comp.id}-ref-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      nodeIdMap.set(`${ref.componentId}-${index}`, nodeId);

      refNodes.push({
        id: nodeId,
        type: "component",
        position: { x: ref.x, y: ref.y },
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
    });

    const refEdges: Edge[] = [];
    for (const ref of problem.referenceSolution.edges) {
      const sourceId = findNodeIdByComponent(nodeIdMap, ref.source);
      const targetId = findNodeIdByComponent(nodeIdMap, ref.target);
      if (sourceId && targetId) {
        refEdges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: "animated",
        });
      }
    }

    // Open reference in a NEW tab — user's design stays in "My Design" tab
    useCanvasStore.getState().addTab({
      id: `ref-${problem.id}`,
      label: `${problem.title} (Reference)`,
      nodes: refNodes,
      edges: refEdges,
      readOnly: true,
    });

    useAppStore.getState().showToast("Reference opened in new tab — your design is safe", "success");
  }, [selectedProblemId]);

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200/90 bg-zinc-100/95 px-2 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 md:gap-3 md:px-4">
      {/* Left: library + brand + tools */}
      <div className="flex min-w-0 shrink-0 items-center gap-2 md:gap-2.5">
        <button
          onClick={onToggleLeft}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          title="Toggle library"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-900"
          title={`${BRAND.name} — back to home`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-violet-600/10 ring-1 ring-violet-500/20 dark:from-violet-400/10 dark:to-violet-600/5 dark:ring-violet-400/15">
            <LayoutGrid className="h-[18px] w-[18px] text-violet-600 dark:text-violet-300" strokeWidth={2.25} />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-base md:text-lg">
              {BRAND.name}
            </span>
            <span className="hidden truncate text-xs font-medium text-zinc-500 sm:block dark:text-zinc-400">
              {BRAND.studioTagline}
            </span>
          </div>
        </Link>

        <div className="mx-0.5 hidden h-6 w-px bg-zinc-200 dark:bg-zinc-700 md:block" />

        {!selectedProblemId.startsWith("custom-") && (
          <button
            onClick={loadReference}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 md:flex"
            title="Load reference solution"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={addTextNote}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 md:flex"
          title="Add text note"
        >
          <StickyNote className="h-3.5 w-3.5" />
        </button>

        {/* Mobile overflow */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMobileMoreOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            title="More actions"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {mobileMoreOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMobileMoreOpen(false)} />
              <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                {/* Design actions */}
                {!selectedProblemId.startsWith("custom-") && (
                  <button
                    onClick={() => { setMobileMoreOpen(false); loadReference(); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Download className="h-3.5 w-3.5 text-zinc-500" />
                    Load reference solution
                  </button>
                )}
                {onPickProblem && (
                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      onPickProblem();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                    Problems library
                  </button>
                )}
                <button
                  onClick={() => { setMobileMoreOpen(false); addTextNote(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <StickyNote className="h-3.5 w-3.5 text-zinc-500" />
                  Add text note
                </button>
                <button
                  onClick={() => { setMobileMoreOpen(false); onStartInterview(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                  Practice interview
                </button>
                {onToggleAiChat && (
                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      onToggleAiChat();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-violet-500" />
                    AI assistant
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMoreOpen(false);
                    void handleShare();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                  Share / copy link
                </button>

                <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

                {/* File */}
                <button
                  onClick={() => { setMobileMoreOpen(false); onSave(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <Save className="h-3.5 w-3.5 text-zinc-500" />
                  Save design
                </button>
                <button
                  onClick={() => { setMobileMoreOpen(false); onLoad(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <FolderOpen className="h-3.5 w-3.5 text-zinc-500" />
                  Load design
                </button>

                <div className="my-1 h-px bg-zinc-800" />

                {/* Export */}
                <button
                  onClick={() => { setMobileMoreOpen(false); handleExportPng(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-zinc-500" />
                  Export as PNG
                </button>
                <button
                  onClick={() => { setMobileMoreOpen(false); handleExportSvg(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <FileCode2 className="h-3.5 w-3.5 text-zinc-500" />
                  Export as SVG
                </button>
                <button
                  onClick={() => { setMobileMoreOpen(false); handleExportJson(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <FileJson className="h-3.5 w-3.5 text-zinc-500" />
                  Export as JSON
                </button>

                <div className="my-1 h-px bg-zinc-800" />

                {/* Support */}
                <button
                  onClick={() => { setMobileMoreOpen(false); onOpenSupport(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-400/40 text-rose-400" />
                  Support this project
                </button>

                <div className="my-1 h-px bg-zinc-800" />

                {/* Danger */}
                <button
                  onClick={() => { setMobileMoreOpen(false); onClearCanvas(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-rose-400 transition-colors hover:bg-zinc-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear canvas
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: problem selector */}
      <div className="flex min-w-0 flex-1 justify-center px-1 sm:px-2">
        <div className="relative w-full max-w-xl">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-left text-xs font-medium text-zinc-800 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-violet-800 dark:hover:bg-violet-950/40 sm:px-3 sm:py-2 sm:text-sm"
          >
            <span className="min-w-0 truncate">{currentProblem?.title ?? "Select problem"}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onCreateProblem();
                  }}
                  className="flex w-full items-center gap-1.5 border-b border-zinc-200 px-3 py-2 text-left text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50 dark:border-zinc-700 dark:text-violet-400 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-3 w-3" />
                  Create Custom Problem
                </button>
                {customProblems.map((problem) => (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      problem.id === selectedProblemId
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <span className="flex-1 truncate">{problem.title}</span>
                    <span className="shrink-0 rounded bg-violet-100 px-1 py-0.5 text-[9px] font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      Custom
                    </span>
                  </button>
                ))}
                {customProblems.length > 0 && <div className="my-0.5 h-px bg-zinc-200 dark:bg-zinc-700" />}
                {PROBLEMS.map((problem) => (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => {
                      setSelectedProblem(problem.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      problem.id === selectedProblemId
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {problem.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center justify-end gap-1 md:gap-1.5">
        <button
          type="button"
          onClick={onToggleLeft}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:flex"
          title="Component library"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        {onPickProblem && (
          <button
            type="button"
            onClick={onPickProblem}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:flex"
            title="Problems"
          >
            <BookOpen className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onStartInterview}
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-violet-600 transition-colors hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-950 md:flex"
          title="Practice interview"
        >
          <GraduationCap className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void handleShare()}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 md:flex"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
        {onToggleAiChat && (
          <button
            type="button"
            onClick={onToggleAiChat}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors md:hidden ${
              aiChatOpen
                ? "border-violet-400 bg-violet-100 text-violet-700 dark:border-violet-600 dark:bg-violet-950 dark:text-violet-200"
                : "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300"
            }`}
            title="AI assistant"
          >
            <Wand2 className="h-4 w-4" />
          </button>
        )}
        {onToggleAiChat && (
          <button
            type="button"
            onClick={onToggleAiChat}
            className={`hidden h-9 w-9 items-center justify-center rounded-lg border transition-colors md:flex ${
              aiChatOpen
                ? "border-violet-400 bg-violet-100 text-violet-700 dark:border-violet-600 dark:bg-violet-950 dark:text-violet-200"
                : "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-950"
            }`}
            title="AI assistant (Gemini)"
          >
            <Wand2 className="h-4 w-4" />
          </button>
        )}

        <div className="mx-0.5 hidden md:block">
          <ThemeToggle size="sm" />
        </div>

        <div className="mx-0.5 hidden h-6 w-px bg-zinc-200 dark:bg-zinc-700 md:block" />

        <button
          type="button"
          onClick={onSave}
          className="hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 md:flex"
          title="Save design (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Save</span>
        </button>
        <button
          type="button"
          onClick={onLoad}
          className="hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 md:flex"
          title="Load design (Ctrl+O)"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Load</span>
        </button>

        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setExportOpen(!exportOpen)}
            className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            title="Export design (Ctrl+E)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Export</span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={handleExportPng}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  PNG
                  <kbd className="ml-auto rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[9px] text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800">
                    {"\u2318"}E
                  </kbd>
                </button>
                <button
                  type="button"
                  onClick={handleExportSvg}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  SVG
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <FileJson className="h-3.5 w-3.5" />
                  JSON
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mx-0.5 hidden h-6 w-px bg-zinc-200 dark:bg-zinc-700 md:block" />

        <button
          type="button"
          onClick={onClearCanvas}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-zinc-800 dark:hover:text-rose-400 md:flex"
          title="Clear canvas"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <Button
          size="sm"
          onClick={onSimulate}
          title="Run load simulation (⌘↵)"
          className="h-9 gap-1.5 bg-violet-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-violet-500"
        >
          <Play className="h-4 w-4 shrink-0 translate-x-[0.5px]" strokeWidth={2.5} aria-hidden />
          Run
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onScore}
          title="Evaluate design (⌘⇧S)"
          className="h-9 gap-1.5 border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:px-3"
        >
          <ClipboardCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.25} />
          <span className="hidden sm:inline">Evaluate</span>
        </Button>

        <button
          type="button"
          onClick={onToggleRight}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200/80 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          title="Toggle panel"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

/** Find the first node ID in the map whose key starts with the given componentId. */
function findNodeIdByComponent(nodeIdMap: Map<string, string>, componentId: string): string | undefined {
  for (const [key, value] of nodeIdMap) {
    if (key.startsWith(`${componentId}-`)) return value;
  }
  return undefined;
}
