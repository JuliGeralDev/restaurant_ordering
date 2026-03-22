"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useGetOrder } from "../hooks/useGetOrder";
import { useGroupedCartItems } from "../hooks/useGroupedCartItems";
import { CartItemPanel } from "./CartItemPanel";
const formatPrice = (price: number) => `$${price.toLocaleString("es-CO")}`;


export const CartPanel = () => {
  const pathname = usePathname();
  const { data } = useGetOrder();
  const grouped = useGroupedCartItems(data?.items ?? []);
  const isEmpty = !data || data.items.length === 0;

  if (pathname === "/cart") return null;

  return (
    <aside className="hidden xl:flex h-screen w-52 flex-shrink-0 sticky top-0 flex-col border-l-[6px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-[-4px_0_24px_rgba(0,0,0,0.4)]">
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

      {/* Items list — scrollable / empty state */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 min-h-0">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingCart className="h-10 w-10 text-zinc-500" />
            <p className="text-[7px] leading-4 text-zinc-500">
              SELECT A PRODUCT TO SEE IT HERE
            </p>
          </div>
        ) : (
          grouped.map((item) => (
            <CartItemPanel key={item.productId} item={item} />
          ))
        )}
      </div>

      {/* Total + CTA — pinned at bottom, only when there's data */}
      {!isEmpty && (
      <div className="flex-shrink-0 border-t-4 border-zinc-700 p-3 flex flex-col gap-2">
        <div className="rounded-xl border-4 border-zinc-700 bg-zinc-800 px-3 py-2 text-center shadow-inner">
          <p className="text-[7px] text-zinc-400">TOTAL</p>
          <p className="mt-0.5 text-sm font-bold text-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]">
            {formatPrice(data.pricing.total)}
          </p>
        </div>
        <Button className="p-5 flex w-full border-2 border-purple-900 bg-purple-600 text-white hover:bg-purple-700 active:scale-95" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-8 w-8" />
            GO TO CART
          </Link>
        </Button>
      </div>
      )}
    </aside>
  );
};
