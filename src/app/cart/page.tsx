"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useGetOrder } from "@/features/cart/hooks/useGetOrder";
import { useGroupedCartItems, type GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useRemoveCartItem } from "@/features/cart/hooks/useRemoveCartItem";
import { useGetMenu } from "@/features/menu/hooks/useGetMenu";
import { CartItemRow } from "@/features/cart/ui/CartItemRow";
import { CartOrderSummary } from "@/features/cart/ui/CartOrderSummary";
import { RetroModifiersModal } from "@/features/menu/ui/RetroModifiersModal";

export default function CartPage() {
  const { data } = useGetOrder();
  const { data: menuItems } = useGetMenu();
  const { addToCart } = useAddToCart();
  const { removeCartItem, removeAllItems } = useRemoveCartItem();
  const grouped = useGroupedCartItems(data?.items ?? [], true);

  const [modalProduct, setModalProduct] = useState<GroupedCartItem | null>(null);

  const isEmpty = !data || data.items.length === 0;

  const handleDecrement = (item: GroupedCartItem) => {
    const cartItemId = item.cartItemIds.at(-1);
    if (cartItemId) removeCartItem(cartItemId);
  };

  const handleRemoveAll = (item: GroupedCartItem) => {
    removeAllItems(item.productId);
  };

  const handleIncrement = (item: GroupedCartItem) => {
    if (item.hasModifiers) {
      // Re-add with the exact same modifiers — no modal needed
      addToCart(
        item.productId,
        1,
        item.modifiers.map((m) => ({
          groupId: m.groupId,
          optionId: m.optionId,
          name: m.name,
          price: m.price.amount,
        })),
      );
    } else {
      addToCart(item.productId, 1);
    }
  };

  const handleAddItem = (mods: Array<{ groupId: string; optionId: string; name: string; price: number }>) => {
    if (!modalProduct) return;
    addToCart(modalProduct.productId, 1, mods);
  };

  const modalMenuItem = modalProduct
    ? menuItems.find((m) => m.id === modalProduct.productId)
    : null;

  return (
    <div className="container xl:w-[70%] px-4 py-8 m-auto">
      <h1 className="m-auto mb-6 text-xl text-center font-bold uppercase tracking-widest ">
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
            {[...grouped]
              .sort((a, b) => a.productId.localeCompare(b.productId))
              .map((item) => (
                <CartItemRow
                  key={item.key}
                  item={item}
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  onRemove={() => handleRemoveAll(item)}
                />
              ))}
          </div>

          {/* Right: order summary — 40% */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-20">
            <CartOrderSummary pricing={data.pricing} items={grouped} />
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
          onAddItem={handleAddItem}
        />
      )}
    </div>
  );
}

