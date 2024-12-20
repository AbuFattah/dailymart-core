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
import { BullModule } from '@nestjs/bullmq';
import { StockHistoryProcessor } from './service/stock-history/stock-history.processor';
import { CatalogModule } from 'src/catalog/catalog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, StockHistory, Product]),
    BullModule.registerQueue({
      name: 'stock-queue',
    }),
    BullModule.registerQueue({
      name: 'products-queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'fixed', delay: 2000 },
      },
    }),
    CatalogModule,
  ],
  controllers: [InventoryController, StockHistoryController],
  providers: [
    InventoryService,
    ProductsService,
    StockHistoryProcessor,
    StockHistoryService,
  ],
})
export class InventoryModule {}
