import type { OrderItemDto } from "../cart.types";

export interface GroupedCartItem {
  productId: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  hasModifiers: boolean;
  totalQuantity: number;
}

export function useGroupedCartItems(items: OrderItemDto[]): GroupedCartItem[] {
  const map = new Map<string, GroupedCartItem>();

  for (const item of items) {
    const existing = map.get(item.productId);
    if (existing) {
      existing.totalQuantity += item.quantity;
    } else {
      map.set(item.productId, {
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        basePrice: item.basePrice,
        hasModifiers: item.modifiers.length > 0,
        totalQuantity: item.quantity,
      });
    }
  }

  return Array.from(map.values());
}
