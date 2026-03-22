"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { OrderItemDto } from "@/features/cart/cart.types";

interface CartItemRowProps {
  item: OrderItemDto;
  onRemove?: (cartItemId: string) => void;
  onDecrement?: (cartItemId: string) => void;
  onIncrement?: (cartItemId: string) => void;
}

const TOP_GRILLE_ITEMS = 4;
const BOTTOM_GRILLE_ITEMS = 6;

const SpeakerGrille = ({
  amount,
  itemClassName,
  wrapperClassName,
}: {
  amount: number;
  itemClassName: string;
  wrapperClassName: string;
}) => (
  <div className={wrapperClassName}>
    {Array.from({ length: amount }).map((_, i) => (
      <div key={i} className={itemClassName} />
    ))}
  </div>
);

const DecorativeScrews = () => (
  <>
    {(["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"] as const).map(
      (pos) => (
        <div
          key={pos}
          className={`absolute ${pos} h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner`}
        />
      )
    )}
  </>
);

export const CartItemRow = ({
  item,
  onRemove,
  onDecrement,
  onIncrement,
}: CartItemRowProps) => {
  const totalPrice = (item.basePrice * item.quantity).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border-[8px] border-zinc-500 bg-zinc-400 shadow-xl shadow-zinc-600/50">
      <SpeakerGrille
        amount={TOP_GRILLE_ITEMS}
        itemClassName="h-0.5 w-2 rounded-full bg-zinc-600/50"
        wrapperClassName="flex justify-center gap-1 py-0.5"
      />

      {/* Header strip */}
      <div className="relative border-y-4 border-zinc-700 bg-zinc-600 px-3 py-1.5">
        <div className="flex items-center justify-between">
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-green-400 pr-2">
            {item.name}
          </span>
          {item.cartItemId && onRemove && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-red-400 hover:bg-red-900/40 hover:text-red-300"
              onClick={() => onRemove(item.cartItemId!)}
              aria-label="Remove item"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>

      {/* Body: image + details */}
      <div className="flex flex-row gap-3 px-3 py-3">
        {/* Product image */}
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

        {/* Right section */}
        <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
          {/* Modifier tags */}
          {item.modifiers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.modifiers.map((mod) => (
                <span
                  key={`${mod.groupId}-${mod.optionId}`}
                  className="rounded border border-zinc-500 bg-zinc-700 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-zinc-300"
                >
                  {mod.name}
                </span>
              ))}
            </div>
          )}

          {/* Price + quantity stepper */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <span className="text-sm font-bold text-green-800">
              ${totalPrice}
            </span>

            {/* Quantity stepper */}
            <div className="flex items-center gap-1 rounded-lg border-2 border-zinc-600 bg-zinc-700 px-1 py-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-green-400 hover:bg-zinc-600 hover:text-green-300"
                onClick={() => item.cartItemId && onDecrement?.(item.cartItemId)}
                aria-label="Decrease quantity"
              >
                <Minus />
              </Button>
              <span className="min-w-[1.25rem] text-center text-xs font-bold text-green-400">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-green-400 hover:bg-zinc-600 hover:text-green-300"
                onClick={() => item.cartItemId && onIncrement?.(item.cartItemId)}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SpeakerGrille
        amount={BOTTOM_GRILLE_ITEMS}
        itemClassName="h-1 w-0.5 rounded-full bg-zinc-600/50"
        wrapperClassName="flex justify-center gap-0.5 py-1"
      />
      <DecorativeScrews />
    </div>
  );
};
