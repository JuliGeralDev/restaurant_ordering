// Request types
export interface AddToCartRequest {
  orderId?: string;
  userId: string;
  productId: string;
  quantity: number;
}

// Response types
export interface CartItemDto {
  productId: string;
  name: string;
  basePrice: {
    amount: number;
  };
  quantity: number;
  modifiers: unknown[];
}

export interface PricingDto {
  subtotal: {
    amount: number;
  };
  tax: {
    amount: number;
  };
  serviceFee: {
    amount: number;
  };
  total: {
    amount: number;
  };
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
