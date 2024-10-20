import { IsNotEmpty, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { CreateSubcategoryDto } from './CreateSubcategory.dto';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  subcategories?: CreateSubcategoryDto[] = [];

  @IsMongoId()
  @IsOptional()
  _id?: string;

  @IsNotEmpty()
  status: 'active' | 'inactive' = 'active';
}
