const createFallbackKey = () =>
  `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createIdempotencyKey = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return `checkout-${globalThis.crypto.randomUUID()}`;
  }

  return createFallbackKey();
};
