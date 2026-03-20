import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { InMemoryTimelineRepository } from './repositories/in-memory-timeline.repository';

export const orderRepository = new InMemoryOrderRepository();
export const timelineRepository = new InMemoryTimelineRepository();