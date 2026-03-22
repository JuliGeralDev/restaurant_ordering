import { Order } from '@/domain/entities/order.entity';
import { randomUUID } from 'crypto';
import { OrderService } from '@/application/services/order.service';
import { CartOperationOrchestrator } from '@/application/services/cart-operation.orchestrator';

export interface RemoveItemInput {
  orderId: string;
  userId: string;
  cartItemId: string; // Unique identifier for the specific cart item instance
}

export interface RemoveItemOutput {
  order: Order;
}

export class RemoveItemFromCartUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartOrchestrator: CartOperationOrchestrator
  ) {}

  async execute(input: RemoveItemInput): Promise<RemoveItemOutput> {
    const order = await this.orderService.findOrThrow(input.orderId);

    const item = this.orderService.findItemByCartItemIdOrThrow(order, input.cartItemId);

    const correlationId = randomUUID();
    let eventType: 'CART_ITEM_REMOVED' | 'CART_ITEM_UPDATED';

    if (item.quantity > 1) {
      // Decrement quantity by 1, keep the item
      item.quantity -= 1;
      eventType = 'CART_ITEM_UPDATED';
    } else {
      // Last unit — remove the item entirely
      order.items = order.items.filter((i) => i.cartItemId !== input.cartItemId);
      eventType = 'CART_ITEM_REMOVED';
    }

    await this.cartOrchestrator.saveCartOperation({
      order,
      orderId: input.orderId,
      userId: input.userId,
      correlationId,
      eventType,
      eventPayload: {
        cartItemId: input.cartItemId,
        remainingQuantity: item.quantity,
      },
    });

    return {
      order,
    };
  }
}
