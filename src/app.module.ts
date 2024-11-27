import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/User.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { CatalogModule } from './catalog/catalog.module';
import { Product } from './catalog/typeorm/entities/Product.entity';
import { ProductsCategories } from './catalog/typeorm/entities/Products_Categories.entity';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/typeorm/entities/Inventory.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/typeorm/entities/Order.entity';
import { LineItem } from './order/typeorm/entities/LineItem.entity';
import { StockHistory } from './inventory/typeorm/entities/StockHistory.entity';
import { Return } from './order/typeorm/entities/Return.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/typeorm/entities/Cart.entity';
import { CartItem } from './cart/typeorm/entities/CartItem.entity';
import { ShippingCharge } from './order/typeorm/entities/ShippingCharge.entity';
import { NotificationsModule } from './notifications/notifications.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       load: [
//         () => ({
//           envFilePath: path.resolve(
//             __dirname,
//             process.env.NODE_ENV === 'production'
//               ? '.env.production'
//               : '.env.development',
//           ),
//         }),
//       ],
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5555,
//       username: 'dailymart',
//       password: 'dailymart@123',
//       synchronize: true,
//       entities: [User],
//     }),
//     UsersModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'dailymart',
      password: 'dailymart@123',
      synchronize: true,
      entities: [
        User,
        Product,
        ProductsCategories,
        Inventory,
        StockHistory,
        Order,
        LineItem,
        Return,
        Cart,
        CartItem,
        ShippingCharge,
      ],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    OrderModule,
    CartModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
