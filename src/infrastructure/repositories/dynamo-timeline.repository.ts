import { TimelineRepository } from '@/domain/repositories/timeline.repository';
import { TimelineEvent } from '@/domain/entities/timeline-event.entity';
import { dynamoDB } from '@/infrastructure/database/dynamo.client';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoTimelineRepository implements TimelineRepository {
  async save(event: TimelineEvent): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: 'order_timeline',
        Item: event,
        ConditionExpression: 'attribute_not_exists(eventId)',
      })
    );
  }

  async findByOrderId(
    orderId: string,
    page: number,
    pageSize: number
  ): Promise<TimelineEvent[]> {
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: 'order_timeline',
        KeyConditionExpression: 'orderId = :orderId',
        ExpressionAttributeValues: {
          ':orderId': orderId,
        },
        Limit: pageSize,
        ScanIndexForward: true,
      })
    );

    return (result.Items as TimelineEvent[]) || [];
  }
}