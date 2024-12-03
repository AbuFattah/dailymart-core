import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryNameDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
