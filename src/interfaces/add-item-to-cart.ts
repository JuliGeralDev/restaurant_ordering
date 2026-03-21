import { orderRepository, timelineRepository } from '@/infrastructure/container';
import { AddItemToCartUseCase } from '@/application/use-cases/add-item-to-cart.use-case';
import { PricingService } from '@/domain/services/pricing.service';
import { randomUUID } from 'crypto';
import { menuRepository } from '@/infrastructure/container';

const pricingService = new PricingService();

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const {
      orderId,
      userId,
      productId,
      quantity,
      modifiers = [],
    } = body;

    const useCase = new AddItemToCartUseCase(
      orderRepository,
      pricingService,
      timelineRepository,
      menuRepository
    );

    const result = await useCase.execute({
      orderId,
      userId,
      productId,
      quantity,
      modifiers,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};