import { TimelineEvent } from '@/domain/entities/timeline-event.entity';

export interface TimelineRepository {
  save(event: TimelineEvent): Promise<void>;

  findByOrderId(
    orderId: string,
    page: number,
    pageSize: number
  ): Promise<TimelineEvent[]>;
}