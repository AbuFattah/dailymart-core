import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ nullable: true })
  origin: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  category_id: string;

  @Column({ nullable: true })
  category_name: string;

  @Column({ nullable: true })
  subcategory_id: string;

  @Column({ nullable: true })
  subcategory_name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  color: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
