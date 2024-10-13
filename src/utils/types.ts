import { UserRole } from 'src/typeorm/entities/User.entity';

export type CreateUserParams = {
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserParams = {
  password?: string;
  profile?: string;
  address?: string;
};
