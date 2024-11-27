import { Cart } from 'src/cart/typeorm/entities/Cart.entity';
import { Order } from 'src/order/typeorm/entities/Order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column('text', { array: true, default: [] })
  providers: string[];

  @Column({ type: 'enum', enum: UserRole }) // admin or customer
  role: UserRole;

  @Column({ default: '' })
  profile: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
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
