import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ProductWithInventoryDto {
  @IsUUID()
  product_id: string;

  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsNumber()
  qty: number;
}
