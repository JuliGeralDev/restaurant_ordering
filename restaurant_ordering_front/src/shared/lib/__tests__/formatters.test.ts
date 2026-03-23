import { describe, it, expect } from "vitest";
import { formatCurrency, formatOrderShortId } from "../formatters";

describe("formatCurrency", () => {
  it("formats minor units as COP without decimals when exact", () => {
    expect(formatCurrency(1500000)).toBe("$15.000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats large amount in minor units", () => {
    expect(formatCurrency(100000000)).toBe("$1.000.000");
  });

  it("keeps centavos when the amount is not an exact peso", () => {
    expect(formatCurrency(1500050)).toBe("$15.000,50");
  });

  it("always starts with $", () => {
    expect(formatCurrency(999)).toMatch(/^\$/);
  });
});

describe("formatOrderShortId", () => {
  it("returns last underscore-segment uppercased", () => {
    expect(formatOrderShortId("order_abc123")).toBe("ABC123");
  });

  it("handles multiple underscores, returns last segment", () => {
    expect(formatOrderShortId("order_2024_xyz")).toBe("XYZ");
  });

  it("returns full string uppercased when no underscore", () => {
    expect(formatOrderShortId("abc123")).toBe("ABC123");
  });

  it("handles empty string gracefully", () => {
    expect(formatOrderShortId("")).toBe("");
  });
});
