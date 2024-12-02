import { IsNumber, IsUUID } from 'class-validator';

export class UpdateCartDto {
  @IsUUID()
  cartId: string;

  @IsNumber()
  cartItemId: number;

  @IsNumber()
  qty: number; // If qty = 0, remove the item
}
