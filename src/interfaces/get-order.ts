import { orderRepository } from '@/infrastructure/container';
import { toOrderDTO } from './mappers/order.mapper';
import { NotFoundError } from '@/domain/errors/not-found.error';
import { handleError } from './utils/error-response';

export const handler = async (event: any) => {
  try {
    const { orderId } = event.pathParameters;

    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(toOrderDTO(order)),
    };
  } catch (error: any) {
    return handleError(error);
  }
};