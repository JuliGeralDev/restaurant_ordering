import { timelineRepository } from '@/infrastructure/container';

export const handler = async (event: any) => {
  const { orderId } = event.pathParameters;
  const { page = '1', pageSize = '10' } = event.queryStringParameters || {};

  const result = await timelineRepository.findByOrderId(
    orderId,
    Number(page),
    Number(pageSize)
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};