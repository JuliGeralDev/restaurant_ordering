"use client";

import { ShoppingBag } from "lucide-react";
import { CardConsola } from "@/shared/ui/CardConsola";
import { Button } from "@/shared/ui/button";
import type { OrderPricingDto } from "@/features/cart/cart.types";

interface CartOrderSummaryProps {
  pricing: OrderPricingDto;
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
      ${value.toFixed(2)}
    </span>
  </div>
);

export const CartOrderSummary = ({
  pricing,
  onConfirm,
  isLoading = false,
}: CartOrderSummaryProps) => (
  <CardConsola title="PAYMENT">
    <div className="flex flex-col gap-3 bg-zinc-800 p-4">
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
