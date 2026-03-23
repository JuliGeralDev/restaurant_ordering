"use client";

import { addItemToCartRequest, removeCartItemRequest } from "@/features/cart/cart.api";
import { useCartActionState } from "@/features/cart/hooks/useCartActionState";
import { useCartOrderSync } from "@/features/cart/hooks/useCartOrderSync";
import type { GroupedCartItem } from "@/features/cart/hooks/useGroupedCartItems";
import { groupModifierSelections } from "@/features/cart/lib/groupModifierSelections";
import type { FlatModifier } from "@/features/menu/hooks/useModifiersModal";
import { useCartStore } from "@/shared/stores/cartStore";

export function useEditCartItem() {
  const { orderId, userId } = useCartStore();
  const { refreshOrder } = useCartOrderSync();
  const { isLoading, error, run } = useCartActionState(
    "Failed to edit cart item modifiers",
  );

  const editCartItem = (item: GroupedCartItem, selections: FlatModifier[][]) =>
    run(async () => {
      if (!orderId || item.cartItemIds.length === 0) return;

      for (const cartItemId of item.cartItemIds) {
        await removeCartItemRequest({
          orderId,
          userId,
          cartItemId,
        });
      }

      const groupedSelections = groupModifierSelections(selections);

      for (const { quantity, modifiers } of groupedSelections.values()) {
        await addItemToCartRequest({
          orderId,
          userId,
          productId: item.productId,
          quantity,
          modifiers,
        });
      }

      await refreshOrder(orderId);
    });

  return {
    editCartItem,
    isLoading,
    error,
  };
}
