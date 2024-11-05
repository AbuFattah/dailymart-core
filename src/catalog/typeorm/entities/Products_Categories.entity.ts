import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products_categories' })
export class ProductsCategories {
  @PrimaryColumn()
  product_id: string;

  @PrimaryColumn()
  category_id: string;

  @PrimaryColumn()
  subcategory_id: string;

  @Column()
  category_name: string;

  @Column()
  category_status: string;
}
