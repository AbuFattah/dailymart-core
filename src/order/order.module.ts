import { Module } from '@nestjs/common';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './typeorm/entities/Order.entity';
import { LineItem } from './typeorm/entities/LineItem.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { Return } from './typeorm/entities/Return.entity';
import { ShippingCharge } from './typeorm/entities/ShippingCharge.entity';
import { ShippingChargeService } from './services/shipping-charge/shipping-charge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      LineItem,
      Product,
      Return,
      ShippingCharge,
    ]),
  ],
  providers: [OrderService, ProductsService, ShippingChargeService],
  controllers: [OrderController],
})
export class OrderModule {}
