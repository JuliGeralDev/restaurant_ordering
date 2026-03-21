import { Order, OrderItem } from '@/domain/entities/order.entity';
import { Money } from '@/domain/value-objects/money.vo';
import { TimelineEvent } from '@/domain/entities/timeline-event.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';
import { randomUUID } from 'crypto';
import { PricingService } from '@/domain/services/pricing.service';
import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { DynamoMenuRepository } from '@/infrastructure/repositories/dynamo-menu.repository';

/**
 * Input: data coming from outside (API/UI)
 * Only trusted field is productId, everything else is validated/derived
 */
export interface AddItemToCartInput {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  modifiers?: Array<{
    groupId: string;
    optionId: string;
    name: string;
    price: number;
  }>;
}

/**
 * Output: domain result after operation
 */
export interface AddItemToCartOutput {
  order: Order;
  event: TimelineEvent;
}

export class AddItemToCartUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly pricingService: PricingService,
    private readonly timelineRepository: TimelineRepository,
    private readonly menuRepository: DynamoMenuRepository
  ) { }

  async execute(input: AddItemToCartInput): Promise<AddItemToCartOutput> {
    //  1. Get product from DB (source of truth)
    const product = await this.menuRepository.findById(input.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    //  Validate modifiers if product has them
    if (product.modifiers) {
      const inputModifiers = input.modifiers || [];

      // Group modifiers by groupId
      const grouped: Record<string, any[]> = {};

      for (const mod of inputModifiers) {
        if (!grouped[mod.groupId]) {
          grouped[mod.groupId] = [];
        }
        grouped[mod.groupId].push(mod);
      }

      // Validate protein (required exactly 1)
      if (product.modifiers.protein?.required) {
        const protein = grouped['protein'] || [];

        if (protein.length !== 1) {
          throw new Error('Protein is required and must be exactly 1');
        }

        const validOptions = product.modifiers.protein.options;

        if (!validOptions.includes(protein[0].optionId)) {
          throw new Error('Invalid protein option');
        }
      }

      // Validate toppings
      if (product.modifiers.toppings) {
        const toppings = grouped['toppings'] || [];

        if (
          product.modifiers.toppings.max &&
          toppings.length > product.modifiers.toppings.max
        ) {
          throw new Error('Too many toppings selected');
        }

        const validOptions = product.modifiers.toppings.options;

        for (const t of toppings) {
          if (!validOptions.includes(t.optionId)) {
            throw new Error('Invalid topping option');
          }
        }
      }

      // Validate sauces
      if (product.modifiers.sauces) {
        const sauces = grouped['sauces'] || [];

        if (
          product.modifiers.sauces.max &&
          sauces.length > product.modifiers.sauces.max
        ) {
          throw new Error('Too many sauces selected');
        }

        const validOptions = product.modifiers.sauces.options;

        for (const s of sauces) {
          if (!validOptions.includes(s.optionId)) {
            throw new Error('Invalid sauce option');
          }
        }
      }
    }

    const basePrice = new Money(product.basePrice);

    // Convert modifiers to domain objects
    const modifiers = (input.modifiers || []).map((mod) => ({
      groupId: mod.groupId,
      optionId: mod.optionId,
      name: mod.name,
      price: new Money(mod.price),
    }));

    const newItem: OrderItem = {
      productId: product.productId,
      name: product.name,
      basePrice,
      quantity: input.quantity,
      modifiers,
    };

    let order = await this.orderRepository.findById(input.orderId);
    const correlationId = randomUUID();
    let isNewOrder = false;

    //  2. Create order if not exists
    if (!order) {
      isNewOrder = true;

      order = {
        orderId: input.orderId,
        userId: input.userId,
        status: 'CREATED',
        items: [],
        pricing: {
          subtotal: new Money(0),
          tax: new Money(0),
          serviceFee: new Money(0),
          total: new Money(0),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const orderCreatedEvent: TimelineEvent = {
        eventId: randomUUID(),
        timestamp: new Date().toISOString(),
        orderId: input.orderId,
        userId: input.userId,
        type: 'ORDER_STATUS_CHANGED',
        source: 'api',
        correlationId,
        payload: {
          status: 'CREATED',
          previousStatus: null,
        },
      };

      await this.timelineRepository.save(orderCreatedEvent);
    }

    //  3. Add or update item
    let eventType: 'CART_ITEM_ADDED' | 'CART_ITEM_UPDATED';

    const existingItem = order.items.find(
      (item) => item.productId === newItem.productId
    );

    if (existingItem) {
      existingItem.quantity += newItem.quantity;
      eventType = 'CART_ITEM_UPDATED';
    } else {
      order.items.push(newItem);
      eventType = 'CART_ITEM_ADDED';
    }

    //  4. Recalculate pricing
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

    //  5. Item event
    const itemEvent: TimelineEvent = {
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      orderId: input.orderId,
      userId: input.userId,
      type: eventType,
      source: 'api',
      correlationId,
      payload: {
        productId: product.productId,
        name: product.name,
        quantity: input.quantity,
        basePrice: product.basePrice,
      },
    };

    await this.timelineRepository.save(itemEvent);

    // 6. Pricing event
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
        tax: 0,
        serviceFee: 0,
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