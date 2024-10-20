import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDepartmentNameDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
