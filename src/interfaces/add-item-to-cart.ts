import { orderRepository, timelineRepository } from '@/infrastructure/container';
import { AddItemToCartUseCase } from '@/application/use-cases/add-item-to-cart.use-case';
import { PricingService } from '@/domain/services/pricing.service';
import { menuRepository } from '@/infrastructure/container';
import { validatePayloadSize } from './utils/payload-validator';
import { logSafe } from '@/infrastructure/logging/logger';
import { ValidationError } from '@/domain/errors/validation.error';
import { handleError } from './utils/error-response';

const pricingService = new PricingService();

export const handler = async (event: any) => {
  try {
    validatePayloadSize(event.body);
    logSafe('Received add-item-to-cart request', event.body);

    const body = JSON.parse(event.body || '{}');

    const {
      orderId, // Opcional - backend generará si no viene
      userId,
      productId,
      quantity,
      modifiers = [],
    } = body;

    // Validate basic inputs (orderId es opcional)
    if (!userId || !productId) {
      throw new ValidationError('userId and productId are required');
    }

    // Convert quantity to number and validate
    const quantityNum = Number(quantity);
    if (!Number.isInteger(quantityNum) || quantityNum < 1) {
      throw new ValidationError('quantity must be a positive integer');
    }

    // Transform modifiers from simple format {type, value} to full format {groupId, optionId, name, price}
    const transformedModifiers = modifiers.map((mod: any) => ({
      groupId: mod.type || mod.groupId,
      optionId: mod.value || mod.optionId,
      name: mod.name || mod.value || mod.optionId,
      price: mod.price || 0,
    }));

    const useCase = new AddItemToCartUseCase(
      orderRepository,
      pricingService,
      timelineRepository,
      menuRepository
    );

    const result = await useCase.execute({
      orderId: orderId || undefined, // Pasar undefined si no viene
      userId,
      productId,
      quantity: quantityNum,
      modifiers: transformedModifiers,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result.order),
    };
  } catch (error: any) {
    return handleError(error);
  }
};