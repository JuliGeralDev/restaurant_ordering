import { ShoppingCart } from "lucide-react";

export const CartEmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <ShoppingCart className="h-16 w-16 text-zinc-500" />
    <p className="text-xs uppercase tracking-widest text-zinc-500">
      Your cart is empty
    </p>
  </div>
);
