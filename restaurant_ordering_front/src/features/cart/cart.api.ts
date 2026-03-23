import type {
  AddToCartRequest,
  AddToCartResponse,
  ConfirmOrderRequest,
  ConfirmOrderResponse,
  OrderResponse,
  RemoveCartItemRequest,
} from "@/features/cart/cart.types";
import { apiRequest } from "@/shared/lib/api/httpClient";

const CART_ITEMS_ENDPOINT = "/cart/items";
const ORDERS_ENDPOINT = "/orders";

export const fetchOrderById = (orderId: string) =>
  apiRequest<OrderResponse>({
    method: "GET",
    url: `${ORDERS_ENDPOINT}/${orderId}`,
  });

export const addItemToCartRequest = (payload: AddToCartRequest) =>
  apiRequest<AddToCartResponse, AddToCartRequest>({
    method: "POST",
    url: CART_ITEMS_ENDPOINT,
    data: payload,
  });

export const removeCartItemRequest = (payload: RemoveCartItemRequest) =>
  apiRequest<void, RemoveCartItemRequest>({
    method: "DELETE",
    url: CART_ITEMS_ENDPOINT,
    data: payload,
  });

export const confirmOrderRequest = (
  payload: ConfirmOrderRequest,
  idempotencyKey: string
) =>
  apiRequest<ConfirmOrderResponse, ConfirmOrderRequest>({
    method: "POST",
    url: ORDERS_ENDPOINT,
    data: payload,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
