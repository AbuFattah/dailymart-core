import { Cart } from 'src/cart/typeorm/entities/Cart.entity';
import { Order } from 'src/order/typeorm/entities/Order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole }) // admin or customer
  role: UserRole;

  @Column({ default: '' })
  profile: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  Updated_at: Date;

  @Column({ nullable: true })
  billingAddress: string;

  @Column({ nullable: true })
  shippingAddress: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
