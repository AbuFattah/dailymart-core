import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateLineItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsPositive()
  qty: number;

  @IsNumber()
  @IsPositive()
  cost: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
