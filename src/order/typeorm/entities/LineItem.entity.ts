import { User } from 'src/typeorm/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

@Entity({ name: 'line_item' })
@Unique(['order', 'product'])
export class LineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.lineItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  qty: number;

  @Column('decimal')
  price: number;

  @Column('decimal')
  lineAmt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
