"use client";

import Link from "next/link";
import { ClipboardList, ChevronRight, ShoppingBag } from "lucide-react";
import { useGetOrdersByUser } from "@/features/orders/hooks/useGetOrdersByUser";
import { CardConsola } from "@/shared/ui/CardConsola";
import type { OrderResponse } from "@/features/cart/cart.types";

const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-amber-900/60 text-amber-400 border border-amber-600",
  PLACED: "bg-purple-900/60 text-purple-400 border border-purple-600",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${STATUS_STYLES[status] ?? "bg-zinc-700 text-zinc-400 border border-zinc-600"}`}
  >
    {status}
  </span>
);

const OrderCard = ({ order }: { order: OrderResponse }) => {
  const shortId = order.orderId.split("_").at(-1) ?? order.orderId;
  const date = new Date(order.createdAt).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/orders/${order.orderId}`} className="block group">
      <CardConsola
        title={`#${shortId.toUpperCase()}`}
        headerAction={
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <StatusBadge status={order.status} />
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
          </span>
        }
        className="h-[280px] flex flex-col transition-transform group-hover:-translate-y-0.5 group-hover:shadow-green-700/30"
      >
        <div className="flex flex-1 min-h-0 flex-col gap-3 bg-zinc-800 p-4">
          {/* Items */}
          <div className="flex flex-1 min-h-0 flex-col gap-1 overflow-y-auto rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2">
            {order.items.map((item) => (
              <div key={item.cartItemId ?? item.productId} className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-zinc-300">
                  <span className="font-bold text-green-400">{item.quantity}×</span> {item.name}
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-zinc-400">
                  ${(item.basePrice * item.quantity).toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>

          {/* Footer: date + total */}
          <div className="flex shrink-0 items-center justify-between">
            <span className="text-[9px] uppercase tracking-wide text-zinc-500">{date}</span>
            <span className="text-xs font-bold tabular-nums text-green-400">
              Total ${order.pricing.total.toLocaleString("es-CO")}
            </span>
          </div>
        </div>
      </CardConsola>
    </Link>
  );
};

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersByUser();

  return (
    <div className="container px-4 py-8 m-auto">
      <h1 className="mb-6 text-center text-xl font-bold uppercase tracking-widest">
        MY ORDERS
      </h1>

      {isLoading && (
        <p className="py-24 text-center text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
          Loading orders...
        </p>
      )}

      {!isLoading && error && (
        <p className="py-24 text-center text-xs uppercase tracking-widest text-red-500">
          {error}
        </p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <ShoppingBag className="h-16 w-16 text-zinc-500" />
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            No orders yet
          </p>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...orders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
        </div>
      )}
    </div>
  );
}
