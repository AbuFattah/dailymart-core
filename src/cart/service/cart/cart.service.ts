import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from 'src/cart/dtos/AddToCart.dto';
import { Cart } from 'src/cart/typeorm/entities/Cart.entity';
import { CartItem } from 'src/cart/typeorm/entities/CartItem.entity';
import { ProductsService } from 'src/catalog/services/products/products.service';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductsService,
  ) {}

  async findOrCreateCart(tempCartId: string, userId?: number): Promise<Cart> {
    let cart: Cart;

    if (userId) {
      cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['cartItems'],
      });
    } else {
      cart = await this.cartRepository.findOne({
        where: { tempCartId },
        relations: ['cartItems'],
      });
    }

    if (!cart) {
      cart = this.cartRepository.create({
        tempCartId,
        user: userId ? { id: userId } : null,
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(
    tempCartId: string,
    addToCartDto: AddToCartDto,
    userId?: number,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(tempCartId, userId);

    const product = await this.productService.getProductById(
      addToCartDto.productId,
    );
    const existingItem = await this.cartItemRepository.findOne({
      where: { cart, product },
    });

    if (existingItem) {
      existingItem.qty += addToCartDto.qty;
      existingItem.lineAmt = existingItem.qty * product.price;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cart,
        product,
        qty: addToCartDto.qty,
        price: product.price,
        lineAmt: addToCartDto.qty * product.price,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.updateCartTotals(cart);
  }

  async updateCartTotals(cart: Cart): Promise<Cart> {
    const cartItems = await this.cartItemRepository.find({ where: { cart } });
    const subtotal = cartItems.reduce((sum, item) => sum + item.lineAmt, 0);
    const discount = 0; // Implement discount logic if needed
    const grandTotal = subtotal - discount;

    cart.subtotal = subtotal;
    cart.discount = discount;
    cart.grandTotal = grandTotal;

    return this.cartRepository.save(cart);
  }

  async mergeCarts(tempCartId: string, userId: number): Promise<Cart> {
    const tempCart = await this.cartRepository.findOne({
      where: { tempCartId },
      relations: ['cartItems'],
    });
    const userCart = await this.findOrCreateCart(null, userId);

    if (tempCart) {
      for (const tempItem of tempCart.cartItems) {
        const existingItem = await this.cartItemRepository.findOne({
          where: { cart: userCart, product: tempItem.product },
        });
        if (existingItem) {
          existingItem.qty += tempItem.qty;
          existingItem.lineAmt = existingItem.qty * tempItem.price;
          await this.cartItemRepository.save(existingItem);
        } else {
          tempItem.cart = userCart;
          await this.cartItemRepository.save(tempItem);
        }
      }
      await this.cartRepository.remove(tempCart);
    }

    return this.updateCartTotals(userCart);
  }

  async updateCartItem(cartItemId: number, qty: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new NotFoundException('CartItem not found');
    }

    const cart = cartItem.cart;

    if (qty === 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      cartItem.qty = qty;
      cartItem.lineAmt = qty * cartItem.price;
      await this.cartItemRepository.save(cartItem);
    }

    // Update cart totals and return the updated cart
    return this.updateCartTotals(cart);
  }
}
