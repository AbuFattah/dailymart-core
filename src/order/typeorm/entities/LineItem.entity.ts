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
import { Transform } from 'class-transformer';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  lineAmt: number;

  @Column('int', { default: 0 })
  returnQty: number;

  @Column({ default: 'Not Returned' })
  returnStatus: string; // 'Not Returned', 'Partially Returned', 'Returned'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  refundAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
