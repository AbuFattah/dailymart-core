import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be 6 characters long' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be 6 characters long' })
  confirmNewPassword: string;
}
