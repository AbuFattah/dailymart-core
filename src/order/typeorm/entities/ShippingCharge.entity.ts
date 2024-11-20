import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'shipping_charge' })
export class ShippingCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  area: string;

  @Column('int')
  charge: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
