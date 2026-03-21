import { orderRepository, timelineRepository } from '@/infrastructure/container';
import { PricingService } from '@/domain/services/pricing.service';
import { RemoveItemFromCartUseCase } from '@/application/use-cases/remove-item-from-cart.use-case';
import { validatePayloadSize } from './utils/payload-validator';
import { ValidationError } from '@/domain/errors/validation.error';
import { handleError } from './utils/error-response';

const pricingService = new PricingService();

export const handler = async (event: any) => {
  try {
    validatePayloadSize(event.body);
    const body = JSON.parse(event.body || '{}');

    const { orderId, userId, productId } = body;

    if (!orderId || !userId || !productId) {
      throw new ValidationError('orderId, userId, and productId are required');
    }

    const useCase = new RemoveItemFromCartUseCase(
      orderRepository,
      timelineRepository,
      pricingService
    );

    const result = await useCase.execute({
      orderId,
      userId,
      productId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result.order),
    };
  } catch (error: any) {
    return handleError(error);
  }
};