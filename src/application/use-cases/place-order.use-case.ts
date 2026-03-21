import { OrderRepository } from '@/domain/repositories/order.repository';
import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { OrderService } from '@/application/services/order.service';
import { TimelineEventFactory } from '@/domain/factories/timeline-event.factory';

export interface PlaceOrderInput {
  orderId: string;
  userId: string;
  correlationId: string;
}

export interface PlaceOrderOutput {
  orderId: string;
  status: string;
}

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly timelineRepository: TimelineRepository,
    private readonly orderService: OrderService
  ) {}

  async execute(input: PlaceOrderInput): Promise<PlaceOrderOutput> {
    const order = await this.orderService.findOrThrow(input.orderId);

    order.status = 'PLACED';
    order.updatedAt = new Date().toISOString();

    await this.orderRepository.save(order);

    const event = TimelineEventFactory.create({
      orderId: order.orderId,
      userId: input.userId,
      type: 'ORDER_PLACED',
      correlationId: input.correlationId,
      payload: {
        status: order.status,
      },
    });

    await this.timelineRepository.save(event);

    return {
      orderId: order.orderId,
      status: order.status,
    };
  }
}