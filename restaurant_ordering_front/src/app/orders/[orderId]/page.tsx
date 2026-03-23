"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGetOrderById } from "@/features/orders/hooks/useGetOrderById";
import { useGetOrderEvents } from "@/features/orders/hooks/useGetOrderEvents";
import { OrderSummaryCard } from "@/features/orders/ui/OrderSummaryCard";
import { OrderTimeline } from "@/features/orders/ui/OrderTimeline";

const MAX_POLL_ATTEMPTS = 30;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const pollAttemptsRef = useRef(0);

  const { data: order, getData: refreshOrder } = useGetOrderById(orderId);
  const {
    events,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    refresh: refreshEvents,
  } =
    useGetOrderEvents(orderId);

  useEffect(() => {
    if (!order || order.status !== "PROCESSING") {
      pollAttemptsRef.current = 0;
      return;
    }

    const intervalId = window.setInterval(() => {
      if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
        window.clearInterval(intervalId);
        return;
      }

      pollAttemptsRef.current += 1;
      void refreshOrder();
      void refreshEvents();
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [order, refreshEvents, refreshOrder]);

  return (
    <div className="container xl:w-[65%] px-4 py-8 m-auto">
      <Link
        href="/orders"
        className="mb-6 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-green-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        My Orders
      </Link>

      {order && <OrderSummaryCard order={order} />}

      {order?.status === "PROCESSING" && (
        <p className="mb-4 text-center text-[10px] uppercase tracking-widest text-amber-400 animate-pulse">
          Checkout accepted. Finalizing order...
        </p>
      )}

      <OrderTimeline
        events={events}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
