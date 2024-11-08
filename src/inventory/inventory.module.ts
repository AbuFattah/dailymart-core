import { Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory/inventory.controller';
import { InventoryService } from './service/inventory/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './typeorm/entities/Inventory.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product])],
  controllers: [InventoryController],
  providers: [InventoryService, ProductsService],
})
export class InventoryModule {}
