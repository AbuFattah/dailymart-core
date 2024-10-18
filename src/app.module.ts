import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/User.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { CatalogModule } from './catalog/catalog.module';

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
      entities: [User],
    }),
    UsersModule,
    AuthModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
