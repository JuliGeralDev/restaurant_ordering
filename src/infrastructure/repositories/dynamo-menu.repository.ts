import { dynamoDB } from '@/infrastructure/database/dynamo.client';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoMenuRepository {
    async findAll() {
        const result = await dynamoDB.send(
            new ScanCommand({
                TableName: 'menu',
            })
        );

        return result.Items || [];
    }

    async findById(productId: string) {
        const result = await dynamoDB.send(
            new GetCommand({
                TableName: 'menu',
                Key: { productId },
            })
        );

        return result.Item || null;
    }
}