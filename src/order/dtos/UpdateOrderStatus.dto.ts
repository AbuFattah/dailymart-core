import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(['placed', 'shipped', 'delivered', 'cancelled', 'returned'])
  status: string;
}
