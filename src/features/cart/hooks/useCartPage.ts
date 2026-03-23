"use client";

import { useMemo } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useConfirmOrder } from "@/features/cart/hooks/useConfirmOrder";
import { useGetOrder } from "@/features/cart/hooks/useGetOrder";
import {
  useGroupedCartItems,
  type GroupedCartItem,
} from "@/features/cart/hooks/useGroupedCartItems";
import { useRemoveCartItem } from "@/features/cart/hooks/useRemoveCartItem";

export function useCartPage() {
  const { data: order } = useGetOrder();
  const { addToCart } = useAddToCart();
  const { removeCartItem, removeAllItems } = useRemoveCartItem();
  const { confirmOrder, isLoading: isConfirming } = useConfirmOrder();

  const groupedItems = useGroupedCartItems(order?.items ?? [], true);
  const sortedItems = useMemo(
    () =>
      [...groupedItems].sort((a, b) => a.productId.localeCompare(b.productId)),
    [groupedItems]
  );

  const isEmpty = !order || order.items.length === 0;

  const handleDecrement = (item: GroupedCartItem) => {
    const cartItemId = item.cartItemIds.at(-1);

    if (cartItemId) {
      void removeCartItem(cartItemId);
    }
  };

  const handleRemoveAll = (item: GroupedCartItem) => {
    void removeAllItems(item.productId);
  };

  const handleIncrement = (item: GroupedCartItem) => {
    if (item.hasModifiers) {
      void addToCart(
        item.productId,
        1,
        item.modifiers.map((modifier) => ({
          groupId: modifier.groupId,
          optionId: modifier.optionId,
          name: modifier.name,
          price: modifier.price.amount,
        }))
      );
      return;
    }

    void addToCart(item.productId, 1);
  };

  return {
    order,
    groupedItems,
    sortedItems,
    isEmpty,
    isConfirming,
    confirmOrder,
    handleIncrement,
    handleDecrement,
    handleRemoveAll,
  };
}
