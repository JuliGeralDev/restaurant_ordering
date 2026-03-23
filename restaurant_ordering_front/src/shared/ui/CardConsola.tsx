"use client";

import type { MouseEventHandler, ReactNode } from "react";

import {
  RetroDecorativeScrews,
  RetroSpeakerGrille,
} from "@/shared/ui/RetroConsolePrimitives";

const TOP_GRILLE_ITEMS = 6;
const BOTTOM_GRILLE_ITEMS = 10;
const SCREW_POSITIONS = [
  "top-3 left-3",
  "top-3 right-3",
  "bottom-3 left-3",
  "bottom-3 right-3",
] as const;

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
    className={`m-auto relative overflow-hidden rounded-[2rem] border-[10px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-zinc-600/50 ${className}`.trim()}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <RetroSpeakerGrille
      amount={TOP_GRILLE_ITEMS}
      itemClassName="h-0.5 w-2 rounded-full bg-zinc-600/50"
      className="flex justify-center gap-1 py-0.5"
    />

    <div className="border-y-4 border-zinc-700 bg-zinc-600 py-2 text-[10px] font-bold uppercase tracking-wider text-green-400 shadow-inner grid grid-cols-[1fr_auto_1fr] items-center px-3">
      <span />
      <span>{title}</span>
      {headerAction ? (
        <span className="flex justify-end">{headerAction}</span>
      ) : (
        <span />
      )}
    </div>

    {children}

    <RetroSpeakerGrille
      amount={BOTTOM_GRILLE_ITEMS}
      itemClassName="h-1 w-0.5 rounded-full bg-zinc-600/50"
      className="flex justify-center gap-0.5 py-1"
    />
    <RetroDecorativeScrews positions={SCREW_POSITIONS} />
  </div>
);
