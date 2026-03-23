"use client";

import { useEffect, useRef } from "react";

import { createSessionUserRequest } from "@/features/users/users.api";
import type { CreateSessionUserRequest } from "@/features/users/users.types";
import { env } from "@/shared/config/env";
import { useCartActionState } from "@/features/cart/hooks/useCartActionState";
import { useCartStore } from "@/shared/stores/cartStore";

export function useUserSession() {
  const defaultUserBootstrappedRef = useRef(false);
  const {
    userProfile,
    setUserProfile,
    clearUserSession,
  } = useCartStore();
  const { isLoading, error, run } = useCartActionState("Failed to start session");

  useEffect(() => {
    if (!env.defaultUserEnabled) return;
    if (!userProfile?.isDefault) return;
    if (defaultUserBootstrappedRef.current) return;

    defaultUserBootstrappedRef.current = true;

    void createSessionUserRequest({
      userId: env.defaultUser?.userId,
      username: env.defaultUser?.username ?? "",
      name: env.defaultUser?.name ?? "",
      email: env.defaultUser?.email ?? "",
      phone: env.defaultUser?.phone ?? "",
      isDefault: true,
    })
      .then((user) => {
        setUserProfile(user);
      })
      .catch(() => {});
  }, [setUserProfile, userProfile?.isDefault]);

  const signIn = (payload: CreateSessionUserRequest) =>
    run(async () => {
      const user = await createSessionUserRequest(payload);
      clearUserSession();
      setUserProfile(user);
      return user;
    });

  const signOut = () => {
    clearUserSession();
  };

  return {
    signIn,
    signOut,
    isLoading,
    error,
  };
}
