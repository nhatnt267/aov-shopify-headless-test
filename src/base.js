export class BaseCartClient {
  constructor(options) {
    this.options = options;
  }

  async fetchStorefront(query, variables) {
    throw new Error("Not implemented");
  }

  async getCart(cartId) {
    throw new Error("Not implemented");
  }

  async addToCart(cartId, lines) {
    throw new Error("Not implemented");
  }

  async updateCartItem(cartId, lines) {
    throw new Error("Not implemented");
  }

  async removeFromCart(cartId, lineIds) {
    throw new Error("Not implemented");
  }
}
