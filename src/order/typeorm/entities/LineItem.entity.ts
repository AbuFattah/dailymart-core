import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

@Entity({ name: 'line_item' })
export class LineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.lineItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  name: string;

  @Column()
  size: string;

  @Column('int')
  qty: number;

  @Column('decimal')
  cost: number;

  @Column('decimal')
  price: number;

  @Column('decimal')
  lineAmt: number;

  @Column('int', { default: 0 })
  returnQty: number; // Quantity of this line item being returned

  @Column({ default: 'Not Returned' })
  returnStatus: string; // 'Not Returned', 'Partially Returned', 'Returned'

  @Column('decimal', { default: 0 })
  refundAmount: number; // Amount refunded for this line item

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
