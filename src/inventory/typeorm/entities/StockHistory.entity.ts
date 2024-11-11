import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'stock_history' })
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.stockHistory)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({
    type: 'enum',
    enum: ['increase', 'decrease', 'clear'],
    // enumName: 'stock_history_actiontype_enum',
  })
  actionType: string;

  @Column('int')
  lastQuantity: number;

  @Column('int')
  quantityChanged: number;

  @Column('int')
  currentQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
