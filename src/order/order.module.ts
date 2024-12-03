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
import { CartService } from 'src/cart/service/cart/cart.service';
import { Cart } from 'src/cart/typeorm/entities/Cart.entity';
import { CartItem } from 'src/cart/typeorm/entities/CartItem.entity';
import { BullModule } from '@nestjs/bullmq';
import { CatalogModule } from 'src/catalog/catalog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      LineItem,
      Product,
      Return,
      ShippingCharge,
      Cart,
      CartItem,
    ]),
    BullModule.registerQueue({
      name: 'products-queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'fixed', delay: 2000 },
      },
    }),
    CatalogModule,
  ],
  providers: [
    OrderService,
    ProductsService,
    ShippingChargeService,
    CartService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
