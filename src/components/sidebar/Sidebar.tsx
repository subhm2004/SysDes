"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentPalette } from "./ComponentPalette";
import { ProblemSelector } from "./ProblemSelector";
import { LearningPath } from "./LearningPath";
import { useAppStore } from "@/store/appStore";

interface SidebarProps {
  open?: boolean;
  onCreateProblem?: () => void;
  onCreateCustomComponent?: () => void;
  variant?: "desktop" | "mobile";
}

function SidebarTabs({
  onCreateProblem,
  onCreateCustomComponent,
}: {
  onCreateProblem?: () => void;
  onCreateCustomComponent?: () => void;
}) {
  const activeLeftTab = useAppStore((s) => s.activeLeftTab);
  const setActiveLeftTab = useAppStore((s) => s.setActiveLeftTab);
  return (
    <Tabs value={activeLeftTab} onValueChange={(v) => setActiveLeftTab(v as typeof activeLeftTab)} className="flex flex-1 flex-col min-h-0">
      <TabsList className="mx-2 mt-2 flex min-h-11 w-full max-w-none shrink-0 gap-0.5 p-1">
        <TabsTrigger value="components" className="h-9 min-w-0 flex-1 px-2 text-base font-sans after:hidden">
          Components
        </TabsTrigger>
        <TabsTrigger value="problems" className="h-9 min-w-0 flex-1 px-2 text-base font-sans after:hidden">
          Problems
        </TabsTrigger>
        <TabsTrigger value="learn" className="h-9 min-w-0 flex-1 px-2 text-base font-sans after:hidden">
          Learn
        </TabsTrigger>
      </TabsList>

      <TabsContent value="components" className="mt-0 flex-1 min-h-0 overflow-hidden">
        <ComponentPalette onCreateCustomComponent={onCreateCustomComponent} />
      </TabsContent>

      <TabsContent value="problems" className="mt-0 flex-1 min-h-0 overflow-hidden">
        <ProblemSelector onCreateProblem={onCreateProblem} />
      </TabsContent>

      <TabsContent value="learn" className="mt-0 flex-1 min-h-0 overflow-hidden">
        <LearningPath />
      </TabsContent>
    </Tabs>
  );
}

export function Sidebar({
  open = true,
  onCreateProblem,
  onCreateCustomComponent,
  variant = "desktop",
}: SidebarProps) {
  if (variant === "mobile") {
    return (
      <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
        <SidebarTabs
          onCreateProblem={onCreateProblem}
          onCreateCustomComponent={onCreateCustomComponent}
        />
      </div>
    );
  }

  return (
    <aside
      className={`hidden shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 md:flex ${
        open ? "w-[280px] opacity-100" : "w-0 border-r-0 opacity-0"
      }`}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      <div className="flex w-[280px] flex-1 flex-col min-h-0">
        <SidebarTabs
          onCreateProblem={onCreateProblem}
          onCreateCustomComponent={onCreateCustomComponent}
        />
      </div>
    </aside>
  );
}
