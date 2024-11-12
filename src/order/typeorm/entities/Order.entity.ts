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

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @Column({ default: 'placed' })
  status: string;

  @Column('decimal')
  subtotal: number;

  @Column('decimal', { default: 0 })
  discount: number;

  @Column('decimal', { default: 0 })
  tax: number;

  @Column('decimal')
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
  totalReturnedQty: number; // Total quantity of returned items

  @Column({ default: 'Not Returned' })
  returnStatus: string; // 'Not Returned', 'Partially Returned', 'Fully Returned'

  @Column('decimal', { default: 0 })
  adjustedTotalAmount: number; // Total amount after refunds

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
