"use client";

import { useCartPage } from "@/features/cart/hooks/useCartPage";
import { CartContent } from "@/features/cart/ui/CartContent";
import { CartEmptyState } from "@/features/cart/ui/CartEmptyState";

export default function CartPage() {
  const {
    order,
    sortedItems,
    isEmpty,
    isConfirming,
    confirmOrder,
    handleIncrement,
    handleDecrement,
    handleRemoveAll,
  } = useCartPage();

  return (
    <div className="container xl:w-[70%] px-4 py-8 m-auto">
      <h1 className="m-auto mb-6 text-xl text-center font-bold uppercase tracking-widest">
        MY CART
      </h1>

      {isEmpty || !order ? (
        <CartEmptyState />
      ) : (
        <CartContent
          items={sortedItems}
          pricing={order.pricing}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemoveAll={handleRemoveAll}
          onConfirm={confirmOrder}
          isConfirming={isConfirming}
        />
      )}
    </div>
  );
}
