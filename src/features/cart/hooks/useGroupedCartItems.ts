import type { OrderItemDto, OrderModifierDto } from "../cart.types";

export interface GroupedCartItem {
  key: string;
  productId: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  modifiers: OrderModifierDto[];
  hasModifiers: boolean;
  totalQuantity: number;
}

function buildKey(productId: string, modifiers: OrderModifierDto[]): string {
  const modifierKey = modifiers
    .map((m) => m.optionId)
    .sort()
    .join(",");
  return `${productId}::${modifierKey}`;
}

export function useGroupedCartItems(items: OrderItemDto[], groupByModifiers = false): GroupedCartItem[] {
  const map = new Map<string, GroupedCartItem>();

  for (const item of items) {
    const key = groupByModifiers
      ? buildKey(item.productId, item.modifiers)
      : item.productId;
    const existing = map.get(key);
    if (existing) {
      existing.totalQuantity += item.quantity;
    } else {
      map.set(key, {
        key,
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        basePrice: item.basePrice,
        modifiers: item.modifiers,
        hasModifiers: item.modifiers.length > 0,
        totalQuantity: item.quantity,
      });
    }
  }

  return Array.from(map.values());
}
