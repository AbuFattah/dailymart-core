import { IsArray, IsString } from 'class-validator';

export class CreateReturnDto {
  @IsString()
  orderId: string;
  @IsArray()
  lineItems: {
    lineItemId: number;
    returnQty: number;
    returnReason: string;
  }[];
}
