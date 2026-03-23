import { User } from '@/domain/entities/user.entity';

export const toUserDTO = (user: User) => ({
  userId: user.userId,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isDefault: user.isDefault,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
