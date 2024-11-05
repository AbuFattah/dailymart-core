import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  price: number;

  @IsOptional()
  @IsString()
  origin: string;

  @IsString()
  status: 'active' | 'inactive' = 'active';

  @IsOptional()
  category_id: string;

  @IsOptional()
  category_name: string;

  @IsOptional()
  subcategory_id: string;

  @IsOptional()
  subcategory_name: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  color: string;
}
