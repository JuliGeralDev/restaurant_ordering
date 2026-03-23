import { describe, expect, it } from "vitest";

import { maskEmail, maskPhone } from "@/shared/lib/pii";

describe("pii helpers", () => {
  it("masks email addresses", () => {
    expect(maskEmail("john.doe@example.com")).toBe("j***@example.com");
  });

  it("masks phone numbers", () => {
    expect(maskPhone("+57 300 111 2233")).toBe("*******2233");
  });
});
