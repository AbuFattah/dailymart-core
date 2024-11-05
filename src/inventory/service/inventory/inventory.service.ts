import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { Inventory } from 'src/inventory/typeorm/entities/Inventory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async addInventory(productId: number, quantity: number) {
    try {
      const product = await this.productService.getProductById(productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productId} does not exist.`,
        );
      }

      const inventory = await this.inventoryRepository.findOne({
        where: { product: { id: productId } },
      });

      if (inventory) {
        inventory.qty += quantity;
        return this.inventoryRepository.save(inventory);
      }

      const newInventory = this.inventoryRepository.create({
        product: { id: productId },
        qty: quantity,
      });

      return this.inventoryRepository.save(newInventory);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('error adding inventory', error);
      throw new InternalServerErrorException('error adding inventory');
    }
  }

  async removeInventory(
    productId: number,
    quantity: number,
  ): Promise<Inventory> {
    try {
      const product = await this.productService.getProductById(productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productId} does not exist.`,
        );
      }
      const inventory = await this.inventoryRepository.findOne({
        where: { product: { id: productId } },
      });
      if (!inventory) {
        throw new NotFoundException(
          `Inventory not found for product ID: ${productId}`,
        );
      }

      if (inventory.qty < quantity) {
        throw new BadRequestException(
          `Not enough stock for product ID: ${productId}`,
        );
      }

      inventory.qty -= quantity; // Decrease quantity
      return this.inventoryRepository.save(inventory);
    } catch (error) {
      if (error instanceof NotFoundException || BadRequestException)
        throw error;

      throw new InternalServerErrorException('Error removing inventory');
    }
  }

  async getInventoryByProductId(productId: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!inventory) {
      throw new NotFoundException(
        `Inventory not found for product ID: ${productId}`,
      );
    }
    return inventory;
  }

  async getAllInventories(): Promise<Inventory[]> {
    return this.inventoryRepository.find();
  }

  async updateInventory(
    productId: number,
    newQuantity: number,
  ): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!inventory) {
      throw new NotFoundException(
        `Inventory not found for product ID: ${productId}`,
      );
    }

    inventory.qty = newQuantity;
    return this.inventoryRepository.save(inventory);
  }

  async isInStock(productId: number, quantity: number): Promise<boolean> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
    });
    return inventory && inventory.qty >= quantity;
  }

  async clearInventory(productId: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
    });
    if (!inventory) {
      throw new NotFoundException(
        `Inventory not found for product ID: ${productId}`,
      );
    }

    inventory.qty = 0;
    return this.inventoryRepository.save(inventory);
  }
}
