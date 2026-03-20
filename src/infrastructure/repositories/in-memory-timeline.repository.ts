import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { TimelineEvent } from '@/domain/entities/timeline-event.entity';

export class InMemoryTimelineRepository implements TimelineRepository {
  private events: Map<string, TimelineEvent[]> = new Map();

  async save(event: TimelineEvent): Promise<void> {
    const existingEvents = this.events.get(event.orderId) || [];

    // Deduplication by eventId (requirement)
    const alreadyExists = existingEvents.some(
      (e) => e.eventId === event.eventId
    );

    if (!alreadyExists) {
      existingEvents.push(event);
      this.events.set(event.orderId, existingEvents);
    }
  }

  async findByOrderId(
    orderId: string,
    page: number,
    pageSize: number
  ): Promise<TimelineEvent[]> {
    const events = this.events.get(orderId) || [];

    // Sort by timestamp (requirement)
    const sorted = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return sorted.slice(start, end);
  }
}