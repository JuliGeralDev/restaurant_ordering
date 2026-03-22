"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

interface RetroMenuCardProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  hasModifiers?: boolean;
  onAddToCart?: (quantity: number) => void;
}

const TOP_GRILLE_ITEMS = 6;
const BOTTOM_GRILLE_ITEMS = 10;
const SCREW_POSITIONS = [
  "top-3 left-3",
  "top-3 right-3",
  "bottom-3 left-3",
  "bottom-3 right-3",
] as const;

const D_PAD_PARTS = [
  "absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
] as const;

const formatPrice = (price: number) => {
  const priceInPesos = price;
  return `$${priceInPesos.toLocaleString('es-CO')}`;
};

const SpeakerGrille = ({
  amount,
  itemClassName,
  wrapperClassName,
}: {
  amount: number;
  itemClassName: string;
  wrapperClassName: string;
}) => {
  return (
    <div className={wrapperClassName}>
      {Array.from({ length: amount }).map((_, index) => (
        <div key={index} className={itemClassName} />
      ))}
    </div>
  );
};

const DecorativeScrews = () => {
  return (
    <>
      {SCREW_POSITIONS.map((position) => (
        <div
          key={position}
          className={`absolute ${position} h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner`}
        />
      ))}
    </>
  );
};

const DPad = () => {
  return (
    <div className="relative h-12 w-12">
      {D_PAD_PARTS.map((partClassName) => (
        <div key={partClassName} className={partClassName} />
      ))}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 shadow-inner" />
    </div>
  );
};

const PriceDisplay = ({ price }: { price: number }) => {
  return (
    <div className="mb-2 rounded-xl border-4 border-zinc-700 bg-zinc-800 px-3 py-2 text-center font-press-start text-lg font-bold text-green-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
      {formatPrice(price)}
    </div>
  );
};

const ActionArea = ({ quantity, setQuantity, onAddToCart }: { quantity: number; setQuantity: (q: number) => void; onAddToCart?: () => void }) => {
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(99, value)));
  };

  return (
    <div className="flex items-center gap-1">
      {/* Unified Quantity + Cart Control */}
      <div className="flex items-center gap-1 bg-zinc-700/50 rounded-xl p-1 border-2 border-zinc-800">
        {/* Decrease Button */}
        <button
          onClick={decrementQuantity}
          className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-zinc-600 border-2 border-zinc-800 text-green-400 font-bold text-lg transition-colors flex items-center justify-center"
        >
          −
        </button>

        {/* Quantity Input */}
        <input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={handleInputChange}
          className="w-9 h-7 text-center bg-zinc-800 border-2 border-zinc-900 rounded-md text-green-400 font-press-start text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-green-400/50"
        />

        {/* Increase Button */}
        <button
          onClick={incrementQuantity}
          className="w-7 h-7 rounded-lg bg-zinc-700 hover:bg-zinc-600 border-2 border-zinc-800 text-green-400 font-bold text-lg transition-colors flex items-center justify-center"
        >
          +
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-zinc-800 mx-0.5"></div>

        {/* Add to Cart Button (inside same container) */}
        <button
          onClick={onAddToCart}
          className="w-9 h-9 rounded-lg bg-purple-600 hover:bg-purple-700 border-2 border-purple-900 text-white shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      {/* Decorative Power Button */}
      {/* <div className="h-6 w-6 self-end rounded-full border-2 border-zinc-800 bg-zinc-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]" /> */}
    </div>
  );
};

export const RetroMenuCard = ({
  productId,
  name,
  price,
  image,
  hasModifiers,
  onAddToCart,
}: RetroMenuCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
    }
  };

  return (
    <Card className="relative max-w-sm overflow-hidden rounded-[2rem] border-[10px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-zinc-600/50">
      <SpeakerGrille
        amount={TOP_GRILLE_ITEMS}
        itemClassName="h-0.5 w-2 rounded-full bg-zinc-600/50"
        wrapperClassName="flex justify-center gap-1 py-0.5"
      />

      <div className="bg-zinc-600 text-green-400 font-bold text-center py-2 text-[10px] tracking-wider uppercase border-y-4 border-zinc-700 shadow-inner font-press-start">
        {name}
      </div>

      <CardContent className="p-3 flex flex-col gap-3">
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border-[6px] border-zinc-700 bg-black shadow-2xl shadow-black/50">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        <div className="bg-zinc-300 rounded-2xl p-4 shadow-inner border-4 border-zinc-400">
          <PriceDisplay price={price} />

          <div className="flex items-center justify-between px-1">
            <DPad />

            {hasModifiers && (
              <span className="font-press-start text-[6px] font-bold tracking-widest bg-zinc-600 rounded px-2 py-0.5 text-green-400 shadow-md">
                + OPTIONS
              </span>
            )}

            <ActionArea quantity={quantity} setQuantity={setQuantity} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </CardContent>

      <SpeakerGrille
        amount={BOTTOM_GRILLE_ITEMS}
        itemClassName="h-1 w-0.5 rounded-full bg-zinc-600/50"
        wrapperClassName="flex justify-center gap-0.5 py-1"
      />
      <DecorativeScrews />
    </Card>
  );
};
