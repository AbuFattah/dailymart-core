import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { Roles } from 'src/auth/utils/roles.decorator';
import { RolesGuard } from 'src/auth/utils/roles.guard';
import { InventoryService } from 'src/inventory/service/inventory/inventory.service';
import { Inventory } from 'src/inventory/typeorm/entities/Inventory.entity';

@Controller('inventory')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAllInventories() {
    return await this.inventoryService.getAllInventories();
  }

  @Post('add/:productId')
  async addInventory(
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.addInventory(productId, quantity);
  }

  @Patch(':productId')
  async updateInventory(
    @Param('productId') productId: number,
    @Body('newQuantity') newQuantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(productId, newQuantity);
  }

  @Post('remove/:productId')
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

  @Patch('clear/:productId')
  async clearInventory(
    @Param('productId') productId: number,
  ): Promise<Inventory> {
    return this.inventoryService.clearInventory(productId);
  }
}
