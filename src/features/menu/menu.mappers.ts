import type { GetMenuResponse, MenuItem, MenuItemDto, ModifierOption, ModifierGroup } from "./menu.types";

const mapModifierOptions = (options: Record<string, { name: string; price: number }>): ModifierOption[] => {
  return Object.entries(options).map(([id, option]) => ({
    id,
    name: option.name,
    price: option.price,
  }));
};

const mapMenuItem = (item: MenuItemDto): MenuItem => {
  return {
    id: item.productId,
    name: item.name,
    description: item.description ?? "",
    price: item.basePrice,
    imageUrl: item.imageUrl ?? null,
    modifiers: item.modifiers ? {
      protein: item.modifiers.protein ? {
        required: item.modifiers.protein.required,
        max: item.modifiers.protein.max,
        options: mapModifierOptions(item.modifiers.protein.options),
      } : undefined,
      toppings: item.modifiers.toppings ? {
        required: item.modifiers.toppings.required,
        max: item.modifiers.toppings.max,
        options: mapModifierOptions(item.modifiers.toppings.options),
      } : undefined,
      sauces: item.modifiers.sauces ? {
        required: item.modifiers.sauces.required,
        max: item.modifiers.sauces.max,
        options: mapModifierOptions(item.modifiers.sauces.options),
      } : undefined,
    } : undefined,
  };
};

export const mapGetMenuResponse = (response: GetMenuResponse): MenuItem[] => {
  return response.map(mapMenuItem);
};
