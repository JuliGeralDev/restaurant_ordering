"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGetOrderById } from "@/features/orders/hooks/useGetOrderById";
import { useGetOrderEvents } from "@/features/orders/hooks/useGetOrderEvents";
import { OrderSummaryCard } from "@/features/orders/ui/OrderSummaryCard";
import { OrderTimeline } from "@/features/orders/ui/OrderTimeline";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: order } = useGetOrderById(orderId);
  const { events, isLoading, error, hasMore, isLoadingMore, loadMore } =
    useGetOrderEvents(orderId);

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