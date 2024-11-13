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

export enum PaymentMethods {
  COD = 'Cash On Delivery',
  Bkash = 'bKash',
}

export const ShippingCharge = {
  dhakaMetro: {
    name: 'Dhaka Metro Area',
    shippingCharge: 80,
  },
  dhakaSub: {
    name: 'Dhaka Sub Area',
    shippingCharge: 100,
  },
  outsideDhaka: {
    name: 'Outside Dhaka',
    shippingCharge: 150,
  },
};
