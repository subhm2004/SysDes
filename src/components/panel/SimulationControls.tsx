"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Loader2 } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { SIMULATION_SPEED_OPTIONS } from "@/types/simulation";

const PRESETS = [
  { label: "Light", value: 1000 },
  { label: "Medium", value: 10000 },
  { label: "Heavy", value: 100000 },
  { label: "Stress", value: 500000 },
];

const accentSelected =
  "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300";
const accentSolid = "bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-600 dark:hover:bg-violet-500";

interface SimulationControlsProps {
  onSimulate: () => void;
}

export function SimulationControls({ onSimulate }: SimulationControlsProps) {
  const config = useSimulationStore((s) => s.config);
  const setConfig = useSimulationStore((s) => s.setConfig);
  const isRunning = useSimulationStore((s) => s.isRunning);

  return (
    <div className="space-y-5 font-sans">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Simulation config
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setConfig({ requestsPerSec: preset.value })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              config.requestsPerSec === preset.value
                ? accentSelected
                : "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="text-sm text-muted-foreground">Requests/sec</label>
            <span className="font-mono text-sm font-semibold text-violet-700 tabular-nums dark:text-violet-400">
              {new Intl.NumberFormat("en-US").format(config.requestsPerSec)}
            </span>
          </div>
          <Slider
            value={[config.requestsPerSec]}
            onValueChange={(v) => setConfig({ requestsPerSec: Array.isArray(v) ? v[0] : v })}
            min={100}
            max={500000}
            step={100}
            className=""
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-sm font-medium text-foreground">Simulation playback speed</label>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Multiplier for edge flow animation and run length. Lower (e.g. 0.25×) is slower and easier
          to see; higher (e.g. 4×) finishes quickly.
        </p>
        <div className="flex flex-wrap gap-2">
          {SIMULATION_SPEED_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              title={`${value}× playback`}
              onClick={() => setConfig({ speedMultiplier: value })}
              className={`min-w-[3rem] rounded-full px-3 py-1.5 text-sm font-medium tabular-nums transition-colors ${
                config.speedMultiplier === value
                  ? accentSelected
                  : "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {value}×
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <Button
        onClick={onSimulate}
        disabled={isRunning}
        className={`h-11 w-full gap-2 text-sm font-semibold ${accentSolid} disabled:opacity-50`}
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 shrink-0" />
            Run simulation
          </>
        )}
      </Button>
    </div>
  );
}
