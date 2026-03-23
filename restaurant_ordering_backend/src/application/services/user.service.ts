import { randomUUID } from 'crypto';

import { User } from '@/domain/entities/user.entity';
import { NotFoundError } from '@/domain/errors/not-found.error';
import { ValidationError } from '@/domain/errors/validation.error';
import { UserRepository } from '@/domain/repositories/user.repository';

export interface CreateOrFindUserInput {
  userId?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  isDefault?: boolean;
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createOrFind(input: CreateOrFindUserInput): Promise<User> {
    const normalized = this.normalizeInput(input);
    const identityKey = this.buildIdentityKey(normalized);
    const existingUser = await this.userRepository.findByIdentityKey(identityKey);

    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();
    const user: User = {
      userId: normalized.userId ?? `usr_${randomUUID()}`,
      username: normalized.username,
      name: normalized.name,
      email: normalized.email,
      phone: normalized.phone,
      identityKey,
      isDefault: normalized.isDefault ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await this.userRepository.save(user);
    return user;
  }

  async findByIdOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private normalizeInput(input: CreateOrFindUserInput): CreateOrFindUserInput {
    const username = input.username.trim();
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.trim();

    if (!username || !name || !email || !phone) {
      throw new ValidationError('username, name, email and phone are required');
    }

    return {
      ...input,
      username,
      name,
      email,
      phone,
    };
  }

  private buildIdentityKey(input: CreateOrFindUserInput): string {
    return [input.username, input.email, input.phone.replace(/\s+/g, '')]
      .map((value) => value.trim().toLowerCase())
      .join('#');
  }
}
