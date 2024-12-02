import { IsNumber, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class CreateLineItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

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
