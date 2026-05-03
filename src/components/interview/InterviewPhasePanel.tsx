"use client";

import { useInterviewStore } from "@/store/interviewStore";
import { useAppStore } from "@/store/appStore";
import { getProblemById } from "@/data/problems";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ClipboardList,
  Calculator,
  FileCode2,
  Database,
  Search,
  ChevronRight,
} from "lucide-react";

/** Panel content shown during interview phases 0-3 and 5 (not phase 4 = HLD). */
export function InterviewPhasePanel() {
  const currentPhase = useInterviewStore((s) => s.currentPhase);
  const phases = useInterviewStore((s) => s.phases);
  const nextPhase = useInterviewStore((s) => s.nextPhase);
  const selectedProblemId = useAppStore((s) => s.selectedProblemId);
  const problem = getProblemById(selectedProblemId);

  const phase = phases[currentPhase];

  return (
    <div className="flex h-full w-full flex-1 flex-col md:w-[300px]">
      {/* Phase header */}
      <div className="border-b border-zinc-800 px-3 py-3">
        <div className="flex items-center gap-2">
          <PhaseIcon icon={phase.icon} />
          <div>
            <p className="text-xs font-semibold text-zinc-200">{phase.name}</p>
            <p className="text-[10px] text-zinc-500">{phase.description}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {currentPhase === 0 && <RequirementsGuide problem={problem} />}
          {currentPhase === 1 && <EstimationGuide problem={problem} />}
          {currentPhase === 2 && <APIDesignGuide problem={problem} />}
          {currentPhase === 3 && <DataModelGuide problem={problem} />}
          {currentPhase === 5 && <DeepDiveGuide problem={problem} />}
        </div>
      </ScrollArea>

      {/* Next phase button */}
      {currentPhase < phases.length - 1 && (
        <div className="border-t border-zinc-800 px-3 py-2">
          <button
            onClick={nextPhase}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Next: {phases[currentPhase + 1].name}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function PhaseIcon({ icon }: { icon: string }) {
  const cls = "h-4 w-4 text-cyan-500";
  switch (icon) {
    case "ClipboardList":
      return <ClipboardList className={cls} />;
    case "Calculator":
      return <Calculator className={cls} />;
    case "FileCode2":
      return <FileCode2 className={cls} />;
    case "Database":
      return <Database className={cls} />;
    case "LayoutDashboard":
      return null; // Phase 4 is not rendered here
    case "Search":
      return <Search className={cls} />;
    default:
      return null;
  }
}

// --- Phase-specific guide components ---

function GuideItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-md bg-zinc-800 px-2.5 py-2">
            <span className="mt-0.5 text-[10px] text-zinc-600">{i + 1}.</span>
            <span className="text-xs leading-relaxed text-zinc-400">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GuideProps {
  problem: ReturnType<typeof getProblemById>;
}

function RequirementsGuide({ problem }: GuideProps) {
  return (
    <>
      {problem && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Problem
          </p>
          <div className="rounded-md bg-zinc-800 px-2.5 py-2">
            <p className="text-xs font-medium text-zinc-200">{problem.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {problem.description}
            </p>
          </div>
        </div>
      )}
      <GuideItem
        title="Things to clarify"
        items={[
          "Who are the users? What scale are we designing for?",
          "What are the core use cases? (read-heavy? write-heavy?)",
          "What are the latency requirements?",
          "What consistency model is needed? (strong vs eventual)",
          "Any geographic distribution requirements?",
          "What are the non-functional requirements? (availability, durability)",
        ]}
      />
      {problem && problem.constraints.length > 0 && (
        <GuideItem title="Key constraints" items={problem.constraints} />
      )}
    </>
  );
}

function EstimationGuide({ problem }: GuideProps) {
  return (
    <>
      {problem && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Given numbers
          </p>
          <div className="space-y-1">
            {[
              { label: "Users", value: problem.requirements.users },
              { label: "Reads/sec", value: new Intl.NumberFormat("en-US").format(problem.requirements.readsPerSec) },
              { label: "Writes/sec", value: new Intl.NumberFormat("en-US").format(problem.requirements.writesPerSec) },
              { label: "Storage", value: `${new Intl.NumberFormat("en-US").format(problem.requirements.storageGB)} GB` },
              { label: "Latency SLA", value: `< ${problem.requirements.latencyMs}ms` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-md bg-zinc-800 px-2.5 py-1.5">
                <span className="text-xs text-zinc-400">{item.label}</span>
                <span className="font-mono text-xs text-zinc-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <GuideItem
        title="Estimate"
        items={[
          "Daily active users -> QPS (queries per second)",
          "Peak QPS (typically 2-5x average)",
          "Storage per record x total records over N years",
          "Bandwidth: QPS x average response size",
          "Cache size: hot data that fits in memory",
          "Number of servers: QPS / single-server capacity",
        ]}
      />
    </>
  );
}

function APIDesignGuide({ problem: _problem }: GuideProps) {
  return (
    <>
      <GuideItem
        title="Define your APIs"
        items={[
          "List the core API endpoints (REST or RPC)",
          "Define request/response format for each",
          "Consider authentication and rate limiting",
          "Think about pagination for list endpoints",
          "Define error responses and status codes",
        ]}
      />
      <div className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-2">
        <p className="text-[10px] font-semibold text-zinc-500">TIP</p>
        <p className="mt-0.5 text-xs text-zinc-400">
          Use the text notes on the canvas to draft your API endpoints.
          Click &quot;Add Note&quot; in the top bar.
        </p>
      </div>
    </>
  );
}

function DataModelGuide({ problem: _problem }: GuideProps) {
  return (
    <>
      <GuideItem
        title="Design your data model"
        items={[
          "Identify the core entities (User, Post, URL, etc.)",
          "Define the key fields for each entity",
          "Determine relationships between entities",
          "Choose SQL vs NoSQL based on access patterns",
          "Think about indexing strategy",
        ]}
      />
      <div className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-2">
        <p className="text-[10px] font-semibold text-zinc-500">TIP</p>
        <p className="mt-0.5 text-xs text-zinc-400">
          Use text notes on the canvas to sketch your schema.
          Focus on the access patterns, not just the structure.
        </p>
      </div>
    </>
  );
}

function DeepDiveGuide({ problem }: GuideProps) {
  return (
    <>
      <GuideItem
        title="Topics to explore"
        items={[
          "Single points of failure — what happens if X goes down?",
          "Scaling bottlenecks — what breaks at 10x traffic?",
          "Data consistency — how do you handle conflicts?",
          "Cache invalidation strategy",
          "Monitoring and alerting — what metrics matter?",
          "Security considerations (auth, encryption, rate limiting)",
        ]}
      />
      {problem && problem.hints.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Hints for {problem.title}
          </p>
          {problem.hints.map((hint, i) => (
            <div key={i} className="rounded-md bg-zinc-800 px-2.5 py-2">
              <p className="text-xs font-medium text-zinc-300">{hint.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{hint.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
