"use client";

import { ShoppingBag } from "lucide-react";
import { CardConsola } from "@/shared/ui/CardConsola";
import { Button } from "@/shared/ui/button";
import type { OrderPricingDto } from "@/features/cart/cart.types";
import type { GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";

interface CartOrderSummaryProps {
  pricing: OrderPricingDto;
  items?: GroupedCartItem[];
  onConfirm?: () => void;
  isLoading?: boolean;
}

const PricingRow = ({
  label,
  value,
  bold,
  large,
}: {
  label: string;
  value: number;
  bold?: boolean;
  large?: boolean;
}) => (
  <div
    className={`flex items-center justify-between gap-4 ${bold ? "font-bold" : "font-medium"}`}
  >
    <span
      className={`uppercase tracking-wide text-zinc-400 ${large ? "text-xs" : "text-[10px]"}`}
    >
      {label}
    </span>
    <span
      className={`font-bold tabular-nums text-green-400 ${large ? "text-base" : "text-xs"}`}
    >
      ${value.toLocaleString("es-CO")}
    </span>
  </div>
);

export const CartOrderSummary = ({
  pricing,
  items,
  onConfirm,
  isLoading = false,
}: CartOrderSummaryProps) => (
  <CardConsola title="PAYMENT">
    <div className="flex flex-col gap-3 bg-zinc-800 p-4">
      {/* Items list */}
      {items && items.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5">
          {[...items].sort((a, b) => a.productId.localeCompare(b.productId)).map((item) => (
            <div key={item.key} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-zinc-200">
                  {item.totalQuantity}× {item.name}
                </span>
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-green-400">
                  ${(item.basePrice * item.totalQuantity).toLocaleString("es-CO")}
                </span>
              </div>
              {item.modifiers.length > 0 && (
                <ul className="ml-3 flex flex-col gap-0.5">
                  {item.modifiers.map((mod) => (
                    <li key={mod.optionId} className="flex items-center justify-between gap-2">
                      <span className="text-[9px] uppercase tracking-wide text-zinc-500">
                        + {mod.name}
                      </span>
                      {mod.price.amount > 0 && (
                        <span className="text-[9px] tabular-nums text-yellow-500">
                          +${mod.price.amount.toLocaleString("es-CO")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pricing breakdown */}
      <div className="flex flex-col gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5">
        <PricingRow label="Subtotal" value={pricing.subtotal} />
        <PricingRow label="Tax" value={pricing.tax} />
        <PricingRow label="Service fee" value={pricing.serviceFee} />

        {/* Divider */}
        <div className="h-px w-full bg-zinc-700" />

        <PricingRow label="Total" value={pricing.total} bold large />
      </div>

      {/* CTA */}
      <Button
        className="w-full rounded-lg border-2 border-purple-600 bg-purple-700 text-[11px] font-bold uppercase tracking-widest text-white shadow-md hover:bg-purple-600 active:bg-purple-800 disabled:opacity-60"
        onClick={onConfirm}
        disabled={isLoading}
      >
        <ShoppingBag />
        {isLoading ? "PROCESSING..." : "CONFIRM ORDER"}
      </Button>
    </div>
  </CardConsola>
);
