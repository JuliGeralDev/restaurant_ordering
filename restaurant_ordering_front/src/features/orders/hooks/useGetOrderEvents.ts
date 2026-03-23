"use client";

import { useCallback, useEffect, useState } from "react";

import type { OrderEvent, OrderEventsResponse } from "@/features/orders/orders.types";
import { apiRequest } from "@/shared/lib/api/httpClient";

const DEFAULT_PAGE_SIZE = 10;

interface UseGetOrderEventsOptions {
  pageSize?: number;
}

export function useGetOrderEvents(
  orderId: string,
  options: UseGetOrderEventsOptions = {}
) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [tokenHistory, setTokenHistory] = useState<string[]>([]);

  const fetchEvents = useCallback(
    async (token?: string) => {
      const query = new URLSearchParams({
        pageSize: pageSize.toString(),
      });

      if (token) {
        query.set("nextToken", token);
      }

      const url = `/orders/${orderId}/timeline?${query.toString()}`;

      try {
        const data = await apiRequest<OrderEventsResponse>({ method: "GET", url });
        setEvents(data.events);
        setNextToken(data.nextToken ?? null);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        throw err;
      }
    },
    [orderId, pageSize]
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPageIndex(0);
    setTokenHistory([]);

    fetchEvents()
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [fetchEvents]);

  const goToNextPage = () => {
    if (!nextToken || !hasMore || isPageTransitioning) return;

    setIsPageTransitioning(true);
    setError(null);

    fetchEvents(nextToken)
      .then(() => {
        setTokenHistory((previous) => [...previous, nextToken]);
        setPageIndex((previous) => previous + 1);
      })
      .catch(() => undefined)
      .finally(() => setIsPageTransitioning(false));
  };

  const goToPreviousPage = () => {
    if (pageIndex === 0 || isPageTransitioning) return;

    const previousPageIndex = pageIndex - 1;
    const previousPageToken =
      previousPageIndex === 0 ? undefined : tokenHistory[previousPageIndex - 1];

    setIsPageTransitioning(true);
    setError(null);

    fetchEvents(previousPageToken)
      .then(() => {
        setPageIndex(previousPageIndex);
        setTokenHistory((previous) => previous.slice(0, previousPageIndex));
      })
      .catch(() => undefined)
      .finally(() => setIsPageTransitioning(false));
  };

  const refresh = () => {
    setError(null);
    const currentPageToken =
      pageIndex === 0 ? undefined : tokenHistory[pageIndex - 1];

    return fetchEvents(currentPageToken).catch(() => undefined);
  };

  return {
    events,
    isLoading,
    error,
    pageIndex,
    pageSize,
    canGoToPreviousPage: pageIndex > 0,
    canGoToNextPage: hasMore,
    isPageTransitioning,
    goToPreviousPage,
    goToNextPage,
    refresh,
  };
}
