"use client";

import { useMemo, useState } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useConfirmOrder } from "@/features/cart/hooks/useConfirmOrder";
import { useEditCartItem } from "@/features/cart/hooks/useEditCartItem";
import { useGetOrder } from "@/features/cart/hooks/useGetOrder";
import {
  useGroupedCartItems,
  type GroupedCartItem,
} from "@/features/cart/hooks/useGroupedCartItems";
import { useRemoveCartItem } from "@/features/cart/hooks/useRemoveCartItem";
import { useGetMenu } from "@/features/menu/hooks/useGetMenu";
import type { FlatModifier } from "@/features/menu/hooks/useModifiersModal";

export function useCartPage() {
  const { data: order } = useGetOrder();
  const { data: menuItems } = useGetMenu();
  const { addToCart } = useAddToCart();
  const { removeCartItem, removeCartItems } = useRemoveCartItem();
  const { editCartItem, isLoading: isEditing } = useEditCartItem();
  const { confirmOrder, isLoading: isConfirming } = useConfirmOrder();
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);

  const groupedItems = useGroupedCartItems(order?.items ?? [], true);
  const sortedItems = useMemo(
    () =>
      [...groupedItems].sort((a, b) => a.productId.localeCompare(b.productId)),
    [groupedItems]
  );

  const isEmpty = !order || order.items.length === 0;
  const editingItem =
    editingItemKey === null
      ? null
      : sortedItems.find((item) => item.key === editingItemKey) ?? null;
  const editingMenuItem =
    editingItem === null
      ? null
      : menuItems.find((menuItem) => menuItem.id === editingItem.productId) ?? null;
  const editingInitialSelections = useMemo(
    () =>
      editingItem
        ? Array.from({ length: editingItem.totalQuantity }, () =>
            editingItem.modifiers.map((modifier) => ({
              groupId: modifier.groupId,
              optionId: modifier.optionId,
              name: modifier.name,
              price: modifier.price.amount,
            })),
          )
        : [],
    [editingItem],
  );

  const handleDecrement = (item: GroupedCartItem) => {
    const cartItemId = item.cartItemIds.at(-1);

    if (cartItemId) {
      void removeCartItem(cartItemId);
    }
  };

  const handleRemoveAll = (item: GroupedCartItem) => {
    void removeCartItems(item.cartItemIds);
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

  const openEditor = (item: GroupedCartItem) => {
    const menuItem = menuItems.find((currentMenuItem) => currentMenuItem.id === item.productId);
    if (!menuItem?.modifiers) return;
    setEditingItemKey(item.key);
  };

  const closeEditor = () => {
    setEditingItemKey(null);
  };

  const handleEditSubmit = async (selections: FlatModifier[][]) => {
    if (!editingItem) return;

    await editCartItem(editingItem, selections);
  };

  return {
    order,
    groupedItems,
    sortedItems,
    isEmpty,
    isConfirming,
    isEditing,
    confirmOrder,
    handleIncrement,
    handleDecrement,
    handleRemoveAll,
    editingItem,
    editingMenuItem,
    editingInitialSelections,
    openEditor,
    closeEditor,
    handleEditSubmit,
  };
}
