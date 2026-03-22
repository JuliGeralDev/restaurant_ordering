"use client";

import type { MouseEventHandler, ReactNode } from "react";

const TOP_GRILLE_ITEMS = 6;
const BOTTOM_GRILLE_ITEMS = 10;
const SCREW_POSITIONS = [
  "top-3 left-3",
  "top-3 right-3",
  "bottom-3 left-3",
  "bottom-3 right-3",
] as const;

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
    {Array.from({ length: amount }).map((_, index) => (
      <div key={index} className={itemClassName} />
    ))}
  </div>
);

const DecorativeScrews = () => (
  <>
    {SCREW_POSITIONS.map((position) => (
      <div
        key={position}
        className={`absolute ${position} h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner`}
      />
    ))}
  </>
);

interface CardConsolaProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

export const CardConsola = ({
  title,
  children,
  className = "",
  headerAction,
  onMouseEnter,
  onMouseLeave,
}: CardConsolaProps) => (
  <div
    className={`relative overflow-hidden rounded-[2rem] border-[10px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-zinc-600/50 ${className}`.trim()}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <SpeakerGrille
      amount={TOP_GRILLE_ITEMS}
      itemClassName="h-0.5 w-2 rounded-full bg-zinc-600/50"
      wrapperClassName="flex justify-center gap-1 py-0.5"
    />

    <div className="relative border-y-4 border-zinc-700 bg-zinc-600 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-green-400 shadow-inner">
      {title}
      {headerAction}
    </div>

    {children}

    <SpeakerGrille
      amount={BOTTOM_GRILLE_ITEMS}
      itemClassName="h-1 w-0.5 rounded-full bg-zinc-600/50"
      wrapperClassName="flex justify-center gap-0.5 py-1"
    />
    <DecorativeScrews />
  </div>
);
