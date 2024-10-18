import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsNotEmpty()
  status: 'active' | 'inactive';
}
