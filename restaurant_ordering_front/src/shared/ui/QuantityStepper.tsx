"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  onAddToCart?: () => void;
  min?: number;
  max?: number;
}

export const QuantityStepper = ({
  quantity,
  onChange,
  onAddToCart,
  min = 1,
  max = 99,
}: QuantityStepperProps) => {
  const decrement = () => { if (quantity > min) onChange(quantity - 1); };
  const increment = () => { if (quantity < max) onChange(quantity + 1); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10) || min;
    onChange(Math.max(min, Math.min(max, v)));
  };

  return (
    <div className="flex items-center gap-1 rounded-xl border-2 border-zinc-800 bg-zinc-700/50 p-1">
      <Button variant="stepper" size="icon-sm" onClick={decrement}>-</Button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        className="h-7 w-9 rounded-md border-2 border-zinc-900 bg-zinc-800 text-center text-xs text-green-400 [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-green-400/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <Button variant="stepper" size="icon-sm" onClick={increment}>+</Button>

      {onAddToCart && (
        <>
          <div className="mx-0.5 h-7 w-px bg-zinc-800" />
          <Button
            size="icon-lg"
            onClick={onAddToCart}
            className="border-2 border-purple-900 bg-purple-600 text-white shadow-md hover:scale-105 hover:bg-purple-700 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};
