import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './controllers/categories/categories.controller';
import { ProductsController } from './controllers/products/products.controller';
import { CategoriesService } from './services/categories/categories.service';
import { ProductsService } from './services/products/products.service';
import {
  CategoriesHierarchySchema,
  CategoryHierarchy,
} from './mongoose/schemas/Categories.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { Product } from './typeorm/entities/Product.entity';
import { ProductsCategories } from './typeorm/entities/Products_Categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductsCategories]),
    MongooseModule.forFeature([
      { name: CategoryHierarchy.name, schema: CategoriesHierarchySchema },
    ]),
  ],
  controllers: [CategoriesController, ProductsController],
  providers: [CategoriesService, ProductsService],
})
export class CatalogModule {}
