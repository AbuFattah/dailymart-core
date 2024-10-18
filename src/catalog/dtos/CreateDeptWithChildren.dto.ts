// create-subcategory.dto.ts
import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

class CreateSubcategoryForChildrenDto {
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsOptional()
  _id?: string;

  @IsMongoId()
  category_id: string;

  @IsNotEmpty()
  status: 'active' | 'inactive';
}

class CreateCategoryForChildrenDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  subcategories: CreateSubcategoryForChildrenDto[];

  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsMongoId()
  department_id: string;

  @IsNotEmpty()
  status: 'active' | 'inactive';
}

export class CreateDeptWithChildrenDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  categories: CreateCategoryForChildrenDto[];

  @IsNotEmpty()
  status: 'active' | 'inactive';
}
