import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ default: 0 })
  qty: number;
}
