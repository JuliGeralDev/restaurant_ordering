import { orderRepository } from '@/infrastructure/container';
import { toOrderDTO } from './mappers/order.mapper';

export const handler = async (event: any) => {
  const { orderId } = event.pathParameters;

  const order = await orderRepository.findById(orderId);

  if (!order) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Order not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(toOrderDTO(order)),
  };
};