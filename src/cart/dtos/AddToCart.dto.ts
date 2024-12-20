import { IsNumber, IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  qty: number;
}
