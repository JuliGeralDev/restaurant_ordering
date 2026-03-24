import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";

import type { OrderEvent, OrderEventsResponse } from "@/features/orders/orders.types";
import { useGetOrderEvents } from "../useGetOrderEvents";
import { apiRequest } from "@/shared/lib/api/httpClient";

vi.mock("@/shared/lib/api/httpClient", () => ({
  apiRequest: vi.fn(),
}));

const mockedApiRequest = vi.mocked(apiRequest);

const makeEvent = (overrides: Partial<OrderEvent> = {}): OrderEvent => ({
  eventId: "evt-1",
  orderId: "order-1",
  correlationId: "corr-1",
  source: "web",
  userId: "user-1",
  timestamp: "2026-01-01T10:00:00.000Z",
  type: "CART_ITEM_ADDED",
  payload: { name: "Burger", quantity: 1, basePrice: 1500000 },
  ...overrides,
});

const makeResponse = (
  overrides: Partial<OrderEventsResponse> = {}
): OrderEventsResponse => ({
  events: [makeEvent()],
  nextToken: null,
  hasMore: false,
  ...overrides,
});

describe("useGetOrderEvents", () => {
  beforeEach(() => {
    mockedApiRequest.mockReset();
  });

  it("fetches the first page on mount using the default page size", async () => {
    mockedApiRequest.mockResolvedValueOnce(
      makeResponse({ nextToken: "next-1", hasMore: true })
    );

    const { result } = renderHook(() => useGetOrderEvents("order-1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: "GET",
      url: "/orders/order-1/timeline?pageSize=10",
    });
    expect(result.current.events).toHaveLength(1);
    expect(result.current.pageIndex).toBe(0);
    expect(result.current.canGoToNextPage).toBe(true);
    expect(result.current.canGoToPreviousPage).toBe(false);
  });

  it("navigates forward and back across pages using nextToken history", async () => {
    mockedApiRequest
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-1" })],
          nextToken: "next-1",
          hasMore: true,
        })
      )
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-2" })],
          nextToken: "next-2",
          hasMore: true,
        })
      )
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-1" })],
          nextToken: "next-1",
          hasMore: true,
        })
      );

    const { result } = renderHook(() =>
      useGetOrderEvents("order-1", { pageSize: 5 })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToNextPage();
    });

    await waitFor(() => {
      expect(result.current.pageIndex).toBe(1);
    });

    expect(mockedApiRequest).toHaveBeenNthCalledWith(2, {
      method: "GET",
      url: "/orders/order-1/timeline?pageSize=5&nextToken=next-1",
    });
    expect(result.current.events[0]?.eventId).toBe("evt-2");
    expect(result.current.canGoToPreviousPage).toBe(true);

    act(() => {
      result.current.goToPreviousPage();
    });

    await waitFor(() => {
      expect(result.current.pageIndex).toBe(0);
    });

    expect(mockedApiRequest).toHaveBeenNthCalledWith(3, {
      method: "GET",
      url: "/orders/order-1/timeline?pageSize=5",
    });
    expect(result.current.events[0]?.eventId).toBe("evt-1");
  });

  it("refreshes the current page using the stored page token", async () => {
    mockedApiRequest
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-1" })],
          nextToken: "next-1",
          hasMore: true,
        })
      )
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-2" })],
          nextToken: null,
          hasMore: false,
        })
      )
      .mockResolvedValueOnce(
        makeResponse({
          events: [makeEvent({ eventId: "evt-2-refresh" })],
          nextToken: null,
          hasMore: false,
        })
      );

    const { result } = renderHook(() =>
      useGetOrderEvents("order-1", { pageSize: 5 })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToNextPage();
    });

    await waitFor(() => {
      expect(result.current.pageIndex).toBe(1);
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(mockedApiRequest).toHaveBeenNthCalledWith(3, {
      method: "GET",
      url: "/orders/order-1/timeline?pageSize=5&nextToken=next-1",
    });
    expect(result.current.events[0]?.eventId).toBe("evt-2-refresh");
  });

  it("exposes a readable error when the initial fetch fails", async () => {
    mockedApiRequest.mockRejectedValueOnce(new Error("Timeline unavailable"));

    const { result } = renderHook(() => useGetOrderEvents("order-1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Timeline unavailable");
    expect(result.current.events).toEqual([]);
  });
});
