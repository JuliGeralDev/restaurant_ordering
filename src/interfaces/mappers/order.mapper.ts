import { Order } from '@/domain/entities/order.entity';

export const toOrderDTO = (order: Order) => {
  return {
    orderId: order.orderId,
    userId: order.userId,
    status: order.status,
    items: order.items.map((item) => ({
      cartItemId: item.cartItemId,
      productId: item.productId,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      basePrice: item.basePrice.value,
      quantity: item.quantity,
      modifiers: item.modifiers,
    })),
    pricing: {
      subtotal: order.pricing.subtotal.value,
      tax: order.pricing.tax.value,
      serviceFee: order.pricing.serviceFee.value,
      total: order.pricing.total.value,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};