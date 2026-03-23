import { UserService } from '@/application/services/user.service';
import { userRepository } from '@/infrastructure/container';
import { apiHandler } from './utils/api-handler';
import { toUserDTO } from './mappers/user.mapper';
import { LambdaEvent } from './types/lambda-event.type';

const userService = new UserService(userRepository);

export const handler = (event: LambdaEvent) =>
  apiHandler(
    event,
    async (event) => {
      const { userId } = event.pathParameters;
      const user = await userService.findByIdOrThrow(userId);
      return toUserDTO(user);
    },
    { requireBody: false }
  );
