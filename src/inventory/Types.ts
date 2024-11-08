import { Product } from 'src/catalog/typeorm/entities/Product.entity';
import { StockHistory } from './typeorm/entities/StockHistory.entity';

export class CreateStockHistoryParams {
  product: Product;
  actionType: 'increase' | 'decrease' | 'clear';
  lastQuantity: number;
  quantityChanged: number;
  currentQuantity: number;
}

export class UpdateStockHistoryParams {
  actionType?: 'increase' | 'decrease' | 'clear';
  lastQuantity?: number;
  quantityChanged?: number;
  currentQuantity?: number;
}

export class StockHistoryResponse {
  id: number;
  product: Product;
  actionType: string;
  lastQuantity: number;
  quantityChanged?: number;
  currentQuantity: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(stockHistory: StockHistory) {
    this.id = stockHistory.id;
    this.product = stockHistory.product;
    this.actionType = stockHistory.actionType;
    this.lastQuantity = stockHistory.lastQuantity;
    this.currentQuantity = stockHistory.currentQuantity;
    this.createdAt = stockHistory.createdAt;
    this.updatedAt = stockHistory.updatedAt;
  }
}
