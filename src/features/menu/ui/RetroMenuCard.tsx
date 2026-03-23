"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import type { Modifiers } from "../menu.types";
import { CardConsola } from "@/shared/ui/CardConsola";
import { QuantityStepper } from "@/shared/ui/QuantityStepper";
import { RetroModifiersModal } from "./RetroModifiersModal";

const formatPrice = (price: number) => `$${price.toLocaleString("es-CO")}`;

const hasModifiers = (modifiers?: Modifiers) =>
  Boolean(modifiers && (modifiers.protein || modifiers.toppings || modifiers.sauces));

interface RetroMenuCardProps {
  productId: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  modifiers?: Modifiers;
  onAddToCart?: (quantity: number, selectedModifiers?: Array<{groupId: string; optionId: string; name: string; price: number}>) => void;
}

const D_PAD_PARTS = [
  "absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
] as const;

const DPad = () => (
  <div className="relative h-12 w-12">
    {D_PAD_PARTS.map((cls) => (
      <div key={cls} className={cls} />
    ))}
    <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 shadow-inner" />
  </div>
);

const PriceDisplay = ({ price }: { price: number }) => (
  <div className="mb-2 rounded-xl border-4 border-zinc-700 bg-zinc-800 px-3 py-2 text-center text-lg font-bold text-green-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
    {formatPrice(price)}
  </div>
);

const ActionArea = ({
  quantity,
  setQuantity,
  onAddToCart,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart?: () => void;
}) => (
  <div className="flex items-center gap-1">
    <QuantityStepper
      quantity={quantity}
      onChange={setQuantity}
      onAddToCart={onAddToCart}
    />
  </div>
);

export const RetroMenuCard = ({
  productId: _productId,
  name,
  description,
  price,
  image,
  modifiers,
  onAddToCart,
}: RetroMenuCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const productHasModifiers = hasModifiers(modifiers);

  const handleAddToCart = () => {
    if (productHasModifiers) {
      setModalOpen(true);
      return;
    }
    onAddToCart?.(quantity);
  };

  const handleAddItem = (mods: Array<{groupId: string; optionId: string; name: string; price: number}>) => {
    onAddToCart?.(1, mods);
  };

  return (
    <>
      <CardConsola
        title={name}
        className="max-w-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col gap-3 p-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-6 border-zinc-700 bg-black shadow-2xl shadow-black/50">
            <img
              src={image}
              alt={name}
              className={`h-full w-full object-cover transition-all duration-300 ${
                isHovered ? "brightness-[0.2]" : "brightness-100"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            {isHovered && description && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto px-4 py-3 text-center">
                <p className="text-xs leading-4 text-green-400">{description}</p>
                {productHasModifiers && (
                  <p className="shrink-0 text-[10px] leading-4 text-yellow-400">
                    You must choose at least one add-on
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border-4 border-zinc-400 bg-zinc-300 p-4 shadow-inner">
            <PriceDisplay price={price} />
            <div className="flex items-center justify-between px-1">
              <DPad />
              <ActionArea
                quantity={quantity}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </CardConsola>

      {productHasModifiers && modifiers && (
        <RetroModifiersModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productName={name}
          basePrice={price}
          quantity={quantity}
          modifiers={modifiers}
          onAddItem={handleAddItem}
        />
      )}
    </>
  );
};