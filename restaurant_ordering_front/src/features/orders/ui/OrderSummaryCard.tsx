"use client";

import type { OrderResponse } from "@/features/cart/cart.types";
import { formatOrderShortId } from "@/shared/lib/formatters";
import { CardConsola } from "@/shared/ui/CardConsola";
import { OrderLineItems } from "@/shared/ui/OrderLineItems";
import { OrderStatusBadge } from "@/shared/ui/OrderStatusBadge";
import { PricingBreakdown } from "@/shared/ui/PricingBreakdown";

interface OrderSummaryCardProps {
  order: OrderResponse;
}

export const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  const shortId = formatOrderShortId(order.orderId);
  const createdAt = new Date(order.createdAt).toLocaleString("es-CO");
  const lineItems = order.items.map((item) => ({
    key: item.cartItemId ?? item.productId,
    name: item.name,
    quantity: item.quantity,
    total: item.basePrice * item.quantity,
    modifiers: item.modifiers.map((modifier) => ({
      key: `${item.cartItemId ?? item.productId}-${modifier.groupId}-${modifier.optionId}`,
      name: modifier.name,
      price: modifier.price.amount,
    })),
  }));

  return (
    <CardConsola
      title={`ORDER #${shortId}`}
      headerAction={<OrderStatusBadge status={order.status} />}
      className="mb-6"
    >
      <div className="flex flex-col gap-3 bg-zinc-800 p-4">
        <OrderLineItems items={lineItems} />

        <PricingBreakdown
          rows={[
            { label: "Subtotal", value: order.pricing.subtotal },
            { label: "Tax", value: order.pricing.tax },
            { label: "Service fee", value: order.pricing.serviceFee },
          ]}
          total={order.pricing.total}
        />

        <p className="text-[9px] uppercase tracking-wide text-zinc-600">{createdAt}</p>
      </div>
    </CardConsola>
  );
};
