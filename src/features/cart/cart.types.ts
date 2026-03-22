// Request types
export interface Modifier {
  groupId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface AddToCartRequest {
  orderId?: string;
  userId: string;
  productId: string;
  quantity: number;
  modifiers?: Modifier[];
}

// POST /cart/items — response types
export interface CartItemDto {
  productId: string;
  name: string;
  basePrice: { amount: number };
  quantity: number;
  modifiers: unknown[];
}

export interface PricingDto {
  subtotal: { amount: number };
  tax: { amount: number };
  serviceFee: { amount: number };
  total: { amount: number };
}

export interface AddToCartResponse {
  orderId: string;
  userId: string;
  status: string;
  items: CartItemDto[];
  pricing: PricingDto;
  createdAt: string;
  updatedAt: string;
}

// GET /orders/:orderId — response types
export interface OrderModifierDto {
  groupId: string;
  optionId: string;
  name: string;
  price: { amount: number };
}

export interface OrderItemDto {
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  modifiers: OrderModifierDto[];
}

export interface OrderPricingDto {
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  status: string;
  items: OrderItemDto[];
  pricing: OrderPricingDto;
  createdAt: string;
  updatedAt: string;
}
