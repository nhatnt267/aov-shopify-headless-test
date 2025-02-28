import { BaseCartClient } from "./base";
import { emptyCartData } from "./const/cartData";
import {
  getCartQuery,
  addToCartMutation,
  updateCartItemMutation,
  removeFromCartMutation,
} from "./graphql/graphqlQuery";
import { extractIdFromGid } from "./helper/extractIdFromGid";
import {
  prepareAddToCart,
  prepareCartData,
  prepareUpdateCartItems,
  prepareChangeCartItem,
} from "./helper/prepareCartData";

export class ShopifyCartClient extends BaseCartClient {
  constructor(options) {
    super(options);
    this.config = {
      apiVersion: "2025-01",
      ...options.config,
    };
  }

  async fetchStorefront(query, variables) {
    const storefrontAccessToken = this.config.accessToken;
    const shopifyDomain = this.config.storeDomain;
    const cartId = this.config.cartId;
    if (!storefrontAccessToken || !shopifyDomain || !cartId) {
      throw new Error("Missing Shopify configuration");
    }

    const response = await fetch(
      `https://${shopifyDomain}/api/${this.config.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables: { ...variables, cartId } }),
      }
    );

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }

  async getCart() {
    try {
      if (!this.config.cartId) {
        console.error(
          "AOV shopify headless error fetching cart",
          "Cart ID is required"
        );
        return emptyCartData;
      }
      const graphqlQuery = getCartQuery;
      const response = await this.fetchStorefront(graphqlQuery);
      return {
        token: extractIdFromGid(this.config.cartId),
        ...prepareCartData(response.cart),
      };
    } catch (error) {
      console.error("AOV shopify headless error fetching cart", error);
      return emptyCartData;
    }
  }

  async addToCart(lines) {
    try {
      if (!lines) {
        throw new Error("Lines are required");
      }

      const graphqlQuery = addToCartMutation;
      console.log(
        "🚀 ~ ShopifyCartClient ~ addToCart ~ lines.map(prepareAddToCart),:",
        JSON.stringify(lines.map(prepareAddToCart))
      );
      await this.fetchStorefront(graphqlQuery, {
        lines: lines.map(prepareAddToCart),
      });
      return { success: true };
    } catch (error) {
      console.error("AOV shopify headless error adding to cart", error);
      throw error;
    }
  }

  async updateCartItemsForLineId(data) {
    try {
      if (!data) {
        throw new Error("Data are required");
      }
      const graphqlQuery = updateCartItemMutation;
      await this.fetchStorefront(graphqlQuery, {
        lines: prepareUpdateCartItems(data),
      });
      return { success: true };
    } catch (error) {
      console.error("AOV shopify headless error updating cart item", error);
      throw error;
    }
  }

  async removeFromCart(lineIds) {
    try {
      if (!lineIds) {
        throw new Error("Line IDs are required");
      }
      const graphqlQuery = removeFromCartMutation;
      await this.fetchStorefront(graphqlQuery, {
        lineIds,
      });
      return { success: true };
    } catch (error) {
      console.error("AOV shopify headless error removing from cart", error);
      throw error;
    }
  }

  async changeCartItem(data) {
    try {
      if (!data) {
        throw new Error("Data are required");
      }
      const graphqlQuery = updateCartItemMutation;
      await this.fetchStorefront(graphqlQuery, {
        lines: prepareChangeCartItem(data),
      });
      return { success: true };
    } catch (error) {
      console.error("AOV shopify headless error changing cart item", error);
      throw error;
    }
  }
}
