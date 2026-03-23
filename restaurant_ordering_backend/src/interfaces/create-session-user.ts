import { UserService } from '@/application/services/user.service';
import { userRepository } from '@/infrastructure/container';
import { apiHandler } from './utils/api-handler';
import { validator } from './utils/field-validator';
import { toUserDTO } from './mappers/user.mapper';
import { LambdaEvent } from './types/lambda-event.type';

const userService = new UserService(userRepository);

export const handler = (event: LambdaEvent) =>
  apiHandler(event, async (_event, body) => {
    validator.required('username', body.username);
    validator.required('name', body.name);
    validator.required('email', body.email);
    validator.required('phone', body.phone);
    validator.isEmail('email', body.email);

    const user = await userService.createOrFind({
      userId: body.userId,
      username: body.username,
      name: body.name,
      email: body.email,
      phone: body.phone,
      isDefault: Boolean(body.isDefault),
    });

    return toUserDTO(user);
  });
