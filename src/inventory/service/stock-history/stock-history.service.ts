import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { CreateStockHistoryDto } from 'src/inventory/dtos/CreateStockHistoryDto';
import { UpdateStockHistoryDto } from 'src/inventory/dtos/UpdateStockHistoryDto';
import { StockHistory } from 'src/inventory/typeorm/entities/StockHistory.entity';
import {
  CreateStockHistoryParams,
  StockHistoryResponse,
  UpdateStockHistoryParams,
} from 'src/inventory/Types';
import { Repository } from 'typeorm';

export enum ActionType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  CLEAR = 'clear',
}

@Injectable()
export class StockHistoryService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create stock history
  async create(
    createStockHistoryDetails: CreateStockHistoryParams,
  ): Promise<StockHistoryResponse> {
    const stockHistory = this.stockHistoryRepository.create(
      createStockHistoryDetails,
    );
    await this.stockHistoryRepository.save(stockHistory);
    return new StockHistoryResponse(stockHistory);
  }

  async createStockHistoryAction(
    actionType: 'increase' | 'decrease' | 'clear',
    productId: number,
    quantityChanged: number,
    lastQuantity: number,
  ): Promise<StockHistory> {
    try {
      console.log(`Inside stock history: ${productId}`);
      if (quantityChanged < 0) {
        throw new Error('Quantity changed must not be negative');
      }

      if (lastQuantity < 0) {
        throw new Error('Last quantity must not be negative');
      }

      let currentQuantity: number;

      if (actionType === ActionType.INCREASE) {
        currentQuantity = lastQuantity + quantityChanged;
      } else if (actionType === ActionType.DECREASE) {
        if (quantityChanged > lastQuantity)
          throw new Error('Cannot decrease quantity more than current stock');
        currentQuantity = lastQuantity - quantityChanged;
      } else if (actionType === ActionType.CLEAR) {
        currentQuantity = 0;
      } else {
        throw new Error('Invalid action type');
      }

      // Fetch the Product entity by its ID
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) {
        throw new Error(`Product with ID ${productId} does not exist.`);
      }
      const createStockHistoryDetails: CreateStockHistoryParams = {
        product,
        lastQuantity,
        quantityChanged,
        currentQuantity,
        actionType,
      };

      const stockHistory = this.stockHistoryRepository.create(
        createStockHistoryDetails,
      );

      return await this.stockHistoryRepository.save(stockHistory);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create stock history: ${error.message}`,
      );
    }
  }

  // Get all stock history records
  async findAll(): Promise<StockHistoryResponse[]> {
    const stockHistories = await this.stockHistoryRepository.find({
      relations: ['products'],
    });
    return stockHistories.map((history) => new StockHistoryResponse(history));
  }

  // Get stock history by ID
  async findStockHistoryById(id: number): Promise<StockHistoryResponse> {
    const stockHistory = await this.stockHistoryRepository.findOne({
      where: { id },
    });

    if (!stockHistory) {
      throw new NotFoundException(`Stock history not found for ID: ${id}`);
    }

    return new StockHistoryResponse(stockHistory);
  }

  async findStockHistoryByProductId(
    productId: number,
  ): Promise<StockHistory[]> {
    const stockHistory = await this.stockHistoryRepository.find({
      where: { product: { id: productId } },
    });

    if (!stockHistory) {
      throw new NotFoundException(
        `Stock history not found for Product ID: ${productId}`,
      );
    }

    return stockHistory;
  }

  // Update stock history record
  async updateStockHistoryById(
    id: number,
    updateStockHistoryDetails: UpdateStockHistoryParams,
  ): Promise<StockHistoryResponse> {
    const stockHistory = await this.stockHistoryRepository.findOne({
      where: { id },
    });

    if (!stockHistory) {
      throw new NotFoundException(`Stock history not found for ID: ${id}`);
    }

    const updatedStockHistory = {
      ...stockHistory,
      ...updateStockHistoryDetails,
    };

    await this.stockHistoryRepository.save(updatedStockHistory);
    return new StockHistoryResponse(updatedStockHistory);
  }

  // Delete stock history record
  async removeStockHistoryById(id: number): Promise<void> {
    const stockHistory = await this.stockHistoryRepository.findOne({
      where: { id },
    });

    if (!stockHistory) {
      throw new NotFoundException(`Stock history not found for ID: ${id}`);
    }

    await this.stockHistoryRepository.remove(stockHistory);
  }
}
