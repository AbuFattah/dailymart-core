import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AddToCartDto } from 'src/cart/dtos/AddToCart.dto';
import { UpdateCartDto } from 'src/cart/dtos/UpdateCart.dto';
import { CartService } from 'src/cart/service/cart/cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Query('tempCartId') tempCartId: string,
    @Req() req,
  ) {
    const userId = req.user?.id;
    return this.cartService.addToCart(tempCartId, addToCartDto, userId);
  }

  @Get()
  getCart(@Query('tempCartId') tempCartId: string, @Req() req) {
    const userId = req.user?.id;
    return this.cartService.findOrCreateCart(tempCartId, userId);
  }

  @Post('merge')
  mergeCarts(@Query('tempCartId') tempCartId: string, @Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.cartService.mergeCarts(tempCartId, userId);
  }

  @Post('update')
  updateCartItem(
    @Body() updateCartDto: UpdateCartDto,
    @Query('tempCartId') tempCartId: string,
    @Req() req,
  ) {
    const userId = req.user?.id; // Extract user ID if logged in
    return this.cartService.updateCartItem(
      updateCartDto.cartItemId,
      updateCartDto.qty,
    );
  }
}
