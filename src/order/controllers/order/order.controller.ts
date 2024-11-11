import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  Get,
  Query,
  ParseIntPipe,
  Optional,
  Param,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { Roles } from 'src/auth/utils/roles.decorator';
import { RolesGuard } from 'src/auth/utils/roles.guard';
// import { Roles } from 'src/auth/utils/roles.decorator';
// import { RolesGuard } from 'src/auth/utils/roles.guard';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { UpdateLineItemCostDto } from 'src/order/dtos/UpdateLIneItemCosts.dto';
import { OrderService } from 'src/order/services/order/order.service';
import { LineItem } from 'src/order/typeorm/entities/LineItem.entity';
import { Order } from 'src/order/typeorm/entities/Order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ): Promise<Order> {
    const user: any = req.user;
    // console.log(user);
    const userId = (user && user.id) || null;
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  async getOrders(
    @Query('page') @Optional() page: number = 1,
    @Query('limit') @Optional() limit: number = 10,
  ) {
    return this.orderService.getAllOrders(page || 1, limit || 10);
  }
  // @Param('categoryId') categoryId: string
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Get('user/:id')
  async getOrdersByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrdersByUserId(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('lineitemCosts')
  async updateLineItemCosts(
    @Body() updateLineItemCostDto: UpdateLineItemCostDto,
  ): Promise<LineItem[]> {
    return await this.orderService.updateLineItemCosts(updateLineItemCostDto);
  }
}
