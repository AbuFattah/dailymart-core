import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateProductDto } from 'src/catalog/dtos/products/CreateProduct.dto';
import { UpdateProductDto } from 'src/catalog/dtos/products/UpdateProduct.dto';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { CreateProductParams, UpdateProductParams } from 'src/catalog/Types';
import { ProductWithInventoryDto } from 'src/inventory/dtos/ProductWithInventoryDto';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(productDetails: CreateProductParams) {
    try {
      const product = this.productRepository.create({
        ...productDetails,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating product: ${productDetails.name} , Error: ${error}`,
      );
    }
  }

  async createProducts(productDetails: CreateProductDto[]): Promise<Product[]> {
    try {
      // transform plain JSON to DTO instances and validate each
      const products = plainToInstance(CreateProductDto, productDetails);
      for (const product of products) {
        await validateOrReject(product);
      }

      // adding timestamps
      const productsToSave = products.map((product) => ({
        ...product,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      return await this.productRepository.save(productsToSave);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating products. Error: ${error.message}`,
      );
    }
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id, status: 'active' },
      relations: ['inventory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getInactiveProductById(id: string) {
    const product = await this.productRepository.findOneBy({
      id,
      status: 'inactive',
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = this.productRepository.find({
      where: { category_id: categoryId, status: 'active' },
    });

    return products;
  }

  async getProductsBySubcategory(subcategoryId: string): Promise<Product[]> {
    const products = this.productRepository.find({
      where: { subcategory_id: subcategoryId, status: 'active' },
    });

    return products;
  }

  async updateProduct(
    id: string,
    updateProductsDetails: UpdateProductParams,
  ): Promise<Product> {
    try {
      const product = await this.getProductById(id);

      if (!product) {
        throw new NotFoundException(
          'Product not found, ' + 'Product status may be inactive',
        );
      }

      const updatedProduct = {
        ...product,
        ...updateProductsDetails,
        updated_at: new Date(),
      };
      const savedProduct = this.productRepository.save(updatedProduct);
      return savedProduct;
      //
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating product: ${updateProductsDetails.name} , Error: ${error}`,
      );
    }
  }

  async activateProductById(id: string) {
    const product = await this.getInactiveProductById(id);
    product.status = 'active';

    const activeProduct = this.productRepository.save(product);
    return activeProduct;
  }

  async removeProduct(id: string) {
    try {
      const product = await this.getProductById(id);
      product.status = 'inactive';

      const savedProduct = this.productRepository.save(product);
      return savedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing product , Error:${error}`,
      );
    }
  }
}
