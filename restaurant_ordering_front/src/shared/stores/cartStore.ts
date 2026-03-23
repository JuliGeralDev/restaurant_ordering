import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { OrderResponse } from "@/features/cart/cart.types";
import { env } from "@/shared/config/env";
import { createIdempotencyKey } from "@/shared/lib/idempotency";
import type { UserProfile } from "@/shared/types/user";

interface CartStore {
  orderId: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
  orderData: OrderResponse | null;
  checkoutIdempotencyKey: string | null;
  setOrderId: (orderId: string) => void;
  setOrderData: (data: OrderResponse | null) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  clearUserSession: () => void;
  getOrCreateCheckoutIdempotencyKey: (orderId: string) => string;
  clearOrder: () => void;
}



export const useCartStore : any = create<CartStore>()(
  persist(
    (set) => ({
      orderId: null,
      userId: env.defaultUser?.userId ?? null,
      userProfile: env.defaultUser,
      orderData: null,
      checkoutIdempotencyKey: null,
      setOrderId: (orderId: string) =>
        set((state) => ({
          orderId,
          checkoutIdempotencyKey:
            state.orderId === orderId ? state.checkoutIdempotencyKey : null,
        })),
      setOrderData: (orderData: OrderResponse | null) => set({ orderData }),
      setUserProfile: (userProfile: UserProfile) =>
        set({
          orderId: null,
          userId: userProfile.userId,
          userProfile,
          orderData: null,
          checkoutIdempotencyKey: null,
        }),
      clearUserSession: () =>
        set({
          orderId: null,
          userId: null,
          userProfile: null,
          orderData: null,
          checkoutIdempotencyKey: null,
        }),
      getOrCreateCheckoutIdempotencyKey: (orderId: string) => {
        const state = useCartStore.getState();

        if (state.orderId === orderId && state.checkoutIdempotencyKey) {
          return state.checkoutIdempotencyKey;
        }

        const nextKey = createIdempotencyKey();
        set({ orderId, checkoutIdempotencyKey: nextKey });

        return nextKey;
      },
      clearOrder: () =>
        set({ orderId: null, orderData: null, checkoutIdempotencyKey: null }),
    }),
    {
      name: "cart-storage",
      // Only persist orderId, userId, and the in-flight checkout key.
      partialize: (state) => ({
        orderId: state.orderId,
        userId: state.userId,
        userProfile: state.userProfile,
        checkoutIdempotencyKey: state.checkoutIdempotencyKey,
      }),
    }
  )
);
