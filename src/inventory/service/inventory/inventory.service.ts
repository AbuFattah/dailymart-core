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

  async addInventory(productId: string, quantity: number) {
    try {
      console.log(productId);
      // return { success: true };

      // const product = await this.productService.getProductById(productId);

      // const inventory = await this.inventoryRepository.findOne({
      //   where: { product: { id: productId } },
      //   relations: ['product'],
      // });

      // if (!inventory.product) {
      //   throw new NotFoundException(
      //     `Product with ID ${productId} does not exist.`,
      //   );
      // }

      let inventory = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.product', 'product')
        .where('inventory.product_id = :productId', { productId })
        .addSelect('product.name') // only load the product's name
        .getOne();

      // if (!inventory || !inventory.product) {
      //   throw new NotFoundException(
      //     `Product with ID ${productId} does not exist.`,
      //   );
      // }

      // inventory ? this.inventoryRepository.save({...inventory,qty: inventory.qty + quantity}) : this.inventoryRepository.save({})

      if (inventory) {
        await this.inventoryRepository.save({
          ...inventory,
          qty: inventory.qty + quantity,
        });
      } else {
        const product = await this.productService.getProductById(productId);

        // console.log(product);
        if (!product) {
          throw new NotFoundException('invalid product id');
        }

        inventory = this.inventoryRepository.create({
          product: { id: productId },
          qty: quantity,
        });

        // console.log(inventory);

        await this.inventoryRepository.save(inventory);
      }

      const lastQuantity = inventory.qty || 0;

      // Use bullmq
      this.stockQueue.add('stock-history-action', {
        productId,
        quantity,
        actionType: 'increase',
        lastQuantity,
      });

      return {
        id: inventory.id,
        qty: inventory.qty + quantity,
        productId: productId,
        productName: inventory.product.name,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('error adding inventory', error);
      throw new InternalServerErrorException('error adding inventory');
    }
  }

  // async addInventory(productId: number, quantity: number): Promise<Inventory> {
  //   if (!productId || !quantity || quantity <= 0) {
  //     throw new BadRequestException('Invalid input parameters');
  //   }

  //   try {
  //     // Run product validation and inventory check in parallel
  //     const [inventory, product] = await Promise.all([
  //       this.inventoryRepository.findOne({
  //         where: { product: { id: productId } },
  //       }),
  //       this.productRepository.findOne({
  //         where: { id: productId },
  //       }),
  //     ]);

  //     if (!product) {
  //       throw new NotFoundException(
  //         `Product with ID ${productId} does not exist.`,
  //       );
  //     }

  //     const lastQuantity = inventory?.qty ?? 0;

  //     const [updatedInventory] = await Promise.all([
  //       inventory
  //         ? this.inventoryRepository.save({
  //             ...inventory,
  //             qty: inventory.qty + quantity,
  //           })
  //         : this.inventoryRepository.save({
  //             product: { id: productId },
  //             qty: quantity,
  //           }),

  //       this.stockQueue
  //         .add(
  //           'stock-history-action',
  //           {
  //             productId,
  //             quantity,
  //             actionType: 'increase',
  //             lastQuantity,
  //           },
  //           {
  //             removeOnComplete: true,
  //             attempts: 3,
  //           },
  //         )
  //         .catch((err) => {
  //           console.error('Failed to queue stock history:', err);
  //           return null;
  //         }),
  //     ]);

  //     return updatedInventory;
  //   } catch (error) {
  //     console.error('Error adding inventory:', error);

  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }

  //     throw new InternalServerErrorException('Failed to update inventory');
  //   }
  // }

  async removeInventory(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    try {
      // const product = await this.productService.getProductById(productId);
      // if (!product) {
      //   throw new NotFoundException(
      //     `Product with ID ${productId} does not exist.`,
      //   );
      // }
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
      this.stockQueue.add('stock-history-action', {
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

  async getInventoryByProductId(productId: string): Promise<Inventory> {
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
    productId: string,
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

  async isInStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
    });
    return inventory && inventory.qty >= quantity;
  }

  async clearInventory(productId: string): Promise<Inventory> {
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
