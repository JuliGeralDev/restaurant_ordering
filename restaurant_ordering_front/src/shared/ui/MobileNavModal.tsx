"use client";

import Link from "next/link";
import { ClipboardList, ShoppingCart, User2, UtensilsCrossed } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { HeaderPanel } from "@/shared/ui/HeaderPanel";

interface MobileNavModalProps {
  isOpen: boolean;
  cartItemsCount: number;
  userLabel: string;
  onClose: () => void;
  onOpenProfile: () => void;
}

const navItems = [
  {
    href: "/",
    label: "Menu",
    icon: UtensilsCrossed,
  },
  {
    href: "/orders",
    label: "My Orders",
    icon: ClipboardList,
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingCart,
  },
] as const;

export const MobileNavModal = ({
  isOpen,
  cartItemsCount,
  userLabel,
  onClose,
  onOpenProfile,
}: MobileNavModalProps) => (
  <HeaderPanel
    title="Navigation"
    isOpen={isOpen}
    onClose={onClose}
    className="w-[18rem] max-w-[calc(100vw-1rem)]"
  >
    <div className="space-y-2.5">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} onClick={onClose} className="block">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:bg-zinc-800 hover:text-green-400"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-green-400" />
              <span>{label}</span>
            </span>
            {label === "Cart" && cartItemsCount > 0 ? (
              <span className="rounded-full bg-green-600 px-2 py-0.5 text-[8px] text-white">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            ) : null}
          </Button>
        </Link>
      ))}

      <Button
        variant="ghost"
        className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-100 hover:bg-zinc-800 hover:text-green-400"
        onClick={onOpenProfile}
      >
        <span className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-green-400" />
          <span>Profile</span>
        </span>
        <span className="max-w-[7rem] truncate text-[9px] uppercase tracking-wide text-zinc-400">
          {userLabel}
        </span>
      </Button>
    </div>
  </HeaderPanel>
);
