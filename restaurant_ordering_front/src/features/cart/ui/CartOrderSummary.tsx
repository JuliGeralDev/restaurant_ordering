"use client";

import { ShoppingBag } from "lucide-react";

import type { OrderPricingDto } from "@/features/cart/cart.types";
import type { GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { CardConsola } from "@/shared/ui/CardConsola";
import { Button } from "@/shared/ui/button";
import { OrderLineItems } from "@/shared/ui/OrderLineItems";
import { PricingBreakdown } from "@/shared/ui/PricingBreakdown";

interface CartOrderSummaryProps {
  pricing: OrderPricingDto;
  items?: GroupedCartItem[];
  onConfirm?: () => void;
  isLoading?: boolean;
}

export const CartOrderSummary = ({
  pricing,
  items,
  onConfirm,
  isLoading = false,
}: CartOrderSummaryProps) => {
  const lineItems = [...(items ?? [])]
    .sort((a, b) => a.productId.localeCompare(b.productId))
    .map((item) => {
      const modifiersUnitTotal = item.modifiers.reduce(
        (total, modifier) => total + modifier.price.amount,
        0,
      );

      return {
        key: item.key,
        name: item.name,
        quantity: item.totalQuantity,
        total: (item.basePrice + modifiersUnitTotal) * item.totalQuantity,
        modifiers: item.modifiers.map((modifier) => ({
          key: `${item.key}-${modifier.groupId}-${modifier.optionId}`,
          name: modifier.name,
          price: modifier.price.amount * item.totalQuantity,
        })),
      };
    });

  return (
    <CardConsola title="PAYMENT">
      <div className="flex flex-col gap-3 bg-zinc-800 p-4">
        {lineItems.length > 0 && (
          <OrderLineItems
            items={lineItems}
            className="flex flex-col gap-1.5 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5"
            nameClassName="text-[11px] font-semibold text-zinc-200"
            totalClassName="shrink-0 text-[11px] font-bold tabular-nums text-green-400"
          />
        )}

        <PricingBreakdown
          rows={[
            { label: "Subtotal", value: pricing.subtotal },
            { label: "Tax", value: pricing.tax },
            { label: "Service fee", value: pricing.serviceFee },
          ]}
          total={pricing.total}
          className="flex flex-col gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5"
          rowValueClassName="text-xs font-bold tabular-nums text-green-400"
          totalValueClassName="text-base font-bold tabular-nums text-green-400"
        />

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
};
