import { Order } from '../entities/order.entity';

export interface OrderRepository {
  findById(orderId: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Order): Promise<void>;
}