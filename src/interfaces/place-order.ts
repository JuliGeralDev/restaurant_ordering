import { orderRepository, timelineRepository, idempotencyRepository } from '@/infrastructure/container';
import { PlaceOrderUseCase } from '@/application/use-cases/place-order.use-case';
import { validatePayloadSize } from './utils/payload-validator';
import { ValidationError } from '@/domain/errors/validation.error';
import { handleError } from './utils/error-response';

export const handler = async (event: any) => {
  try {
    validatePayloadSize(event.body);
    const body = JSON.parse(event.body || '{}');

    const { orderId, userId } = body;

    if (!orderId || !userId) {
      throw new ValidationError('orderId and userId are required');
    }

    const key =
      event.headers?.['Idempotency-Key'] ||
      event.headers?.['idempotency-key'];

    if (!key) {
      throw new ValidationError('Idempotency-Key header is required');
    }

    // Check existing
    const existing = await idempotencyRepository.findByKey(key);

    if (existing) {
      // SECURITY: Validate that orderId and userId match the original request
      if (
        existing.response.orderId !== orderId ||
        existing.response.userId !== userId
      ) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            error: 'Unprocessable entity',
            message: 'Idempotency key conflict: orderId or userId mismatch',
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(existing.response),
      };
    }

    const useCase = new PlaceOrderUseCase(
      orderRepository,
      timelineRepository
    );

    const result = await useCase.execute({
      orderId,
      userId,
      correlationId: key,
    });

    // Save idempotency record
    await idempotencyRepository.save({
      key,
      response: result,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 202,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return handleError(error);
  }
};