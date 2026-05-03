"use client";

import { type DragEvent, useCallback, useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SYSTEM_COMPONENTS,
  COMPONENT_CATEGORIES,
  getComponentById,
} from "@/data/components";
import { CONCEPT_LIBRARY } from "@/data/conceptLibrary";
import { Server, GripVertical, Plus, Search as SearchIcon, Sparkles, Trash2 } from "lucide-react";
import { ICON_MAP } from "@/lib/icons";
import { useCanvasStore, type ComponentNodeData } from "@/store/canvasStore";
import { useAppStore } from "@/store/appStore";
import { useCustomComponentsStore } from "@/store/customComponentsStore";
import type { SystemComponent } from "@/types/component";

const CATEGORY_ACCENT: Record<string, string> = {
  networking: "text-blue-600 dark:text-blue-400",
  compute: "text-violet-600 dark:text-violet-400",
  storage: "text-amber-600 dark:text-amber-400",
  messaging: "text-emerald-600 dark:text-emerald-400",
  infrastructure: "text-violet-500 dark:text-violet-300",
};

const CATEGORY_BG: Record<string, string> = {
  networking: "bg-blue-500/10 dark:bg-blue-400/10",
  compute: "bg-violet-500/10 dark:bg-violet-400/10",
  storage: "bg-amber-500/10 dark:bg-amber-400/10",
  messaging: "bg-emerald-500/10 dark:bg-emerald-400/10",
  infrastructure: "bg-violet-500/8 dark:bg-violet-400/8",
};

const CATEGORY_BORDER: Record<string, string> = {
  networking: "border-l-blue-500 dark:border-l-blue-400",
  compute: "border-l-violet-500 dark:border-l-violet-400",
  storage: "border-l-amber-500 dark:border-l-amber-400",
  messaging: "border-l-emerald-500 dark:border-l-emerald-400",
  infrastructure: "border-l-violet-400 dark:border-l-violet-500",
};

interface ComponentPaletteProps {
  onCreateCustomComponent?: () => void;
}

export function ComponentPalette({ onCreateCustomComponent }: ComponentPaletteProps = {}) {
  const [search, setSearch] = useState("");
  const { getViewport } = useReactFlow();
  const addNode = useCanvasStore((s) => s.addNode);
  const customComponents = useCustomComponentsStore((s) => s.components);
  const deleteCustomComponent = useCustomComponentsStore((s) => s.deleteComponent);

  const allComponents: SystemComponent[] = [...customComponents, ...SYSTEM_COMPONENTS];
  const customIds = new Set(customComponents.map((c) => c.id));

  function handleDragStart(e: DragEvent, componentId: string) {
    e.dataTransfer.setData("application/sysdes-component", componentId);
    e.dataTransfer.effectAllowed = "copy";

    const ghost = document.createElement("div");
    ghost.style.cssText = "position:absolute;top:-1000px;left:-1000px;padding:6px 12px;background:#18181b;border:1px solid #3f3f46;border-radius:8px;color:#e4e4e7;font-size:12px;font-family:system-ui;white-space:nowrap;";
    const comp = allComponents.find((c) => c.id === componentId);
    ghost.textContent = comp?.label ?? componentId;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }

  /** Tap-to-add: place the component at the canvas viewport center. */
  const handleQuickAdd = useCallback(
    (componentId: string) => {
      const component = getComponentById(componentId);
      if (!component) return;

      const { x, y, zoom } = getViewport();
      // Jitter the center so repeated taps don't stack exactly on top
      const jitter = () => (Math.random() - 0.5) * 60;
      const centerX = (-x + window.innerWidth / 2) / zoom + jitter();
      const centerY = (-y + window.innerHeight / 2) / zoom + jitter();

      const newNode: Node<ComponentNodeData> = {
        id: `${componentId}-${crypto.randomUUID()}`,
        type: "component",
        position: { x: centerX, y: centerY },
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
      useAppStore.getState().showToast(`Added ${component.label}`, "success");
    },
    [getViewport, addNode]
  );

  const query = search.toLowerCase().trim();

  const matches = (c: SystemComponent) =>
    query === "" ||
    c.label.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query);

  const totalMatches = query
    ? allComponents.filter(matches).length
    : allComponents.length;

  const handleDeleteCustom = (e: React.MouseEvent, id: string, label: string) => {
    e.stopPropagation();
    e.preventDefault();
    deleteCustomComponent(id);
    useAppStore.getState().showToast(`Removed ${label}`, "info");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/50" />
          <input
            type="text"
            aria-label="Search components"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-sidebar-border bg-background py-2 pl-9 pr-3 text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25 dark:focus:border-violet-400"
          />
        </div>
        {query && (
          <p className="mt-1.5 text-xs text-sidebar-foreground/70">
            {totalMatches === 0
              ? "No matches"
              : `${totalMatches} component${totalMatches === 1 ? "" : "s"} match "${search}"`}
          </p>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="space-y-4 p-3">
        {onCreateCustomComponent && (
          <button
            type="button"
            onClick={onCreateCustomComponent}
            className="group flex w-full items-center gap-2.5 rounded-md border border-dashed border-violet-500/35 bg-violet-500/[0.06] px-3 py-2.5 text-base font-sans font-medium text-sidebar-foreground transition-colors hover:border-violet-500/55 hover:bg-violet-500/10 dark:border-violet-400/30 dark:bg-violet-500/[0.08] dark:hover:border-violet-400/50 dark:hover:bg-violet-500/15"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" strokeWidth={2.25} />
            <span className="flex-1 text-left">Create custom component</span>
            <Plus className="h-4 w-4 shrink-0 text-sidebar-foreground/55 group-hover:text-violet-600 dark:group-hover:text-violet-400" strokeWidth={2.25} />
          </button>
        )}
        {COMPONENT_CATEGORIES.map((cat) => {
          const items = allComponents.filter(
            (c) => c.category === cat.key && matches(c),
          );
          if (query !== "" && items.length === 0) return null;
          return (
            <div key={cat.key}>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/65">
                  {cat.label}
                </p>
                <span className="flex h-4 min-w-4 items-center justify-center rounded bg-sidebar-accent px-1 text-[10px] font-medium tabular-nums text-sidebar-foreground/80">
                  {items.length}
                </span>
                <div className="h-px flex-1 bg-sidebar-border" />
              </div>
              <TooltipProvider>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? Server;
                  const accent = CATEGORY_ACCENT[item.category] ?? "text-violet-600 dark:text-violet-400";
                  const iconBg = CATEGORY_BG[item.category] ?? "bg-violet-500/10 dark:bg-violet-400/10";
                  const borderColor = CATEGORY_BORDER[item.category] ?? "border-l-violet-500 dark:border-l-violet-400";
                  const concept = CONCEPT_LIBRARY[item.id];
                  const tipText = concept?.whenToUse[0] ?? item.description;
                  const isCustom = customIds.has(item.id);
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger
                        render={
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            className={`group flex cursor-grab items-center gap-2 rounded-md border border-transparent border-l-2 px-2 py-2 text-sm font-sans text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:cursor-grabbing ${borderColor}`}
                          >
                            <GripVertical className="h-3 w-3 shrink-0 text-sidebar-foreground/45 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconBg}`}>
                              <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${accent}`} />
                            </div>
                            <span className="min-w-0 flex-1 truncate font-medium text-sidebar-foreground">
                              {item.label}
                            </span>
                            {isCustom && (
                              <span className="shrink-0 rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                                Custom
                              </span>
                            )}
                            <span className="shrink-0 text-xs tabular-nums text-sidebar-foreground/65">
                              {item.maxQPS === Infinity ? "\u221e" : `${(item.maxQPS / 1000).toFixed(0)}k`}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAdd(item.id);
                              }}
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-sidebar-foreground/55 opacity-70 transition-all hover:bg-sidebar-accent hover:text-violet-600 hover:opacity-100 dark:hover:text-violet-400 md:opacity-0 md:group-hover:opacity-100"
                              title="Add to canvas"
                              aria-label={`Add ${item.label} to canvas`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            {isCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustom(e, item.id, item.label)}
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-sidebar-foreground/55 opacity-70 transition-all hover:bg-sidebar-accent hover:text-rose-600 hover:opacity-100 dark:hover:text-rose-400 md:opacity-0 md:group-hover:opacity-100"
                                title="Delete custom component"
                                aria-label={`Delete ${item.label}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        }
                      />
                      <TooltipContent side="right" sideOffset={8} className="max-w-[220px]">
                        <p className="text-xs leading-relaxed">{tipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
