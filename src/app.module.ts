import { Module } from '@nestjs/common';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'dailymart',
      password: 'dailymart@123',
      synchronize: true,
      entities: [User, Product, ProductsCategories, Inventory, Order, LineItem],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
