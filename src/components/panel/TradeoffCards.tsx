"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TRADEOFF_CARDS } from "@/data/tradeoffCards";

export function TradeoffCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        Reference cards
      </p>
      <div className="space-y-2">
        {TRADEOFF_CARDS.map((card) => {
          const isOpen = expandedId === card.id;
          return (
            <div
              key={card.id}
              className="overflow-hidden rounded-md border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => toggle(card.id)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="flex-1 text-sm font-medium text-foreground">{card.title}</span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-border px-3 py-3">
                  {/* Side-by-side options */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Option A */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-cyan-500 dark:text-cyan-400">
                        {card.optionA.name}
                      </p>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
                          Pros
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {card.optionA.pros.map((pro, i) => (
                            <li key={i} className="text-xs leading-snug text-muted-foreground sm:text-sm">
                              + {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-rose-500">
                          Cons
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {card.optionA.cons.map((con, i) => (
                            <li key={i} className="text-xs leading-snug text-muted-foreground/90 sm:text-sm">
                              - {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Option B */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-purple-400">
                        {card.optionB.name}
                      </p>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
                          Pros
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {card.optionB.pros.map((pro, i) => (
                            <li key={i} className="text-xs leading-snug text-muted-foreground sm:text-sm">
                              + {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-rose-500">
                          Cons
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {card.optionB.cons.map((con, i) => (
                            <li key={i} className="text-xs leading-snug text-muted-foreground/90 sm:text-sm">
                              - {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* When to choose */}
                  <div className="space-y-2 border-t border-border pt-3">
                    <div>
                      <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        Choose {card.optionA.name} when:
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {card.whenToChooseA}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-500">
                        Choose {card.optionB.name} when:
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {card.whenToChooseB}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
