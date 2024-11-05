import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { CreateCategoryDto } from './CreateCategory.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'The name of the department',
    example: 'Baby Food',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The categories of the department',
    example: [{ name: 'oats', subcategories: [] }],
  })
  @IsArray()
  categories?: CreateCategoryDto[] = [];

  @IsOptional()
  filter: string[];

  @IsNotEmpty()
  status: 'active' | 'inactive' = 'active';
}
