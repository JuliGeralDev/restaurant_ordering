"use client";

import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";

import type { OrderResponse } from "@/features/cart/cart.types";
import { useGetOrdersByUser } from "@/features/orders/hooks/useGetOrdersByUser";
import { formatCurrency, formatOrderShortId } from "@/shared/lib/formatters";
import { CardConsola } from "@/shared/ui/CardConsola";
import { OrderLineItems } from "@/shared/ui/OrderLineItems";
import { OrderStatusBadge } from "@/shared/ui/OrderStatusBadge";

const OrderCard = ({ order }: { order: OrderResponse }) => {
  const shortId = formatOrderShortId(order.orderId);
  const date = new Date(order.createdAt).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const lineItems = order.items.map((item) => ({
    key: item.cartItemId ?? item.productId,
    name: item.name,
    quantity: item.quantity,
    total: item.basePrice * item.quantity,
  }));

  return (
    <Link href={`/orders/${order.orderId}`} className="block group">
      <CardConsola
        title={`#${shortId}`}
        headerAction={
          <span className="flex items-center gap-1">
            <OrderStatusBadge status={order.status} />
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
          </span>
        }
        className="transition-transform group-hover:-translate-y-0.5 group-hover:shadow-green-700/30"
      >
        <div className="flex flex-col gap-3 bg-zinc-800 p-4">
          <OrderLineItems
            items={lineItems}
            className="flex flex-col gap-1 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2"
          />

          <div className="flex shrink-0 items-center justify-between">
            <span className="text-[9px] uppercase tracking-wide text-zinc-500">{date}</span>
            <span className="text-xs font-bold tabular-nums text-green-400">
              Total {formatCurrency(order.pricing.total)}
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
