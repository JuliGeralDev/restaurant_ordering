"use client";

import { useState } from "react";

import { groupModifierSelections } from "@/features/cart/lib/groupModifierSelections";
import type { Modifiers } from "../menu.types";
import { addGroupedSelectionsToCart } from "../lib/addGroupedSelectionsToCart";
import { CardConsola } from "@/shared/ui/CardConsola";
import { QuantityStepper } from "@/shared/ui/QuantityStepper";
import { RetroDPad } from "@/shared/ui/RetroDPad";
import { RetroPriceDisplay } from "@/shared/ui/RetroPriceDisplay";
import { RetroModifiersModal } from "./RetroModifiersModal";
import type { FlatModifier } from "../hooks/useModifiersModal";

const hasModifiers = (modifiers?: Modifiers) =>
  Boolean(modifiers && (modifiers.protein || modifiers.toppings || modifiers.sauces));

interface RetroMenuCardProps {
  productId: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  modifiers?: Modifiers;
  onAddToCart?: (
    quantity: number,
    selectedModifiers?: Array<{
      groupId: string;
      optionId: string;
      name: string;
      price: number;
    }>
  ) => void;
}

const ActionArea = ({
  quantity,
  setQuantity,
  onAddToCart,
}: {
  quantity: number;
  setQuantity: (quantity: number) => void;
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

  const handleAddItem = async (
    selections: FlatModifier[][]
  ) => {
    const groupedSelections = groupModifierSelections(selections);
    await addGroupedSelectionsToCart(groupedSelections.values(), onAddToCart);
  };

  return (
    <>
      <CardConsola
        title={name}
        className="w-full max-w-sm min-h-[25rem] sm:min-h-[23rem] lg:min-h-[20rem]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full flex-col gap-3 p-3">
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

          <div className="mt-auto rounded-2xl border-4 border-zinc-400 bg-zinc-300 p-4 shadow-inner">
            <RetroPriceDisplay price={price} />
            <div className="flex items-center justify-between px-1">
              <RetroDPad />
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
          onSubmit={handleAddItem}
        />
      )}
    </>
  );
};
