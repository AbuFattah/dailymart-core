import { Module } from '@nestjs/common';
import { CartController } from './controller/cart/cart.controller';
import { CartService } from './service/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './typeorm/entities/Cart.entity';
import { CartItem } from './typeorm/entities/CartItem.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Cart, CartItem])],
  controllers: [CartController],
  providers: [CartService, ProductsService],
})
export class CartModule {}
