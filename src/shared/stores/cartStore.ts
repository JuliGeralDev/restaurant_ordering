import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderResponse } from "@/features/cart/cart.types";

interface CartStore {
  orderId: string | null;
  userId: string;
  orderData: OrderResponse | null;
  setOrderId: (orderId: string) => void;
  setOrderData: (data: OrderResponse | null) => void;
  clearOrder: () => void;
}

// For now, we use a hardcoded userId. In the future, this should come from auth
const DEFAULT_USER_ID = "user-test-postman";

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      orderId: null,
      userId: DEFAULT_USER_ID,
      orderData: null,
      setOrderId: (orderId: string) => set({ orderId }),
      setOrderData: (orderData: OrderResponse | null) => set({ orderData }),
      clearOrder: () => set({ orderId: null, orderData: null }),
    }),
    {
      name: "cart-storage",
      // Only persist orderId and userId — orderData is always fetched fresh from the server
      partialize: (state) => ({ orderId: state.orderId, userId: state.userId }),
    }
  )
);
