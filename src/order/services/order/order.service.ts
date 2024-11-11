import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { LineItem } from 'src/order/typeorm/entities/LineItem.entity';
import { Order } from 'src/order/typeorm/entities/Order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    private productService: ProductsService,
  ) {}

  // Order creation service method
  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const lineItemsData = await Promise.all(
      createOrderDto.lineItems.map(async (lineItem) => {
        const product = await this.productService.getProductById(
          lineItem.productId,
        );

        // Set cost from Product table or default to null
        const cost = product.cost ?? null;
        const lineAmt = lineItem.price * lineItem.qty;

        return this.lineItemRepository.create({
          product,
          qty: lineItem.qty,
          price: lineItem.price,
          lineAmt,
          cost,
        });
      }),
    );

    const order = this.orderRepository.create({
      user: { id: userId },
      ...createOrderDto,
      lineItems: lineItemsData,
    });

    return this.orderRepository.save(order);
  }
}
