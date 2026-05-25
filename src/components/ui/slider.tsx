"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

const TRACK_CLASS = "h-1.5" /* 6px — must match ::-webkit-slider-runnable-track for thumb centering */

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
}: SliderProps) {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? min
  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div
      data-slot="slider"
      className={cn("relative h-6 w-full touch-none select-none", className)}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 rounded-full bg-muted",
          TRACK_CLASS
        )}
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-cyan-500 dark:bg-cyan-400"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        onChange={(e) => {
          onValueChange?.([Number(e.target.value)])
        }}
        className={cn(
          "absolute inset-0 z-10 m-0 h-6 w-full cursor-pointer appearance-none bg-transparent",
          "accent-cyan-600 dark:accent-cyan-400",
          /* Real 6px track so WebKit/Safari vertically centers the thumb (h-0 breaks alignment) */
          "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent",
          /* Solid thumb — ring + bg-background looked like a misaligned “double circle” */
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:shadow-sm",
          "dark:[&::-webkit-slider-thumb]:bg-cyan-400",
          "[&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing",
          "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:shadow-sm",
          "dark:[&::-moz-range-thumb]:bg-cyan-400",
          disabled && "pointer-events-none opacity-50"
        )}
      />
    </div>
  )
}

export { Slider }
