import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/typeorm/entities/Cart.entity';
import { CartItem } from 'src/cart/typeorm/entities/CartItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
