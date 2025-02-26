import { Cart, CartLineInput, CartResponse } from "../types/cart";
import { CartClientOptions } from "../types/config";

export abstract class BaseCartClient {
  protected options: CartClientOptions;

  constructor(options: CartClientOptions) {
    this.options = options;
  }

  //   abstract createCart(): Promise<CartResponse>;

  abstract fetchStorefront(
    query: string,
    variables: any
  ): Promise<CartResponse>;
  abstract getCart(cartId: string): Promise<CartResponse>;
  abstract addToCart(
    cartId: string,
    lines: CartLineInput[]
  ): Promise<CartResponse>;
  abstract updateCartItem(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<CartResponse>;
  abstract removeFromCart(
    cartId: string,
    lineIds: string[]
  ): Promise<CartResponse>;
}
