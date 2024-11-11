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

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @Column()
  status: string;

  @Column('decimal')
  subtotal: number;

  @Column('decimal')
  discount: number;

  @Column('decimal')
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
