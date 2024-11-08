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
import { ProductWithInventoryDto } from 'src/inventory/dtos/ProductWithInventoryDto';
import { Inventory } from 'src/inventory/typeorm/entities/Inventory.entity';
import { Repository } from 'typeorm';
import {
  ActionType,
  StockHistoryService,
} from '../stock-history/stock-history.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class InventoryService {
  constructor(
    private readonly productService: ProductsService,
    private readonly stockHistoryService: StockHistoryService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectQueue('stock-queue') private stockQueue: Queue,
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
        const lastQuantity = inventory.qty;
        inventory.qty += quantity;

        // Use bullmq

        await this.stockQueue.add('stock-history-action', {
          productId,
          quantity,
          actionType: 'increase',
          lastQuantity,
        });

        // await this.stockHistoryService.createStockHistoryAction(
        //   'increase',
        //   productId,
        //   quantity,
        //   lastQuantity,
        // );
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

      const lastQuantity = inventory.qty;
      inventory.qty -= quantity;
      // Use bullmq
      await this.stockQueue.add('stock-history-action', {
        productId,
        quantity,
        actionType: 'decrease',
        lastQuantity,
      });
      // await this.stockHistoryService.createStockHistoryAction(
      //   'decrease',
      //   productId,
      //   quantity,
      //   lastQuantity,
      // );
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

  async getAllInventories(): Promise<ProductWithInventoryDto[]> {
    const productWithInventoryQty = await this.productRepository
      .createQueryBuilder('products')
      .leftJoin('products.inventory', 'inventory')
      // .where('products.id = :productId', { productId })
      .andWhere('products.status = :status', { status: 'active' })
      .select([
        'products.id',
        'products.name',
        'products.brand',
        'inventory.qty',
      ])
      .getMany();

    if (!productWithInventoryQty) {
      throw new NotFoundException(`Error fetching inventory`);
    }

    const data: ProductWithInventoryDto[] = productWithInventoryQty.map((x) => {
      return {
        product_id: x.id,
        name: x.name,
        qty: x?.inventory?.qty || 0,
        brand: x.brand,
      };
    });

    return data;
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

    const lastQuantity = inventory.qty;
    inventory.qty = 0;
    // Use bullmq

    await this.stockQueue.add('stock-history-action', {
      productId,
      quantity: 0,
      actionType: 'clear',
      lastQuantity,
    });
    // await this.stockHistoryService.createStockHistoryAction(
    //   'clear',
    //   productId,
    //   0,
    //   lastQuantity,
    // );

    return this.inventoryRepository.save(inventory);
  }
}
