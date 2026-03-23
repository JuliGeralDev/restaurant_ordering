import { Order } from '@/domain/entities/order.entity';
import { OrderRepository } from '@/domain/repositories/order.repository';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.orderId, order);
  }
}