import type { OrderEventPayload } from "@/features/orders/orders.types";
import { formatCurrency } from "@/shared/lib/formatters";

export type EventRenderer = (payload: OrderEventPayload) => React.ReactNode;

//  Concrete renderers (one per event family) 

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
          <span className="font-semibold text-zinc-300">
            {formatCurrency(Number(payload.subtotal))}
          </span>
        </span>
      )}
      {payload.tax != null && (
        <span className="text-zinc-500">
          Tax{" "}
          <span className="font-semibold text-zinc-300">
            {formatCurrency(Number(payload.tax))}
          </span>
        </span>
      )}
      {payload.serviceFee != null && (
        <span className="text-zinc-500">
          Service fee{" "}
          <span className="font-semibold text-zinc-300">
            {formatCurrency(Number(payload.serviceFee))}
          </span>
        </span>
      )}
    </div>
    {payload.total != null && (
      <div className="mt-1.5 flex items-center justify-between border-t border-zinc-800 pt-1.5">
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">Total</span>
        <span className="text-[14px] font-bold text-blue-400">
          {formatCurrency(Number(payload.total))}
        </span>
      </div>
    )}
  </div>
);

const renderOrderStatusChanged: EventRenderer = (payload) => (
  <div className="mt-2 flex items-center gap-2 rounded bg-zinc-900 px-3 py-2">
    <span className="rounded bg-zinc-700 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-400">
      {String(payload.from ?? payload.previousStatus ?? "")}
    </span>
    <span className="text-zinc-600">→</span>
    <span className="rounded border border-orange-700 bg-orange-900/50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-400">
      {String(payload.to ?? payload.status ?? "")}
    </span>
  </div>
);

const renderOrderPlaced: EventRenderer = (payload) => (
  <p className="mt-2 rounded bg-zinc-900 px-3 py-2 text-[11px] text-zinc-400">
    {payload.status === "PROCESSING"
      ? "Order accepted for asynchronous processing."
      : "Order placed successfully."}
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

export const renderGenericEvent: EventRenderer = (payload) => (
  <div className="mt-2 flex flex-col gap-0.5 rounded bg-zinc-900 px-3 py-2">
    {Object.entries(payload).map(([k, v]) => (
      <div key={k} className="flex items-center justify-between gap-2">
        <span className="text-[9px] uppercase tracking-wide text-zinc-500">{k}</span>
        <span className="text-[10px] text-zinc-300">{String(v)}</span>
      </div>
    ))}
  </div>
);

export const EVENT_RENDERERS: Partial<Record<string, EventRenderer>> = {
  CART_ITEM_ADDED: renderCartItemEvent,
  CART_ITEM_UPDATED: renderCartItemEvent,
  CART_ITEM_REMOVED: renderCartItemEvent,
  PRICING_CALCULATED: renderPricingCalculated,
  ORDER_PLACED: renderOrderPlaced,
  ORDER_STATUS_CHANGED: renderOrderStatusChanged,
  VALIDATION_FAILED: renderValidationFailed,
};
