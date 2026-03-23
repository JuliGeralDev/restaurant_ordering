import { updateItemInCartUseCase } from '@/application/cart-use-cases';
import { apiHandler } from './utils/api-handler';
import { logSafe } from '@/infrastructure/logging/logger';
import { validateUpdateItemRequest } from './utils/cart-validators';
import { LambdaEvent } from './types/lambda-event.type';
import { getRequestSource } from './utils/request-source';

export const handler = (event: LambdaEvent) =>
  apiHandler(event, async (event, body) => {
    logSafe('Received update-item-in-cart request', event.body);

    const input = validateUpdateItemRequest(body);
    const result = await updateItemInCartUseCase.execute({
      ...input,
      source: getRequestSource(event.headers),
    });

    return result;
  });
