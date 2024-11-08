import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

export class CreateStockHistoryDto {
  @IsNotEmpty()
  product: Product;

  @IsEnum(['increase', 'decrease'])
  actionType: 'increase' | 'decrease';

  @IsInt()
  lastQuantity: number;

  @IsInt()
  currentQuantity: number;
}
