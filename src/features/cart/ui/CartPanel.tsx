"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useGetOrder } from "../hooks/useGetOrder";
import type { OrderItemDto } from "../cart.types";

const formatPrice = (price: number) => `$${price.toLocaleString("es-CO")}`;

const CartItem = ({ item }: { item: OrderItemDto }) => (
  <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-2">
    <div className="flex h-12 w-full items-center justify-center rounded-lg border-2 border-zinc-700 bg-zinc-900">
      <span className="text-xl font-bold text-zinc-600">
        {item.name.charAt(0).toUpperCase()}
      </span>
    </div>
    <p className="line-clamp-2 w-full text-center text-[7px] leading-3 text-green-400">
      {item.name}
    </p>
    <p className="text-[7px] text-zinc-500">×{item.quantity}</p>
  </div>
);

export const CartPanel = () => {
  const { data } = useGetOrder();

  if (!data || data.items.length === 0) return null;

  return (
    <aside className="fixed right-0 top-0 z-30 flex h-screen w-52 flex-col border-l-[6px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-[-4px_0_24px_rgba(0,0,0,0.4)]">
      {/* Left grille decoration */}
      <div className="flex flex-col justify-center gap-0.5 px-0.5 py-2 absolute left-0 top-1/2 -translate-y-1/2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-0.5 w-1.5 rounded-full bg-zinc-600/40" />
        ))}
      </div>

      {/* Header strip */}
      <div className="border-b-4 border-zinc-700 bg-zinc-600 px-4 py-2 text-center text-[9px] font-bold uppercase tracking-wider text-green-400 shadow-inner flex-shrink-0">
        MY ORDER
      </div>

      {/* Items list — scrollable */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 min-h-0">
        {data.items.map((item, i) => (
          <CartItem key={i} item={item} />
        ))}
      </div>

      {/* Total + CTA — pinned at bottom */}
      <div className="flex-shrink-0 border-t-4 border-zinc-700 p-3 flex flex-col gap-2">
        <div className="rounded-xl border-4 border-zinc-700 bg-zinc-800 px-3 py-2 text-center shadow-inner">
          <p className="text-[7px] text-zinc-400">TOTAL</p>
          <p className="mt-0.5 text-sm font-bold text-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]">
            {formatPrice(data.pricing.total)}
          </p>
        </div>
        <Button className="w-full border-2 border-purple-900 bg-purple-600 text-[8px] text-white hover:bg-purple-700 active:scale-95">
          <ShoppingCart className="h-3 w-3" />
          IR AL CARRITO
        </Button>
      </div>
    </aside>
  );
};
