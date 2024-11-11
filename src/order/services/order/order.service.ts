import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { UpdateLineItemCostDto } from 'src/order/dtos/UpdateLIneItemCosts.dto';
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
        const cost = +product.cost || 0;
        const lineAmt = +lineItem.price * +lineItem.qty;

        const lineitem = this.lineItemRepository.create({
          product,
          name: product.name,
          size: product.size,
          qty: +lineItem.qty,
          price: +lineItem.price,
          lineAmt,
          cost,
        });
        await this.lineItemRepository.save(lineitem);

        return lineitem;
      }),
    );

    // await Promise.all(
    //   lineItemsData.map(async (lineItem) => {
    //     await this.lineItemRepository.save(lineItem);
    //   }),
    // );

    const subtotal: number = lineItemsData.reduce(
      (sum, item) => sum + item.lineAmt,
      0,
    );

    const discount: number = +createOrderDto.discount || 0;
    const tax: number = +createOrderDto.tax || 0;

    const grandtotal: number = subtotal - discount + tax;

    // console.log(lineItemsData);

    const order = this.orderRepository.create({
      user: { id: userId },
      ...createOrderDto,
      status: 'placed',
      subtotal,
      grandtotal,
      lineItems: lineItemsData,
    });

    return this.orderRepository.save(order);
  }

  async getAllOrders(page: number = 1, limit: number = 10) {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      orders,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(orderId: string) {
    return this.orderRepository.find({
      where: { id: orderId },
      relations: ['lineItems'],
    });
  }

  async getOrdersByUserId(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['lineItems'],
    });
  }

  async updateLineItemCosts(
    updateLineItemsDto: UpdateLineItemCostDto,
  ): Promise<LineItem[]> {
    const { lineItems } = updateLineItemsDto;

    return await this.lineItemRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const updatePromises = lineItems.map(async ({ lineItemId, cost }) => {
          const lineItem = await transactionalEntityManager.findOne(LineItem, {
            where: { id: lineItemId },
          });

          if (!lineItem) {
            throw new NotFoundException(
              `Line item with ID ${lineItemId} not found.`,
            );
          }

          lineItem.cost = +cost;
          lineItem.qty = +lineItem.qty;
          lineItem.lineAmt = lineItem.qty * lineItem.price;

          return transactionalEntityManager.save(lineItem);
        });

        return Promise.all(updatePromises);
      },
    );
  }

  async updateOrderStatus(orderId: string) {}
}
