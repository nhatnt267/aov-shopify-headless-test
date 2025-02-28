export class BaseCartClient {
  constructor(options) {
    this.options = options;
  }

  async fetchStorefront(query, variables) {
    throw new Error("Not implemented");
  }

  async getCart() {
    throw new Error("Not implemented");
  }

  async addToCart(data) {
    throw new Error("Not implemented");
  }

  async changeLineItem(data) {
    throw new Error("Not implemented");
  }

  async updateCartItemsForLineId(data) {
    throw new Error("Not implemented");
  }

  async removeFromCart(data) {
    throw new Error("Not implemented");
  }
}
