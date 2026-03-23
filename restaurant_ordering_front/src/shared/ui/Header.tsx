"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, UtensilsCrossed, ClipboardList, User2 } from "lucide-react";

import type { OrderResponse } from "@/features/cart/cart.types";
import { useCartStore } from "@/shared/stores/cartStore";
import type { UserProfile } from "@/shared/types/user";
import { Button } from "@/shared/ui/button";
import { UserProfileModal } from "@/shared/ui/UserProfileModal";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const orderData = useCartStore((s: { orderData: OrderResponse | null }) => s.orderData);
  const userProfile = useCartStore((s: { userProfile: UserProfile | null }) => s.userProfile);
  const cartItemsCount =
    orderData?.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="font-bold text-xl">Restaurant</span>
        </Link>

        <nav className="flex items-center space-x-2 md:space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Menu</span>
            </Button>
          </Link>

          <Link href="/orders">
            <Button variant="ghost" size="sm">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">My Orders</span>
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cart</span>
            </Button>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[7px] font-bold text-white shadow p-1">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="sm"
              className="max-w-[10rem] justify-start"
              onClick={() => setIsProfileOpen((current) => !current)}
              aria-expanded={isProfileOpen}
              aria-haspopup="dialog"
            >
              <User2 className="h-4 w-4 mr-2" />
              <span className="truncate">{userProfile?.name ?? "Sign In"}</span>
            </Button>

            <UserProfileModal
              isOpen={isProfileOpen}
              userProfile={userProfile}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};
