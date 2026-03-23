import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';
import { dynamoDB } from '@/infrastructure/database/dynamo.client';

export class DynamoUserRepository implements UserRepository {
  async findById(userId: string): Promise<User | null> {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: process.env.TABLE_USERS || 'users',
        Key: { userId },
      })
    );

    return (result.Item as User) || null;
  }

  async findByIdentityKey(identityKey: string): Promise<User | null> {
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: process.env.TABLE_USERS || 'users',
        IndexName: 'identityKey-index',
        KeyConditionExpression: 'identityKey = :identityKey',
        ExpressionAttributeValues: {
          ':identityKey': identityKey,
        },
        Limit: 1,
      })
    );

    return ((result.Items as User[] | undefined) ?? [])[0] ?? null;
  }

  async save(user: User): Promise<void> {
    await dynamoDB.send(
      new PutCommand({
        TableName: process.env.TABLE_USERS || 'users',
        Item: user,
      })
    );
  }
}
