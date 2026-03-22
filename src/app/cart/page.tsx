"use client";

import { ShoppingCart } from "lucide-react";
import { useGetOrder } from "@/features/cart/hooks/useGetOrder";
import { CartItemRow } from "@/features/cart/ui/CartItemRow";
import { CartOrderSummary } from "@/features/cart/ui/CartOrderSummary";

export default function CartPage() {
  const { data } = useGetOrder();

  const isEmpty = !data || data.items.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-sm font-bold uppercase tracking-widest text-green-400">
        MY CART
      </h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-zinc-500" />
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Your cart is empty
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: item list — 60% */}
          <div className="flex w-full flex-col gap-4 lg:w-[60%]">
            {data.items.map((item, idx) => (
              <CartItemRow key={item.cartItemId ?? `${item.productId}-${idx}`} item={item} />
            ))}
          </div>

          {/* Right: order summary — 40% */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-20">
            <CartOrderSummary pricing={data.pricing} />
          </div>
        </div>
      )}
    </div>
  );
}
