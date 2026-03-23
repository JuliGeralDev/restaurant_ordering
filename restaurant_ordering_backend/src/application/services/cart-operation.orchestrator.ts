import { Order } from '@/domain/entities/order.entity';
import { TimelineEventType } from '@/domain/entities/timeline-event.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';
import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { OrderPricingService } from '@/application/services/order-pricing.service';
import { TimelineEventFactory } from '@/domain/factories/timeline-event.factory';

export interface SaveCartOperationParams {
  order: Order;
  orderId: string;
  userId: string;
  correlationId: string;
  eventType: TimelineEventType;
  eventPayload: Record<string, unknown>;
}

export class CartOperationOrchestrator {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly timelineRepository: TimelineRepository,
    private readonly orderPricingService: OrderPricingService
  ) {}

  async saveCartOperation(params: SaveCartOperationParams): Promise<void> {
    const pricingEvent = this.orderPricingService.recalculate({
      order: params.order,
      orderId: params.orderId,
      userId: params.userId,
      correlationId: params.correlationId,
    });

    await this.orderRepository.save(params.order);

    const itemEvent = TimelineEventFactory.create({
      orderId: params.orderId,
      userId: params.userId,
      type: params.eventType,
      correlationId: params.correlationId,
      payload: params.eventPayload,
    });

    await this.timelineRepository.save(itemEvent);
    await this.timelineRepository.save(pricingEvent);
  }
}
