import { Order, OrderItem } from '@/domain/entities/order.entity';
import { Money } from '@/domain/value-objects/money.vo';
import { TimelineEvent } from '@/domain/entities/timeline-event.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';
import { randomUUID } from 'crypto';
import {
  ModifierSelectionInput,
  ModifierSelectionService,
} from '@/domain/services/modifier-selection.service';
import { PricingService } from '@/domain/services/pricing.service';
import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { MenuRepository } from '@/domain/repositories/menu.repository';
import { NotFoundError } from '@/domain/errors/not-found.error';

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
    private readonly orderRepository: OrderRepository,
    private readonly pricingService: PricingService,
    private readonly timelineRepository: TimelineRepository,
    private readonly menuRepository: MenuRepository,
    private readonly modifierSelectionService: ModifierSelectionService
  ) { }

  async execute(input: UpdateItemInCartInput): Promise<UpdateItemInCartOutput> {
    // 1. Validate order exists
    const order = await this.orderRepository.findById(input.orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // 2. Check if item exists
    const existingItemIndex = order.items.findIndex(
      (item) => item.productId === input.productId
    );

    if (existingItemIndex === -1) {
      throw new NotFoundError('Item not found in cart');
    }

    // 3. Get product from DB (source of truth)
    const product = await this.menuRepository.findById(input.productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const basePrice = new Money(product.basePrice);
    const modifiers = this.modifierSelectionService.resolve(product, input.modifiers);

    // 5. Update item in cart
    const updatedItem: OrderItem = {
      productId: product.productId,
      name: product.name,
      basePrice,
      quantity: input.quantity,
      modifiers,
    };

    order.items[existingItemIndex] = updatedItem;

    // 6. Recalculate pricing
    const subtotal = this.pricingService.calculateSubtotal(order.items);
    const total = this.pricingService.calculateTotal(subtotal);

    const tax = this.pricingService.calculateTax(subtotal);
    const serviceFee = this.pricingService.calculateServiceFee(subtotal);

    order.pricing = {
      subtotal,
      tax,
      serviceFee,
      total,
    };

    order.updatedAt = new Date().toISOString();

    await this.orderRepository.save(order);

    const correlationId = randomUUID();

    // 7. Create CART_ITEM_UPDATED event
    const itemEvent: TimelineEvent = {
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      orderId: input.orderId,
      userId: input.userId,
      type: 'CART_ITEM_UPDATED',
      source: 'api',
      correlationId,
      payload: {
        productId: product.productId,
        name: product.name,
        quantity: input.quantity,
        basePrice: product.basePrice,
        modifiersCount: modifiers.length,
      },
    };

    await this.timelineRepository.save(itemEvent);

    // 8. Create PRICING_CALCULATED event
    const pricingEvent: TimelineEvent = {
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      orderId: input.orderId,
      userId: input.userId,
      type: 'PRICING_CALCULATED',
      source: 'api',
      correlationId,
      payload: {
        subtotal: subtotal.value,
        tax: tax.value,
        serviceFee: serviceFee.value,
        total: total.value,
      },
    };

    await this.timelineRepository.save(pricingEvent);

    return {
      order,
      event: itemEvent,
    };
  }
}
