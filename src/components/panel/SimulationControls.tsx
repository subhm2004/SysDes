"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Play, Loader2 } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { SIMULATION_SPEED_OPTIONS } from "@/types/simulation";
import { STUDIO_COPY } from "@/lib/studio-copy";

const RPS_MIN = 100;
const RPS_MAX = 500_000;
const RPS_STEP = 100;

function clampRps(n: number): number {
  const stepped = Math.round(n / RPS_STEP) * RPS_STEP;
  return Math.min(RPS_MAX, Math.max(RPS_MIN, stepped));
}

const PRESETS = [
  { label: STUDIO_COPY.simulation.presets.light, value: 1000 },
  { label: STUDIO_COPY.simulation.presets.medium, value: 10000 },
  { label: STUDIO_COPY.simulation.presets.heavy, value: 100000 },
  { label: STUDIO_COPY.simulation.presets.stress, value: 500000 },
];

const accentSelected =
  "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300";
const accentSolid = "bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500";

interface SimulationControlsProps {
  onSimulate: () => void;
}

export function SimulationControls({ onSimulate }: SimulationControlsProps) {
  const config = useSimulationStore((s) => s.config);
  const setConfig = useSimulationStore((s) => s.setConfig);
  const isRunning = useSimulationStore((s) => s.isRunning);

  const [rpsDraft, setRpsDraft] = useState(String(config.requestsPerSec));
  const [rpsFocused, setRpsFocused] = useState(false);

  useEffect(() => {
    if (!rpsFocused) setRpsDraft(String(config.requestsPerSec));
  }, [config.requestsPerSec, rpsFocused]);

  const commitRps = useCallback(
    (raw: string) => {
      const cleaned = raw.replace(/,/g, "").trim();
      if (cleaned === "") {
        setRpsDraft(String(config.requestsPerSec));
        return;
      }
      const n = Number(cleaned);
      if (Number.isNaN(n)) {
        setRpsDraft(String(config.requestsPerSec));
        return;
      }
      const next = clampRps(n);
      setConfig({ requestsPerSec: next });
      setRpsDraft(String(next));
    },
    [config.requestsPerSec, setConfig]
  );

  const bumpRps = useCallback(
    (delta: number) => {
      const next = clampRps(config.requestsPerSec + delta);
      setConfig({ requestsPerSec: next });
      setRpsDraft(String(next));
    },
    [config.requestsPerSec, setConfig]
  );

  return (
    <div className="space-y-5 font-sans">
      <p className="text-base font-semibold uppercase tracking-wider text-muted-foreground">
        Simulation config
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              const v = clampRps(preset.value);
              setConfig({ requestsPerSec: v });
              setRpsDraft(String(v));
            }}
            className={`rounded-full px-3.5 py-2 text-base font-medium transition-colors ${
              config.requestsPerSec === preset.value
                ? accentSelected
                : "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="sim-rps" className="text-base text-muted-foreground">
          Requests/sec
        </label>
        <div
          className="flex h-11 w-full overflow-hidden rounded-lg border border-input bg-background shadow-sm transition-colors focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 dark:focus-within:border-cyan-400 dark:focus-within:ring-cyan-400/25"
        >
          <input
            id="sim-rps"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            disabled={isRunning}
            value={rpsDraft}
            onChange={(e) => setRpsDraft(e.target.value)}
            onFocus={() => setRpsFocused(true)}
            onBlur={() => {
              setRpsFocused(false);
              commitRps(rpsDraft);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                bumpRps(RPS_STEP);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                bumpRps(-RPS_STEP);
              }
            }}
            className="min-w-0 flex-1 border-0 bg-transparent px-3 font-mono text-base tabular-nums text-foreground outline-none disabled:opacity-50"
          />
          <div className="flex h-full shrink-0 flex-col divide-y divide-border border-l border-input">
            <button
              type="button"
              disabled={isRunning || config.requestsPerSec >= RPS_MAX}
              onClick={() => bumpRps(RPS_STEP)}
              className="flex min-h-0 flex-1 items-center justify-center bg-muted/40 px-2 text-muted-foreground transition-colors hover:bg-cyan-500/15 hover:text-cyan-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-cyan-300"
              aria-label="Increase requests per second"
            >
              <ChevronUp className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              disabled={isRunning || config.requestsPerSec <= RPS_MIN}
              onClick={() => bumpRps(-RPS_STEP)}
              className="flex min-h-0 flex-1 items-center justify-center bg-muted/40 px-2 text-muted-foreground transition-colors hover:bg-cyan-500/15 hover:text-cyan-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-cyan-300"
              aria-label="Decrease requests per second"
            >
              <ChevronDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {RPS_MIN.toLocaleString("en-US")}–{RPS_MAX.toLocaleString("en-US")}, step {RPS_STEP}
        </p>
      </div>

      <div className="space-y-2.5">
        <label className="text-base font-medium text-foreground">Simulation playback speed</label>
        <p className="text-sm leading-relaxed text-muted-foreground">
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
              className={`min-w-[3rem] rounded-full px-3.5 py-2 text-base font-medium tabular-nums transition-colors ${
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
        className={`h-12 w-full gap-2 text-base font-semibold ${accentSolid} disabled:opacity-50`}
      >
        {isRunning ? (
          <>
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            {STUDIO_COPY.simulation.running}
          </>
        ) : (
          <>
            <Play className="h-5 w-5 shrink-0 translate-x-[0.5px]" strokeWidth={2.5} aria-hidden />
            {STUDIO_COPY.simulation.run}
          </>
        )}
      </Button>
    </div>
  );
}
