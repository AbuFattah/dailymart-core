import { User } from 'src/typeorm/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LineItem } from './LineItem.entity';
import { Return } from './Return.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @Column({ default: 'placed' })
  status: string;

  @Column({ nullable: true, default: 'Cash On Delivery' })
  paymentMethod: string;

  @Column('decimal')
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  subtotal: number;

  @Column('decimal', { default: 0 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  discount: number;

  @Column('decimal', { default: 0 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  tax: number;

  @Column('decimal')
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  grandtotal: number;

  @Column('')
  username: string;

  @Column('')
  phone: string;

  @Column('')
  address: string;

  @Column('')
  area: string;

  @OneToMany(() => LineItem, (lineItem) => lineItem.order)
  lineItems: LineItem[];

  @OneToMany(() => Return, (returnEntity) => returnEntity.order)
  returns: Return[];

  @Column('int', { default: 0 })
  totalReturnedQty: number;

  @Column({ default: 'Not Returned' })
  returnStatus: string; // 'Not Returned', 'Partially Returned', 'Fully Returned'

  @Column('decimal', { default: 0 })
  @Transform(({ value }) => parseFloat(value), { toPlainOnly: true })
  adjustedTotalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
