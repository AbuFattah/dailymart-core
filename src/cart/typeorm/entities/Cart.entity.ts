import { User } from 'src/typeorm/entities/User.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './CartItem.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  tempCartId: string;

  @ManyToOne(() => User, (user) => user.carts, { nullable: true })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ nullable: true })
  shippingArea: string;

  @Column({ type: 'int' })
  shipping: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  grandTotal: number;
}
