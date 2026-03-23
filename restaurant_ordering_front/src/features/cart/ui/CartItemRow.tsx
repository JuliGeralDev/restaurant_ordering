"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import type { GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { formatCurrency } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";
import {
  RetroDecorativeScrews,
  RetroSpeakerGrille,
} from "@/shared/ui/RetroConsolePrimitives";
import { QuantityStepper } from "@/shared/ui/QuantityStepper";

interface CartItemRowProps {
  item: GroupedCartItem;
  onIncrement: () => void;
  onDecrement?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

const TOP_GRILLE_ITEMS = 4;
const BOTTOM_GRILLE_ITEMS = 6;
const SCREW_POSITIONS = [
  "top-2 left-2",
  "top-2 right-2",
  "bottom-2 left-2",
  "bottom-2 right-2",
] as const;

export const CartItemRow = ({
  item,
  onIncrement,
  onDecrement,
  onEdit,
  onRemove,
}: CartItemRowProps) => {
  const modifiersUnitPrice = item.modifiers.reduce(
    (total, modifier) => total + modifier.price.amount,
    0,
  );
  const totalPrice = formatCurrency(
    (item.basePrice + modifiersUnitPrice) * item.totalQuantity,
  );

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border-[8px] border-zinc-500 bg-zinc-400 shadow-xl shadow-zinc-600/50">
      <RetroSpeakerGrille
        amount={TOP_GRILLE_ITEMS}
        itemClassName="h-0.5 w-2 rounded-full bg-zinc-600/50"
        className="flex justify-center gap-1 py-0.5"
      />

      <div className="relative border-y-4 border-zinc-700 bg-zinc-600 px-3 py-1.5">
        <div className="flex items-center justify-between">
          <span className="truncate pr-2 text-[10px] font-bold uppercase tracking-wider text-green-400">
            {item.name}
          </span>
          <div className="flex items-center gap-1">
            {item.hasModifiers && onEdit && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-white hover:bg-white/10 hover:text-white"
                onClick={onEdit}
                aria-label="Edit modifiers"
              >
                <Pencil />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                onClick={onRemove}
                aria-label="Remove item"
              >
                <Trash2 />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 px-3 py-3">
        <div className="shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border-4 border-zinc-600 bg-zinc-700">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-green-400">
                {item.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          {item.modifiers.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {item.modifiers.map((modifier) => (
                <li
                  key={modifier.optionId}
                  className="flex items-center justify-between gap-1"
                >
                  <span className="text-[9px] uppercase tracking-wide text-zinc-600">
                    + {modifier.name}
                  </span>
                  {modifier.price.amount > 0 && (
                    <span className="shrink-0 text-[9px] tabular-nums text-yellow-700">
                      +{formatCurrency(modifier.price.amount * item.totalQuantity)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-green-800">{totalPrice}</span>

            <QuantityStepper
              quantity={item.totalQuantity}
              onChange={(newQty) => {
                if (newQty > item.totalQuantity) onIncrement();
                else onDecrement?.();
              }}
            />
          </div>
        </div>
      </div>

      <RetroSpeakerGrille
        amount={BOTTOM_GRILLE_ITEMS}
        itemClassName="h-1 w-0.5 rounded-full bg-zinc-600/50"
        className="flex justify-center gap-0.5 py-1"
      />
      <RetroDecorativeScrews positions={SCREW_POSITIONS} />
    </div>
  );
};
