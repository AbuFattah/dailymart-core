import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { Roles } from 'src/auth/utils/roles.decorator';
import { RolesGuard } from 'src/auth/utils/roles.guard';

import { CreateProductDto } from 'src/catalog/dtos/products/CreateProduct.dto';
import { UpdateProductDto } from 'src/catalog/dtos/products/UpdateProduct.dto';
import { ProductsService } from 'src/catalog/services/products/products.service';

@Controller('products')
@Roles('admin')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Get('subcategory/:subcategoryId')
  async getProductsBySubcategory(
    @Param('subcategoryId') subcategoryId: string,
  ) {
    return this.productService.getProductsBySubcategory(subcategoryId);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Patch('activate/:id')
  async activateProduct(@Param('id') id: number) {
    const product = await this.productService.getInactiveProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found or already active');
    }
    return this.productService.activateProductById(id);
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: number) {
    return this.productService.removeProduct(id);
  }
}
