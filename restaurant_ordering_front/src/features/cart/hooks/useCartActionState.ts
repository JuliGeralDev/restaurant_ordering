"use client";

import { useState } from "react";

export function useCartActionState(defaultErrorMessage: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async <T>(action: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      return await action();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : defaultErrorMessage;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    run,
  };
}
