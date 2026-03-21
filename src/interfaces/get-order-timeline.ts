import { timelineRepository } from '@/infrastructure/container';

export const handler = async (event: any) => {
  const { orderId } = event.pathParameters;
  const { pageSize = '10', nextToken } = event.queryStringParameters || {};

  // Validate pageSize
  const pageSizeNum = Number(pageSize);
  if (!Number.isInteger(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 50) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'pageSize must be a positive integer between 1 and 50',
      }),
    };
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
};