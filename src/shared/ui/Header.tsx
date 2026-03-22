"use client";

import Link from "next/link";
import { ShoppingCart, UtensilsCrossed, ClipboardList } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export const Header = () => {
  // TODO: Replace with actual cart count from state/context
  const cartItemsCount = 0;

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

          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
