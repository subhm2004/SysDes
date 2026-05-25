"use client";

import { useState, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

function formatNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} K`;
  return n.toFixed(0);
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e15) return `${(bytes / 1e15).toFixed(2)} PB`;
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${(bytes / 1e3).toFixed(2)} KB`;
}

export function CapacityCalculator() {
  const [dau, setDau] = useState(100_000_000);
  const [reqPerUser, setReqPerUser] = useState(20);
  const [writeRatio, setWriteRatio] = useState(0.2);
  const [dataSizeKB, setDataSizeKB] = useState(5);

  const estimates = useMemo(() => {
    const totalRequests = dau * reqPerUser;
    const qps = totalRequests / 86400;
    const peakQps = qps * 3;
    // Storage only counts writes (reads don't create new data)
    const writeQPS = qps * writeRatio;
    const writesPerDay = totalRequests * writeRatio;
    const storagePerDay = writesPerDay * dataSizeKB * 1024; // bytes
    const storagePerYear = storagePerDay * 365;
    const bandwidthBps = peakQps * dataSizeKB * 1024 * 8; // bits/sec

    return {
      totalRequests,
      qps,
      peakQps,
      writeQPS,
      storagePerDay,
      storagePerYear,
      bandwidthBps,
    };
  }, [dau, reqPerUser, writeRatio, dataSizeKB]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-cyan-600 dark:text-cyan-400" strokeWidth={2.25} aria-hidden />
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Capacity estimation
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <InputField
          label="Daily Active Users"
          value={dau}
          onChange={setDau}
          presets={[
            { label: "1M", value: 1_000_000 },
            { label: "10M", value: 10_000_000 },
            { label: "100M", value: 100_000_000 },
            { label: "1B", value: 1_000_000_000 },
          ]}
        />
        <InputField
          label="Avg Requests / User / Day"
          value={reqPerUser}
          onChange={setReqPerUser}
          presets={[
            { label: "5", value: 5 },
            { label: "20", value: 20 },
            { label: "50", value: 50 },
            { label: "100", value: 100 },
          ]}
        />
        <InputField
          label="Write Ratio"
          value={writeRatio}
          onChange={setWriteRatio}
          presets={[
            { label: "10%", value: 0.1 },
            { label: "20%", value: 0.2 },
            { label: "50%", value: 0.5 },
            { label: "80%", value: 0.8 },
          ]}
        />
        <InputField
          label="Avg Data per Request (KB)"
          value={dataSizeKB}
          onChange={setDataSizeKB}
          presets={[
            { label: "1 KB", value: 1 },
            { label: "5 KB", value: 5 },
            { label: "50 KB", value: 50 },
            { label: "500 KB", value: 500 },
          ]}
        />
      </div>

      <Separator className="bg-border" />

      {/* Results */}
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimates</p>

      <div className="space-y-2">
        <ResultRow
          label="Total Requests / Day"
          value={formatNumber(estimates.totalRequests)}
        />
        <ResultRow
          label="Avg QPS"
          value={formatNumber(estimates.qps)}
          highlight
        />
        <ResultRow
          label="Peak QPS (3× avg)"
          value={formatNumber(estimates.peakQps)}
          highlight
        />
      </div>

      <Separator className="bg-border" />

      <div className="space-y-2">
        <ResultRow
          label="Storage / Day"
          value={formatBytes(estimates.storagePerDay)}
        />
        <ResultRow
          label="Storage / Year"
          value={formatBytes(estimates.storagePerYear)}
          highlight
        />
        <ResultRow
          label="Peak Bandwidth"
          value={formatBandwidth(estimates.bandwidthBps)}
          highlight
        />
      </div>

      {/* Formula reference */}
      <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <p className="text-sm font-medium text-muted-foreground">Formulas</p>
        <div className="mt-1.5 space-y-1 font-mono text-xs text-muted-foreground sm:text-sm">
          <p>QPS = DAU × req/user ÷ 86,400</p>
          <p>Peak = QPS × 3</p>
          <p>Storage/yr = DAU × req × writeRatio × size × 365</p>
        </div>
      </div>
    </div>
  );
}

function formatBandwidth(bps: number): string {
  if (bps >= 1e12) return `${(bps / 1e12).toFixed(2)} Tbps`;
  if (bps >= 1e9) return `${(bps / 1e9).toFixed(2)} Gbps`;
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(2)} Mbps`;
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(2)} Kbps`;
  return `${bps.toFixed(0)} bps`;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  presets: { label: string; value: number }[];
}

function InputField({ label, value, onChange, presets }: InputFieldProps) {
  const inputId = `capacity-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm text-muted-foreground">
          {label}
        </label>
        <span className="font-mono text-sm font-medium text-cyan-700 dark:text-cyan-300">
          {formatNumber(value)}
        </span>
      </div>
      <input
        id={inputId}
        type="number"
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!isNaN(v) && v >= 0) onChange(v);
        }}
        className="mb-1.5 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/25"
      />
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm ${
              value === p.value
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:border-cyan-400/50 dark:text-cyan-300"
                : "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultRow({ label, value, highlight }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`font-mono text-sm font-medium ${
          highlight ? "text-cyan-700 dark:text-cyan-300" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
