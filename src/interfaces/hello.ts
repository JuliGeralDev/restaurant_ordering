import { orderRepository, timelineRepository } from '@/infrastructure/container';
import { AddItemToCartUseCase } from '@/application/use-cases/add-item-to-cart.use-case';
import { PricingService } from '@/domain/services/pricing.service';

const pricingService = new PricingService();

export const handler = async () => {
  const useCase = new AddItemToCartUseCase(
    orderRepository,
    pricingService,
    timelineRepository
  );

  const result = await useCase.execute({
    orderId: 'order-1',
    userId: 'user-1',
    productId: 'product-1',
    name: 'Burger',
    basePrice: 10000,
    quantity: 2,
  });

  // Get timeline using the SAME instance
  const timeline = await timelineRepository.findByOrderId(
    'order-1',
    1,
    10
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      order: result.order,
      lastEvent: result.event,
      timeline,
    }),
  };
};