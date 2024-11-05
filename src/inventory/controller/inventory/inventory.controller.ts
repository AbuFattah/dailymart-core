import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { InventoryService } from 'src/inventory/service/inventory/inventory.service';
import { Inventory } from 'src/inventory/typeorm/entities/Inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post(':productId')
  async addInventory(
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.addInventory(productId, quantity);
  }

  @Patch(':productId')
  async updateInventory(
    @Param('productId') productId: number,
    @Body('newQuantity') newQuantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(productId, newQuantity);
  }

  @Delete(':productId')
  async removeInventory(
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.removeInventory(productId, quantity);
  }

  @Get(':productId')
  async getInventoryByProductId(
    @Param('productId') productId: number,
  ): Promise<Inventory> {
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Get()
  async getAllInventories(): Promise<Inventory[]> {
    return this.inventoryService.getAllInventories();
  }

  @Patch(':productId/clear')
  async clearInventory(
    @Param('productId') productId: number,
  ): Promise<Inventory> {
    return this.inventoryService.clearInventory(productId);
  }
}
