import { IsNotEmpty, IsArray } from 'class-validator';
import { CreateCategoryDto } from './CreateCategory.dto';

export class CreateDepartmentDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  categories?: CreateCategoryDto[] = [];

  @IsNotEmpty()
  status: 'active' | 'inactive' = 'active';
}
