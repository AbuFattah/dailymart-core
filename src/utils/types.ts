import { UserRole } from 'src/typeorm/entities/User.entity';

export type CreateUserParams = {
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserParams = {
  profile?: string;
  billingAddress?: string;
  shippingAddress?: string;
};

export type UpdatePassParams = {
  password: string;
};
