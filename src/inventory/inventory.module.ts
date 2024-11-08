import { Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory/inventory.controller';
import { InventoryService } from './service/inventory/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './typeorm/entities/Inventory.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { StockHistory } from './typeorm/entities/StockHistory.entity';
import { StockHistoryController } from './controller/stock-history/stock-history.controller';
import { StockHistoryService } from './service/stock-history/stock-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, StockHistory, Product])],
  controllers: [InventoryController, StockHistoryController],
  providers: [InventoryService, ProductsService, StockHistoryService],
})
export class InventoryModule {}
