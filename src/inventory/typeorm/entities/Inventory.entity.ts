import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'product_id' })
  @Index()
  product: Product;

  @Column({ default: 0 })
  qty: number;
}
