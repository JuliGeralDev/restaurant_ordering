"use client";

import { History } from "lucide-react";
import { CardConsola } from "@/shared/ui/CardConsola";
import { Button } from "@/shared/ui/button";
import { OrderEventRow } from "@/features/orders/ui/OrderEventRow";
import type { OrderEvent } from "@/features/orders/orders.types";

interface OrderTimelineProps {
  events: OrderEvent[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export const OrderTimeline = ({
  events,
  isLoading,
  error,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: OrderTimelineProps) => {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <CardConsola title="ORDER TIMELINE">
      <div className="bg-zinc-800 px-4 py-4">
        {isLoading && (
          <p className="py-8 text-center text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
            Loading events...
          </p>
        )}

        {!isLoading && error && (
          <p className="py-8 text-center text-xs uppercase tracking-widest text-red-500">
            {error}
          </p>
        )}

        {!isLoading && !error && sorted.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <History className="h-10 w-10 text-zinc-600" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">No events yet</p>
          </div>
        )}

        {sorted.length > 0 && (
          <>
            {sorted.map((event, i) => (
              <OrderEventRow
                key={event.eventId}
                event={event}
                isLast={i === sorted.length - 1 && !hasMore}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center border-t border-zinc-700 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-green-400"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading…" : "Load more events ↓"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </CardConsola>
  );
};
