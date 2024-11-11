import { IsArray } from 'class-validator';

export class UpdateLineItemCostDto {
  @IsArray()
  lineItems: {
    lineItemId: number;
    cost: number;
  }[];
}
