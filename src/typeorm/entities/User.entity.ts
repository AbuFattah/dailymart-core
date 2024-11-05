import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole }) // admin or customer
  role: UserRole;

  @Column({ default: '' })
  profile: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  Updated_at: Date;

  @Column({ nullable: true })
  billingAddress: string;

  @Column({ nullable: true })
  shippingAddress: string;
}
