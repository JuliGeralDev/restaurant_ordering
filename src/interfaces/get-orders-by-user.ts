import { orderRepository } from '@/infrastructure/container';
import { toOrderDTO } from './mappers/order.mapper';
import { ValidationError } from '@/domain/errors/validation.error';
import { apiHandler } from './utils/api-handler';
import { LambdaEvent } from './types/lambda-event.type';

export const handler = (event: LambdaEvent) =>
  apiHandler(
    event,
    async (event) => {
      const userId = event.queryStringParameters?.userId;

      if (!userId) {
        throw new ValidationError('userId query parameter is required');
      }

      const orders = await orderRepository.findByUserId(userId);

      return orders.map(toOrderDTO);
    },
    { requireBody: false }
  );
