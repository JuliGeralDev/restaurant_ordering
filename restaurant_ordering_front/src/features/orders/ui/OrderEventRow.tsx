"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { OrderEvent } from "@/features/orders/orders.types";
import { EVENT_CONFIG, DEFAULT_CONFIG } from "./orderEvent.config";
import { EventDetail } from "./EventDetail";

interface OrderEventRowProps {
  event: OrderEvent;
  isLast: boolean;
}

export const OrderEventRow = ({ event, isLast }: OrderEventRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = EVENT_CONFIG[event.type] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  const ts = new Date(event.timestamp);
  const date = ts.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  const time = ts.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <div className={`h-3 w-3 shrink-0 rounded-full ${config.dotClass}`} />
        {!isLast && <div className="mt-1 w-px flex-1 bg-zinc-700" />}
      </div>

      <div
        className={`mb-4 flex-1 rounded-lg border-2 bg-zinc-800 px-3 py-2 ${config.borderClass}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${config.iconClass}`} />
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.badgeClass}`}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] tabular-nums text-zinc-600">
              {date} · {time}
            </span>
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Hide event details" : "Show event details"}
              onClick={() => setIsExpanded((current) => !current)}
              className="flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-[9px] uppercase tracking-widest text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              {isExpanded ? "Hide" : "Details"}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {isExpanded && <EventDetail type={event.type} payload={event.payload} />}
      </div>
    </div>
  );
};
