import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
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
  @IsOptional()
  @IsString()
  category_id: string;
  @IsOptional()
  @IsString()
  category_name: string;
  @IsOptional()
  @IsString()
  subcategory_id: string;
  @IsOptional()
  @IsString()
  subcategory_name: string;
}
