"use client";

import { CardConsola } from "@/shared/ui/CardConsola";
import type { OrderResponse } from "@/features/cart/cart.types";

const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-amber-900/60 text-amber-400 border border-amber-600",
  PLACED: "bg-purple-900/60 text-purple-400 border border-purple-600",
};

interface OrderSummaryCardProps {
  order: OrderResponse;
}

export const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  const shortId = order.orderId.split("_").at(-1)?.toUpperCase() ?? order.orderId;
  const createdAt = new Date(order.createdAt).toLocaleString("es-CO");

  return (
    <CardConsola
      title={`ORDER #${shortId}`}
      headerAction={
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <span
            className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${STATUS_STYLES[order.status] ?? "bg-zinc-700 text-zinc-400 border border-zinc-600"}`}
          >
            {order.status}
          </span>
        </span>
      }
      className="mb-6"
    >
      <div className="flex flex-col gap-3 bg-zinc-800 p-4">
        {/* Items */}
        <div className="flex flex-col gap-1 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2">
          {order.items.map((item) => (
            <div
              key={item.cartItemId ?? item.productId}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-[11px] text-zinc-300">
                <span className="font-bold text-green-400">{item.quantity}×</span> {item.name}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-zinc-400">
                ${(item.basePrice * item.quantity).toLocaleString("es-CO")}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div className="flex flex-col gap-1 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2">
          {[
            { label: "Subtotal", value: order.pricing.subtotal },
            { label: "Tax", value: order.pricing.tax },
            { label: "Service fee", value: order.pricing.serviceFee },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-[9px] uppercase tracking-wide text-zinc-500">{label}</span>
              <span className="text-[10px] tabular-nums text-zinc-400">
                ${value.toLocaleString("es-CO")}
              </span>
            </div>
          ))}
          <div className="mt-1 flex justify-between gap-2 border-t border-zinc-700 pt-1">
            <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400">Total</span>
            <span className="text-xs font-bold tabular-nums text-green-400">
              ${order.pricing.total.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <p className="text-[9px] uppercase tracking-wide text-zinc-600">{createdAt}</p>
      </div>
    </CardConsola>
  );
};
