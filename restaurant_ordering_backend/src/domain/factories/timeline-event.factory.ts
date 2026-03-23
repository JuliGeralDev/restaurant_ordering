import { randomUUID } from 'crypto';
import {
  TimelineEvent,
  TimelineEventSource,
  TimelineEventType,
} from '@/domain/entities/timeline-event.entity';

let lastTimestampMs = 0;
let sameMillisecondSequence = 0;

function createMonotonicTimelineTimestamp(): string {
  const nowMs = Date.now();

  if (nowMs === lastTimestampMs) {
    sameMillisecondSequence += 1;
  } else {
    lastTimestampMs = nowMs;
    sameMillisecondSequence = 0;
  }

  const isoTimestamp = new Date(nowMs).toISOString();
  const sequence = sameMillisecondSequence.toString().padStart(3, '0');

  return isoTimestamp.replace('Z', `${sequence}Z`);
}

export interface CreateTimelineEventParams {
  orderId: string;
  userId: string;
  type: TimelineEventType;
  correlationId: string;
  payload: Record<string, unknown>;
  source?: TimelineEventSource;
}

export class TimelineEventFactory {
  static create(params: CreateTimelineEventParams): TimelineEvent {
    return {
      eventId: randomUUID(),
      timestamp: createMonotonicTimelineTimestamp(),
      orderId: params.orderId,
      userId: params.userId,
      type: params.type,
      source: params.source ?? 'api',
      correlationId: params.correlationId,
      payload: params.payload,
    };
  }
}
