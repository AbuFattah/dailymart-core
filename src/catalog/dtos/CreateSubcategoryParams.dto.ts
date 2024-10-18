import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSubcategoryParamsDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid departmentId format.' })
  departmentId: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid categoryId format.' })
  categoryId: string;
}
