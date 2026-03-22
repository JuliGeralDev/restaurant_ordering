"use client";

import Link from "next/link";
import { ShoppingCart, UtensilsCrossed, ClipboardList } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCartStore } from "@/shared/stores/cartStore";

export const Header = () => {
  const orderData = useCartStore((s) => s.orderData);
  const cartItemsCount = orderData?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="font-bold text-xl">Restaurant</span>
        </Link>

        {/* Navigation */}
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
        </nav>
      </div>
    </header>
  );
};
