import { Module } from '@nestjs/common';
import { CartController } from './controller/cart/cart.controller';
import { CartService } from './service/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './typeorm/entities/Cart.entity';
import { CartItem } from './typeorm/entities/CartItem.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { ShippingChargeService } from 'src/order/services/shipping-charge/shipping-charge.service';
import { ShippingCharge } from 'src/order/typeorm/entities/ShippingCharge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Cart, CartItem, ShippingCharge]),
  ],
  controllers: [CartController],
  providers: [CartService, ProductsService, ShippingChargeService],
})
export class CartModule {}
