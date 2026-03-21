import { dynamoDB } from '@/infrastructure/database/dynamo.client';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class DynamoMenuRepository {
    async findAll() {
        const result = await dynamoDB.send(
            new ScanCommand({
                TableName: process.env.TABLE_MENU,
            })
        );

        return result.Items || [];
    }

    async findById(productId: string) {
        const result = await dynamoDB.send(
            new GetCommand({
                TableName: process.env.TABLE_MENU,
                Key: { productId },
            })
        );

        return result.Item || null;
    }
}