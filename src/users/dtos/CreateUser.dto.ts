import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/typeorm/entities/User.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  provider: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be 6 characters long' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either customer or admin' })
  role: UserRole;
}
