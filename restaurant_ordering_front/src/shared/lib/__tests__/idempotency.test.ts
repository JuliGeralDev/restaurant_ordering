import { describe, it, expect } from "vitest";
import { createIdempotencyKey } from "../idempotency";

describe("createIdempotencyKey", () => {
  it("starts with 'checkout-'", () => {
    expect(createIdempotencyKey()).toMatch(/^checkout-/);
  });

  it("generates unique keys on each call", () => {
    const keys = Array.from({ length: 10 }, () => createIdempotencyKey());
    const unique = new Set(keys);
    expect(unique.size).toBe(10);
  });

  it("returns a non-empty string", () => {
    expect(createIdempotencyKey().length).toBeGreaterThan(0);
  });
});
