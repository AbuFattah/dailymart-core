import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubcategoryNameDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
