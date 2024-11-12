import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { UpdateLineItemCostDto } from 'src/order/dtos/UpdateLIneItemCosts.dto';
import { LineItem } from 'src/order/typeorm/entities/LineItem.entity';
import { Order } from 'src/order/typeorm/entities/Order.entity';
import { Return } from 'src/order/typeorm/entities/Return.entity';
import { CreateReturnDto } from 'src/users/dtos/CreateReturn.dto';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    @InjectRepository(Return) private returnRepository: Repository<Return>,
    private productService: ProductsService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const lineItemsData = await Promise.all(
      createOrderDto.lineItems.map(async (lineItem) => {
        const product = await this.productService.getProductById(
          lineItem.productId,
        );

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

    const subtotal: number = lineItemsData.reduce(
      (sum, item) => sum + item.lineAmt,
      0,
    );

    const discount: number = +createOrderDto.discount || 0;
    const tax: number = +createOrderDto.tax || 0;

    const grandtotal: number = subtotal - discount + tax;
    const adjustedTotalAmount = grandtotal;

    // console.log(lineItemsData);

    const order = this.orderRepository.create({
      user: { id: userId },
      ...createOrderDto,
      paymentMethod: createOrderDto.paymentMethod,
      status: 'placed',
      subtotal,
      grandtotal,
      adjustedTotalAmount,
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
    return this.orderRepository.findOne({
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

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const hasZeroCostLineItem = order.lineItems.some(
      (lineItem) => lineItem.cost === 0,
    );

    if (hasZeroCostLineItem) {
      throw new BadRequestException(
        'Cannot update order status as one or more line items have a cost of zero.',
      );
    }

    order.status = newStatus;
    await this.orderRepository.save(order);

    return order;
  }

  async createReturn(createReturnDto: CreateReturnDto) {
    const queryRunner =
      this.lineItemRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const order = await this.getOrderById(createReturnDto.orderId);

      const returns = await this.processReturns(
        createReturnDto.lineItems,
        order,
        queryRunner,
      );

      await this.updateOrderForReturn(order, returns);

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async getLineItem(lineItemId: number): Promise<LineItem> {
    const lineItem = await this.lineItemRepository.findOne({
      where: { id: lineItemId },
    });
    if (!lineItem) {
      throw new NotFoundException(`Line item with ID ${lineItemId} not found`);
    }
    return lineItem;
  }

  private async processReturns(
    lineItems,
    order,
    queryRunner,
  ): Promise<Return[]> {
    return Promise.all(
      lineItems.map(async ({ lineItemId, returnQty, returnReason }) => {
        const lineItem = await this.getLineItem(lineItemId);
        const refundAmount = +returnQty * +lineItem.price;

        await this.updateLineItemForReturn(
          lineItem,
          returnQty,
          refundAmount,
          queryRunner,
        );

        const returnEntity = this.returnRepository.create({
          order,
          lineItem,
          returnQty,
          returnReason,
          refundAmount,
          returnStatus: lineItem.returnStatus,
        });

        return await queryRunner.manager.save(returnEntity);
      }),
    );
  }

  private async updateLineItemForReturn(
    lineItem: LineItem,
    returnQty: number,
    refundAmount: number,
    queryRunner,
  ) {
    lineItem.returnQty = +lineItem.returnQty + +returnQty;
    lineItem.refundAmount = +lineItem.refundAmount + +refundAmount;
    lineItem.returnStatus =
      lineItem.returnQty === +lineItem.qty ? 'Returned' : 'Partially Returned';

    await queryRunner.manager.save(lineItem);
  }

  private async updateOrderForReturn(order: Order, returns: Return[]) {
    order.totalReturnedQty += returns.reduce((sum, r) => sum + +r.returnQty, 0);
    order.returnStatus =
      order.totalReturnedQty ===
      order.lineItems.reduce((sum, li) => sum + +li.qty, 0)
        ? 'Fully Returned'
        : 'Partially Returned';
    order.adjustedTotalAmount =
      +order.grandtotal - returns.reduce((sum, r) => sum + +r.refundAmount, 0);

    await this.lineItemRepository.manager.save(order);
  }
}
