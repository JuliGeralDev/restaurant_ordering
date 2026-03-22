"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

interface RetroMenuCardProps {
  name: string;
  price: number;
  image: string;
  hasModifiers?: boolean;
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
  return `$${(price / 100).toFixed(2)}`;
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

const ActionArea = () => {
  return (
    <div className="flex items-center gap-2">
      <Button className="relative h-11 w-11 rounded-full border-4 border-purple-900 bg-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-purple-700 active:scale-95">
        <ShoppingCart className="absolute h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs font-bold text-zinc-900">
          +
        </span>
      </Button>

      <div className="h-6 w-6 self-end rounded-full border-2 border-zinc-800 bg-zinc-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]" />
    </div>
  );
};

export const RetroMenuCard = ({
  name,
  price,
  image,
  hasModifiers,
}: RetroMenuCardProps) => {
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

      <CardContent className="flex flex-col gap-3 p-3">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-[6px] border-zinc-700 bg-black shadow-2xl shadow-black/50">
          <img src={image} alt={name} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        <div className="rounded-2xl border-4 border-zinc-400 bg-zinc-300 p-4 shadow-inner">
          <PriceDisplay price={price} />

          <div className="flex items-center justify-between px-1">
            <DPad />

            {hasModifiers && (
              <span className="rounded bg-zinc-600 px-2 py-0.5 font-press-start text-[6px] font-bold tracking-widest text-green-400 shadow-md">
                + OPTIONS
              </span>
            )}

            <ActionArea />
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
