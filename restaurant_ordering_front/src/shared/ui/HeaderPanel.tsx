"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface HeaderPanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const HeaderPanel = ({
  title,
  isOpen,
  onClose,
  children,
  className = "w-[21rem] max-w-[calc(100vw-2rem)]",
}: HeaderPanelProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-full z-[70] mt-2 overflow-hidden rounded-[1.35rem] border-[6px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-black/60 ${className}`}
    >
      <div className="border-b-4 border-zinc-700 bg-zinc-600 px-3 py-2.5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <span />
          <span className="justify-self-center text-[9px] font-bold uppercase tracking-[0.22em] text-green-400">
            {title}
          </span>
          <div className="justify-self-end">
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-zinc-200 hover:bg-white/10 hover:text-white"
              onClick={onClose}
              aria-label={`Close ${title.toLowerCase()}`}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 px-3 py-3.5">{children}</div>
    </div>
  );
};
