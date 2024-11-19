import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  cartItemId: number;

  @IsNumber()
  qty: number; // If qty = 0, remove the item
}
