import { Module } from '@nestjs/common';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './typeorm/entities/Order.entity';
import { LineItem } from './typeorm/entities/LineItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, LineItem])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
