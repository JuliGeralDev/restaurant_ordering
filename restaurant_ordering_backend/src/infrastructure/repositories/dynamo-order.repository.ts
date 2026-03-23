import { OrderRepository } from '@/domain/repositories/order.repository';
import { Order, OrderItem, OrderPricing } from '@/domain/entities/order.entity';
import { Money } from '@/domain/value-objects/money.vo';
import { dynamoDB } from '@/infrastructure/database/dynamo.client';
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoOrderRepository implements OrderRepository {
  async findById(orderId: string): Promise<Order | null> {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: 'orders',
        Key: { orderId },
      })
    );

    if (!result.Item) {
      return null;
    }

    // Hydrate plain objects back to domain entities
    return this.toDomain(result.Item as any);
  }

  async save(order: Order): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: 'orders',
        Item: order,
      })
    );
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: 'orders',
        IndexName: 'userId-createdAt-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ScanIndexForward: false, // newest first
      })
    );

    return (result.Items ?? []).map((item) => this.toDomain(item as any));
  }

  private toDomain(data: any): Order {
    return {
      orderId: data.orderId,
      userId: data.userId,
      status: data.status,
      items: data.items.map((item: any) => ({
        cartItemId: item.cartItemId,
        productId: item.productId,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        basePrice: new Money(item.basePrice.amount),
        quantity: item.quantity,
        modifiers: item.modifiers.map((mod: any) => ({
          groupId: mod.groupId,
          optionId: mod.optionId,
          name: mod.name,
          price: new Money(mod.price.amount),
        })),
      })),
      pricing: {
        subtotal: new Money(data.pricing.subtotal.amount),
        tax: new Money(data.pricing.tax.amount),
        serviceFee: new Money(data.pricing.serviceFee.amount),
        total: new Money(data.pricing.total.amount),
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}