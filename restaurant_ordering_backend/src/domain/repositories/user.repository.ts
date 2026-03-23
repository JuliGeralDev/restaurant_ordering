import { User } from '@/domain/entities/user.entity';

export interface UserRepository {
  findById(userId: string): Promise<User | null>;
  findByIdentityKey(identityKey: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
