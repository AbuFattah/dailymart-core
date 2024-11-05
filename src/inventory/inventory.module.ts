import { Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory/inventory.controller';
import { InventoryService } from './service/inventory/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './typeorm/entities/Inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
