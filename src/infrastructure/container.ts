import { DynamoOrderRepository } from './repositories/dynamo-order.repository';
import { DynamoTimelineRepository } from './repositories/dynamo-timeline.repository';

export const orderRepository = new DynamoOrderRepository();
export const timelineRepository = new DynamoTimelineRepository();