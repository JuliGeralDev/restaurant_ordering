import { removeItemFromCartUseCase } from '@/application/cart-use-cases';
import { apiHandler } from './utils/api-handler';
import { validateRemoveItemRequest } from './utils/cart-validators';
import { LambdaEvent } from './types/lambda-event.type';
import { getRequestSource } from './utils/request-source';

export const handler = (event: LambdaEvent) =>
  apiHandler(event, async (_event, body) => {
    const input = validateRemoveItemRequest(body);
    const result = await removeItemFromCartUseCase.execute({
      ...input,
      source: getRequestSource(event.headers),
    });

    return result.order;
  });
