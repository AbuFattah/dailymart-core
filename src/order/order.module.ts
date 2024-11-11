import { Module } from '@nestjs/common';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './typeorm/entities/Order.entity';
import { LineItem } from './typeorm/entities/LineItem.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, LineItem, Product])],
  providers: [OrderService, ProductsService],
  controllers: [OrderController],
})
export class OrderModule {}
