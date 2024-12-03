import { InjectQueue } from '@nestjs/bullmq';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateProductDto } from 'src/catalog/dtos/products/CreateProduct.dto';
import { UpdateProductDto } from 'src/catalog/dtos/products/UpdateProduct.dto';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { CreateProductParams, UpdateProductParams } from 'src/catalog/Types';
import { ProductWithInventoryDto } from 'src/inventory/dtos/ProductWithInventoryDto';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createProduct(productDetails: CreateProductParams) {
    try {
      const { category_id, subcategory_id } = productDetails;

      let category_name = '';

      if (category_id) {
        category_name = (
          await this.categoriesService.getCategorybyId(category_id)
        ).categoryName;
      }

      let subcategory_name = '';
      if (subcategory_id) {
        subcategory_name = (
          await this.categoriesService.getSubcategorybyId(subcategory_id)
        ).subcategoryName;
      }

      const product = this.productRepository.create({
        ...productDetails,
        category_name,
        subcategory_name,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await this.cacheManager.del(`productsByCategory:${category_id}`);
      await this.cacheManager.del(`productsBySubcategory:${subcategory_id}`);

      return await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating product: ${productDetails.name} , Error: ${error}`,
      );
    }
  }

  async updateProductCategoryNameById(categoryId: string, name: string) {
    try {
      await this.productRepository.update(
        { category_id: categoryId },
        { category_name: name },
      );

      return { categoryId, categoryName: name };
    } catch (error) {
      throw error;
    }
  }

  async updateProductSubcategoryNameById(subCategoryId: string, name: string) {
    try {
      await this.productRepository.update(
        { subcategory_id: subCategoryId },
        { subcategory_name: name },
      );

      return { subCategoryId, subcagoryName: name };
    } catch (error) {
      throw error;
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

  // async getProductById(id: string) {
  //   const product = await this.productRepository.findOne({
  //     where: { id, status: 'active' },
  //     relations: ['inventory'],
  //   });

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }
  //   return product;
  // }

  async getProductById(id: string) {
    const cachedProduct: Product = await this.cacheManager.get(`product:${id}`);

    if (cachedProduct) {
      console.log(cachedProduct);

      return cachedProduct;
    }

    const product = await this.productRepository.findOne({
      where: { id, status: 'active' },
      relations: ['inventory'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.cacheManager.set(`product:${id}`, product);

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
    const cachedProducts: Product[] = await this.cacheManager.get(
      `productsByCategory:${categoryId}`,
    );

    if (cachedProducts) {
      return cachedProducts;
    }
    const products = this.productRepository.find({
      where: { category_id: categoryId, status: 'active' },
    });

    await this.cacheManager.set(`productsByCategory:${categoryId}`, products);

    return products;
  }

  async getProductsBySubcategory(subcategoryId: string): Promise<Product[]> {
    const cachedProducts: Product[] = await this.cacheManager.get(
      `productsBySubcategory:${subcategoryId}`,
    );

    if (cachedProducts) return cachedProducts;

    const products = this.productRepository.find({
      where: { subcategory_id: subcategoryId, status: 'active' },
    });

    await this.cacheManager.set(
      `productsBySubcategory:${subcategoryId}`,
      products,
    );

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
      await this.cacheManager.set(`product:${id}`, updatedProduct);
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
    await this.cacheManager.del(`product:${id}`);
    return activeProduct;
  }

  async removeProduct(id: string) {
    try {
      const product = await this.getProductById(id);
      product.status = 'inactive';

      const savedProduct = this.productRepository.save(product);

      await this.cacheManager.del(`product:${id}`);
      return savedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing product , Error:${error}`,
      );
    }
  }
}
