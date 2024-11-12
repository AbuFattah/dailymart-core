import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(['placed', 'shipped', 'delivered', 'cancelled', 'returned'])
  status: string;
}
