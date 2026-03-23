import { describe, it, expect } from "vitest";
import { useGroupedCartItems } from "../useGroupedCartItems";
import type { OrderItemDto } from "../../cart.types";

const makeItem = (overrides: Partial<OrderItemDto> = {}): OrderItemDto => ({
  cartItemId: "item-1",
  productId: "prod-1",
  name: "Burger",
  basePrice: 15000,
  quantity: 1,
  modifiers: [],
  ...overrides,
});

const modifier = (optionId: string) => ({
  groupId: "protein",
  optionId,
  name: optionId,
  price: { amount: 0 },
});

describe("useGroupedCartItems — groupByModifiers=false (default)", () => {
  it("returns empty array for empty input", () => {
    expect(useGroupedCartItems([])).toEqual([]);
  });

  it("groups items by productId and sums quantities", () => {
    const items = [
      makeItem({ cartItemId: "a", quantity: 2 }),
      makeItem({ cartItemId: "b", quantity: 3 }),
    ];
    const result = useGroupedCartItems(items);
    expect(result).toHaveLength(1);
    expect(result[0].totalQuantity).toBe(5);
  });

  it("collects all cartItemIds for the group", () => {
    const items = [
      makeItem({ cartItemId: "a" }),
      makeItem({ cartItemId: "b" }),
    ];
    const result = useGroupedCartItems(items);
    expect(result[0].cartItemIds).toEqual(["a", "b"]);
  });

  it("keeps items with different productIds as separate groups", () => {
    const items = [
      makeItem({ productId: "prod-1" }),
      makeItem({ productId: "prod-2", cartItemId: "b" }),
    ];
    expect(useGroupedCartItems(items)).toHaveLength(2);
  });

  it("sets hasModifiers=false when modifiers array is empty", () => {
    const result = useGroupedCartItems([makeItem()]);
    expect(result[0].hasModifiers).toBe(false);
  });

  it("sets hasModifiers=true when item has modifiers", () => {
    const result = useGroupedCartItems([makeItem({ modifiers: [modifier("chicken")] })]);
    expect(result[0].hasModifiers).toBe(true);
  });

  it("items with different modifiers are still grouped (modifier ignored)", () => {
    const items = [
      makeItem({ cartItemId: "a", modifiers: [modifier("chicken")] }),
      makeItem({ cartItemId: "b", modifiers: [modifier("beef")] }),
    ];
    expect(useGroupedCartItems(items)).toHaveLength(1);
  });
});

describe("useGroupedCartItems — groupByModifiers=true", () => {
  it("separates same product with different modifier optionIds", () => {
    const items = [
      makeItem({ cartItemId: "a", modifiers: [modifier("chicken")] }),
      makeItem({ cartItemId: "b", modifiers: [modifier("beef")] }),
    ];
    expect(useGroupedCartItems(items, true)).toHaveLength(2);
  });

  it("groups same product with identical modifiers", () => {
    const mods = [modifier("chicken")];
    const items = [
      makeItem({ cartItemId: "a", quantity: 1, modifiers: mods }),
      makeItem({ cartItemId: "b", quantity: 2, modifiers: mods }),
    ];
    const result = useGroupedCartItems(items, true);
    expect(result).toHaveLength(1);
    expect(result[0].totalQuantity).toBe(3);
  });

  it("is order-independent: sorted modifiers produce the same key", () => {
    const items = [
      makeItem({ cartItemId: "a", modifiers: [modifier("bbq"), modifier("mayo")] }),
      makeItem({ cartItemId: "b", modifiers: [modifier("mayo"), modifier("bbq")] }),
    ];
    expect(useGroupedCartItems(items, true)).toHaveLength(1);
  });

  it("item without cartItemId is still added to the group", () => {
    const items = [makeItem({ cartItemId: undefined })];
    const result = useGroupedCartItems(items, true);
    expect(result[0].cartItemIds).toEqual([]);
  });
});
