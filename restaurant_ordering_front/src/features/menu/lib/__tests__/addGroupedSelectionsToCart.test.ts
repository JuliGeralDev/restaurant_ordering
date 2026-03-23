import { describe, expect, it, vi } from "vitest";

import { addGroupedSelectionsToCart } from "../addGroupedSelectionsToCart";

describe("addGroupedSelectionsToCart", () => {
  it("adds grouped selections sequentially", async () => {
    const callOrder: string[] = [];

    const onAddToCart = vi
      .fn<
        (quantity: number, selectedModifiers?: Array<{ optionId: string }>) => Promise<void>
      >()
      .mockImplementation(async (_quantity, selectedModifiers) => {
        const optionId = selectedModifiers?.[0]?.optionId ?? "plain";
        callOrder.push(`start:${optionId}`);

        await Promise.resolve();

        callOrder.push(`end:${optionId}`);
      });

    await addGroupedSelectionsToCart(
      [
        { quantity: 1, modifiers: [{ optionId: "a" } as { optionId: string }] },
        { quantity: 1, modifiers: [{ optionId: "b" } as { optionId: string }] },
      ],
      onAddToCart
    );

    expect(onAddToCart).toHaveBeenCalledTimes(2);
    expect(callOrder).toEqual(["start:a", "end:a", "start:b", "end:b"]);
  });
});
