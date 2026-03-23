"use client";

import { History } from "lucide-react";

import type { OrderEvent } from "@/features/orders/orders.types";
import { OrderEventRow } from "@/features/orders/ui/OrderEventRow";
import { TimelinePager } from "@/features/orders/ui/TimelinePager";
import { CardConsola } from "@/shared/ui/CardConsola";

interface OrderTimelineProps {
  events: OrderEvent[];
  isLoading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  isPageTransitioning: boolean;
  canGoToPreviousPage: boolean;
  canGoToNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const OrderTimeline = ({
  events,
  isLoading,
  error,
  pageIndex,
  pageSize,
  isPageTransitioning,
  canGoToPreviousPage,
  canGoToNextPage,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
}: OrderTimelineProps) => {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const isBusy = isLoading || isPageTransitioning;

  return (
    <CardConsola title="ORDER TIMELINE">
      <div className="bg-zinc-800 px-4 py-4">
        {isBusy && (
          <p className="py-8 text-center text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
            Loading events...
          </p>
        )}

        {!isBusy && error && (
          <p className="py-8 text-center text-xs uppercase tracking-widest text-red-500">
            {error}
          </p>
        )}

        {!isBusy && !error && sorted.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <History className="h-10 w-10 text-zinc-600" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">No events yet</p>
          </div>
        )}

        {!isBusy && sorted.length > 0 && (
          <>
            {sorted.map((event, index) => (
              <OrderEventRow
                key={event.eventId}
                event={event}
                isLast={index === sorted.length - 1}
              />
            ))}

            <TimelinePager
              pageIndex={pageIndex}
              pageSize={pageSize}
              isBusy={isBusy}
              canGoToPreviousPage={canGoToPreviousPage}
              canGoToNextPage={canGoToNextPage}
              onPageSizeChange={onPageSizeChange}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
            />
          </>
        )}
      </div>
    </CardConsola>
  );
};
