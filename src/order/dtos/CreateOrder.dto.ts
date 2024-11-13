import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLineItemDto } from './CreateLineItem.dto';
// import { LineItemDto } from './line-item.dto';

export class CreateOrderDto {
  // @IsNumber()
  // @IsNotEmpty()
  // subtotal: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsNumber()
  @IsOptional()
  tax: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsEnum(['placed', 'shipped', 'delivered', 'cancelled', 'returned'])
  @IsOptional()
  status?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  lineItems: CreateLineItemDto[];
}
