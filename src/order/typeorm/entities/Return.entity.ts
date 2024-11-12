import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LineItem } from './LineItem.entity';
import { Order } from './Order.entity';

@Entity({ name: 'returns' })
export class Return {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.returns)
  order: Order;

  @ManyToOne(() => LineItem)
  lineItem: LineItem;

  @Column('int')
  returnQty: number;

  @Column('decimal')
  refundAmount: number; // Refund amount for this specific return

  @Column({ nullable: true })
  returnReason: string;

  @Column()
  returnStatus: string; // 'Returned' or 'Partially Returned'

  @CreateDateColumn()
  returnDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
