"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useGetOrder } from "@/features/cart/hooks/useGetOrder";
import { useGroupedCartItems, type GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useGetMenu } from "@/features/menu/hooks/useGetMenu";
import { CartItemRow } from "@/features/cart/ui/CartItemRow";
import { CartOrderSummary } from "@/features/cart/ui/CartOrderSummary";
import { RetroModifiersModal } from "@/features/menu/ui/RetroModifiersModal";

export default function CartPage() {
  const { data } = useGetOrder();
  const { data: menuItems } = useGetMenu();
  const { addToCart } = useAddToCart();
  const grouped = useGroupedCartItems(data?.items ?? []);

  const [modalProduct, setModalProduct] = useState<GroupedCartItem | null>(null);

  const isEmpty = !data || data.items.length === 0;

  const handleIncrement = (item: GroupedCartItem) => {
    if (item.hasModifiers) {
      setModalProduct(item);
    } else {
      addToCart(item.productId, 1);
    }
  };

  const handleModalConfirm = (
    selections: Array<{ groupId: string; optionId: string; name: string; price: number }[]>
  ) => {
    if (!modalProduct) return;
    addToCart(modalProduct.productId, 1, selections[0] ?? []);
    setModalProduct(null);
  };

  const modalMenuItem = modalProduct
    ? menuItems.find((m) => m.id === modalProduct.productId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-sm font-bold uppercase tracking-widest text-green-400">
        MY CART
      </h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-zinc-500" />
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Your cart is empty
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: item list — 60% */}
          <div className="flex w-full flex-col gap-4 lg:w-[60%]">
            {grouped.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onIncrement={() => handleIncrement(item)}
              />
            ))}
          </div>

          {/* Right: order summary — 40% */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-20">
            <CartOrderSummary pricing={data.pricing} />
          </div>
        </div>
      )}

      {modalMenuItem && (
        <RetroModifiersModal
          isOpen={true}
          onClose={() => setModalProduct(null)}
          productName={modalMenuItem.name}
          basePrice={modalMenuItem.price}
          quantity={1}
          modifiers={modalMenuItem.modifiers ?? {}}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}

