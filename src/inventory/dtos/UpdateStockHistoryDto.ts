import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

export class UpdateStockHistoryDto {
  @IsOptional()
  product?: Product;

  @IsOptional()
  @IsEnum(['increase', 'decrease'])
  actionType?: 'increase' | 'decrease';

  @IsOptional()
  @IsInt()
  lastQuantity?: number;

  @IsOptional()
  @IsInt()
  currentQuantity?: number;
}
