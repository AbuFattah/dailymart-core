import { IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateCartDto {
  @IsUUID()
  cartId: UUID;

  @IsNumber()
  cartItemId: number;

  @IsNumber()
  qty: number; // If qty = 0, remove the item
}
