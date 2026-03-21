import { timelineRepository } from '@/infrastructure/container';
import { ValidationError } from '@/domain/errors/validation.error';
import { handleError } from './utils/error-response';

export const handler = async (event: any) => {
  try {
    const { orderId } = event.pathParameters;
    const { pageSize = '10', nextToken } = event.queryStringParameters || {};

    // Validate pageSize
    const pageSizeNum = Number(pageSize);
    if (!Number.isInteger(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 50) {
      throw new ValidationError('pageSize must be a positive integer between 1 and 50');
    }

    const result = await timelineRepository.findByOrderId(
      orderId,
      pageSizeNum,
      nextToken
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return handleError(error);
  }
};