import { User } from 'src/typeorm/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LineItem } from './LineItem.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'enum',
    enum: ['placed', 'shipped', 'delivered', 'cancelled', 'returned'],
  })
  status: string;

  @Column('decimal')
  subtotal: number;

  @Column('decimal')
  discount: number;

  @Column('decimal')
  tax: number;

  @Column('decimal')
  grandtotal: number;

  @OneToMany(() => LineItem, (lineItem) => lineItem.order)
  lineItems: LineItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
