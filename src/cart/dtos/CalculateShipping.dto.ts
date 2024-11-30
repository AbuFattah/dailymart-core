import { IsNumber, IsOptional, IsString } from 'class-validator';

export class calculateShipping {
  @IsNumber()
  shippingAreaId: number;

  @IsString()
  tempCartId: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
