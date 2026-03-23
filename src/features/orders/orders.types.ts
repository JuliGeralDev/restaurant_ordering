export interface OrderEventPayload {
  // CART_ITEM_ADDED / UPDATED / REMOVED
  productId?: string;
  name?: string;
  quantity?: number;
  basePrice?: number;
  // PRICING_CALCULATED
  subtotal?: number;
  tax?: number;
  serviceFee?: number;
  total?: number;
  // ORDER_STATUS_CHANGED
  from?: string;
  to?: string;
  // catch-all
  [key: string]: unknown;
}

export interface OrderEvent {
  eventId: string;
  orderId: string;
  payload: OrderEventPayload;
  correlationId: string;
  source: string;
  type: string;
  userId: string;
  timestamp: string;
}

export interface OrderEventsResponse {
  events: OrderEvent[];
  nextToken: string | null;
  hasMore: boolean;
}
