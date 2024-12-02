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
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAllInventories() {
    return await this.inventoryService.getAllInventories();
  }
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add/:productId')
  async addInventory(
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.addInventory(productId, quantity);
  }
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':productId')
  async updateInventory(
    @Param('productId') productId: string,
    @Body('newQuantity') newQuantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(productId, newQuantity);
  }

  @Post('remove/:productId')
  async removeInventory(
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.removeInventory(productId, quantity);
  }

  @Get(':productId')
  async getInventoryByProductId(
    @Param('productId') productId: string,
  ): Promise<Inventory> {
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Patch('clear/:productId')
  async clearInventory(
    @Param('productId') productId: string,
  ): Promise<Inventory> {
    return this.inventoryService.clearInventory(productId);
  }
}
