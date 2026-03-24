import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCartActionState } from "../useCartActionState";

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

describe("useCartActionState", () => {
  it("starts idle with no error", () => {
    const { result } = renderHook(() => useCartActionState("Fallback error"));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("toggles loading during a successful action and returns the result", async () => {
    const { result } = renderHook(() => useCartActionState("Fallback error"));
    const deferred = createDeferred<string>();

    let runPromise!: Promise<string>;

    act(() => {
      runPromise = result.current.run(() => deferred.promise);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    deferred.resolve("ok");

    await expect(runPromise).resolves.toBe("ok");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });

  it("stores the message from thrown Error instances", async () => {
    const { result } = renderHook(() => useCartActionState("Fallback error"));

    await expect(
      result.current.run(async () => {
        throw new Error("Action failed");
      })
    ).rejects.toThrow("Action failed");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Action failed");
  });

  it("falls back to the default error message for non-Error rejections", async () => {
    const { result } = renderHook(() => useCartActionState("Fallback error"));

    await expect(
      result.current.run(async () => {
        throw "plain failure";
      })
    ).rejects.toBe("plain failure");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Fallback error");
  });

  it("clears a previous error before running a new action", async () => {
    const { result } = renderHook(() => useCartActionState("Fallback error"));

    await expect(
      result.current.run(async () => {
        throw new Error("First failure");
      })
    ).rejects.toThrow("First failure");

    expect(result.current.error).toBe("First failure");

    const deferred = createDeferred<void>();

    act(() => {
      void result.current.run(() => deferred.promise);
    });

    expect(result.current.error).toBeNull();

    deferred.resolve();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
