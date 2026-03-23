import type { GroupedModifierSelection } from "@/features/cart/lib/groupModifierSelections";
import type { FlatModifier } from "@/features/menu/hooks/useModifiersModal";

type AddToCartHandler = (
  quantity: number,
  selectedModifiers?: FlatModifier[]
) => void | Promise<void>;

export const addGroupedSelectionsToCart = async (
  groupedSelections: Iterable<GroupedModifierSelection>,
  onAddToCart?: AddToCartHandler
) => {
  if (!onAddToCart) {
    return;
  }

  for (const { quantity, modifiers } of groupedSelections) {
    await onAddToCart(quantity, modifiers);
  }
};
