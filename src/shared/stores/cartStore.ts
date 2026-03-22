import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  orderId: string | null;
  userId: string;
  setOrderId: (orderId: string) => void;
  clearOrder: () => void;
}

// For now, we use a hardcoded userId. In the future, this should come from auth
const DEFAULT_USER_ID = "user-test-postman";

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      orderId: null,
      userId: DEFAULT_USER_ID,
      setOrderId: (orderId: string) => set({ orderId }),
      clearOrder: () => set({ orderId: null }),
    }),
    {
      name: "cart-storage",
    }
  )
);
