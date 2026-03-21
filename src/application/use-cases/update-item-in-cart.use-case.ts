import { Order } from '@/domain/entities/order.entity';
import { TimelineEvent } from '@/domain/entities/timeline-event.entity';
import { randomUUID } from 'crypto';
import { ModifierSelectionInput } from '@/domain/services/modifier-selection.service';
import { OrderService } from '@/application/services/order.service';
import { CartItemService } from '@/application/services/cart-item.service';
import { CartOperationOrchestrator } from '@/application/services/cart-operation.orchestrator';

/**
 * Input: data for updating an existing cart item
 */
export interface UpdateItemInCartInput {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  modifiers?: ModifierSelectionInput[];
}

/**
 * Output: updated order after modification
 */
export interface UpdateItemInCartOutput {
  order: Order;
  event: TimelineEvent;
}

export class UpdateItemInCartUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartItemService: CartItemService,
    private readonly cartOrchestrator: CartOperationOrchestrator
  ) {}

  async execute(input: UpdateItemInCartInput): Promise<UpdateItemInCartOutput> {
    const order = await this.orderService.findOrThrow(input.orderId);
    
    this.orderService.findItemOrThrow(order, input.productId);

    const updatedItem = await this.cartItemService.resolveProductWithModifiers(
      input.productId,
      input.quantity,
      input.modifiers
    );

    const existingItemIndex = order.items.findIndex((item) => item.productId === input.productId);
    order.items[existingItemIndex] = updatedItem;

    const correlationId = randomUUID();

    await this.cartOrchestrator.saveCartOperation({
      order,
      orderId: input.orderId,
      userId: input.userId,
      correlationId,
      eventType: 'CART_ITEM_UPDATED',
      eventPayload: {
        productId: updatedItem.productId,
        name: updatedItem.name,
        quantity: input.quantity,
        basePrice: updatedItem.basePrice.value,
        modifiersCount: updatedItem.modifiers.length,
      },
    });

    return {
      order,
      event: {
        eventId: correlationId,
        timestamp: new Date().toISOString(),
        orderId: input.orderId,
        userId: input.userId,
        type: 'CART_ITEM_UPDATED',
        source: 'api',
        correlationId,
        payload: {},
      },
    };
  }
}
