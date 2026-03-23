"use client";

import {
  ShoppingCart,
  Trash2,
  RefreshCw,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Edit,
} from "lucide-react";
import type { OrderEvent, OrderEventPayload } from "@/features/orders/orders.types";
import { formatCurrency } from "@/shared/lib/formatters";

// ─── Config ───

type EventConfig = {
  label: string;
  icon: React.ElementType;
  borderClass: string;
  iconClass: string;
  dotClass: string;
  badgeClass: string;
};

const EVENT_CONFIG: Record<string, EventConfig> = {
  CART_ITEM_ADDED: {
    label: "Item Added",
    icon: ShoppingCart,
    borderClass: "border-green-800",
    iconClass: "text-green-400",
    dotClass: "bg-green-500",
    badgeClass: "bg-green-900/50 text-green-400",
  },
  CART_ITEM_UPDATED: {
    label: "Item Updated",
    icon: Edit,
    borderClass: "border-yellow-800",
    iconClass: "text-yellow-400",
    dotClass: "bg-yellow-500",
    badgeClass: "bg-yellow-900/50 text-yellow-400",
  },
  CART_ITEM_REMOVED: {
    label: "Item Removed",
    icon: Trash2,
    borderClass: "border-red-800",
    iconClass: "text-red-400",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-900/50 text-red-400",
  },
  PRICING_CALCULATED: {
    label: "Pricing Calculated",
    icon: Calculator,
    borderClass: "border-blue-800",
    iconClass: "text-blue-400",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-900/50 text-blue-400",
  },
  ORDER_PLACED: {
    label: "Order Placed",
    icon: CheckCircle,
    borderClass: "border-purple-800",
    iconClass: "text-purple-400",
    dotClass: "bg-purple-500",
    badgeClass: "bg-purple-900/50 text-purple-400",
  },
  ORDER_STATUS_CHANGED: {
    label: "Status Changed",
    icon: RefreshCw,
    borderClass: "border-orange-800",
    iconClass: "text-orange-400",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-900/50 text-orange-400",
  },
  VALIDATION_FAILED: {
    label: "Validation Failed",
    icon: AlertTriangle,
    borderClass: "border-red-800",
    iconClass: "text-red-400",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-900/50 text-red-400",
  },
};

const DEFAULT_CONFIG: EventConfig = {
  label: "Event",
  icon: RefreshCw,
  borderClass: "border-zinc-700",
  iconClass: "text-zinc-400",
  dotClass: "bg-zinc-500",
  badgeClass: "bg-zinc-800 text-zinc-400",
};

// ─── Event detail body (Strategy / Registry — OCP-compliant) ─────────────────

type EventRenderer = (payload: OrderEventPayload) => React.ReactNode;

const renderCartItemEvent: EventRenderer = (payload) => (
  <div className="mt-2 flex items-center justify-between rounded bg-zinc-900 px-3 py-2">
    <div className="min-w-0">
      <p className="truncate text-[12px] font-semibold text-zinc-100">
        {String(payload.name ?? "")}
      </p>
      {payload.quantity != null && (
        <p className="text-[10px] text-zinc-500">
          Quantity:{" "}
          <span className="font-semibold text-zinc-300">{String(payload.quantity)}</span>
        </p>
      )}
    </div>
    {payload.basePrice != null && (
      <span className="ml-4 shrink-0 text-[14px] font-bold text-green-400">
        {formatCurrency(Number(payload.basePrice))}
      </span>
    )}
  </div>
);

const renderPricingCalculated: EventRenderer = (payload) => (
  <div className="mt-2 rounded bg-zinc-900 px-3 py-2">
    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px]">
      {payload.subtotal != null && (
        <span className="text-zinc-500">
          Subtotal{" "}
          <span className="font-semibold text-zinc-300">{formatCurrency(Number(payload.subtotal))}</span>
        </span>
      )}
      {payload.tax != null && (
        <span className="text-zinc-500">
          Tax{" "}
          <span className="font-semibold text-zinc-300">{formatCurrency(Number(payload.tax))}</span>
        </span>
      )}
      {payload.serviceFee != null && (
        <span className="text-zinc-500">
          Service fee{" "}
          <span className="font-semibold text-zinc-300">{formatCurrency(Number(payload.serviceFee))}</span>
        </span>
      )}
    </div>
    {payload.total != null && (
      <div className="mt-1.5 flex items-center justify-between border-t border-zinc-800 pt-1.5">
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">Total</span>
        <span className="text-[14px] font-bold text-blue-400">{formatCurrency(Number(payload.total))}</span>
      </div>
    )}
  </div>
);

const renderOrderStatusChanged: EventRenderer = (payload) => (
  <div className="mt-2 flex items-center gap-2 rounded bg-zinc-900 px-3 py-2">
    <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-400">
      {String(payload.from ?? "")}
    </span>
    <span className="text-zinc-600">→</span>
    <span className="rounded border border-orange-700 bg-orange-900/50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-400">
      {String(payload.to ?? "")}
    </span>
  </div>
);

const renderOrderPlaced: EventRenderer = () => (
  <p className="mt-2 rounded bg-zinc-900 px-3 py-2 text-[11px] text-zinc-400">
    Order placed successfully.
  </p>
);

const renderValidationFailed: EventRenderer = (payload) => {
  const msg = payload.reason ?? payload.message ?? "Validation failed.";
  return (
    <p className="mt-2 rounded bg-red-950/50 px-3 py-2 text-[11px] text-red-400">
      {String(msg)}
    </p>
  );
};

const renderGenericEvent: EventRenderer = (payload) => (
  <div className="mt-2 flex flex-col gap-0.5 rounded bg-zinc-900 px-3 py-2">
    {Object.entries(payload).map(([k, v]) => (
      <div key={k} className="flex items-center justify-between gap-2">
        <span className="text-[9px] uppercase tracking-wide text-zinc-500">{k}</span>
        <span className="text-[10px] text-zinc-300">{String(v)}</span>
      </div>
    ))}
  </div>
);

// To support a new event type, add an entry here — no other code needs to change.
const EVENT_RENDERERS: Partial<Record<string, EventRenderer>> = {
  CART_ITEM_ADDED: renderCartItemEvent,
  CART_ITEM_UPDATED: renderCartItemEvent,
  CART_ITEM_REMOVED: renderCartItemEvent,
  PRICING_CALCULATED: renderPricingCalculated,
  ORDER_PLACED: renderOrderPlaced,
  ORDER_STATUS_CHANGED: renderOrderStatusChanged,
  VALIDATION_FAILED: renderValidationFailed,
};

const EventDetail = ({ type, payload }: { type: string; payload: OrderEventPayload }) => {
  const render = EVENT_RENDERERS[type] ?? renderGenericEvent;
  return <>{render(payload)}</>;
};

// ─── Public component ─────────
interface OrderEventRowProps {
  event: OrderEvent;
  isLast: boolean;
}

export const OrderEventRow = ({ event, isLast }: OrderEventRowProps) => {
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
      {/* Vertical timeline rail */}
      <div className="flex flex-col items-center pt-1">
        <div className={`h-3 w-3 shrink-0 rounded-full ${config.dotClass}`} />
        {!isLast && <div className="mt-1 w-px flex-1 bg-zinc-700" />}
      </div>

      {/* Card */}
      <div className={`mb-4 flex-1 rounded-lg border-2 bg-zinc-800 px-3 py-2 ${config.borderClass}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${config.iconClass}`} />
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.badgeClass}`}>
              {config.label}
            </span>
          </div>
          <span className="text-[9px] tabular-nums text-zinc-600">
            {date} · {time}
          </span>
        </div>

        <EventDetail type={event.type} payload={event.payload} />
      </div>
    </div>
  );
};
