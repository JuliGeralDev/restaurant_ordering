"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/shared/lib/api/httpClient";
import type { OrderEvent, OrderEventsResponse } from "@/features/orders/orders.types";

export function useGetOrderEvents(orderId: string) {
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchEvents = useCallback(async (token?: string, append = false) => {
    const url = token
      ? `/orders/${orderId}/timeline?nextToken=${encodeURIComponent(token)}`
      : `/orders/${orderId}/timeline`;

    try {
      const data = await apiRequest<OrderEventsResponse>({ method: "GET", url });
      setEvents((prev) => append ? [...prev, ...data.events] : data.events);
      setNextToken(data.nextToken ?? null);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    }
  }, [orderId]);

  useEffect(() => {
    setIsLoading(true);
    fetchEvents().finally(() => setIsLoading(false));
  }, [fetchEvents]);

  const loadMore = () => {
    if (!nextToken || !hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    fetchEvents(nextToken, true).finally(() => setIsLoadingMore(false));
  };

  const refresh = () => {
    setError(null);
    return fetchEvents();
  };

  return { events, isLoading, error, hasMore, loadMore, isLoadingMore, refresh };
}
