import { BaseCartClient } from "./base";
import { CartConfig, CartClientOptions } from "../types/config";
import { CartLineInput, CartResponse } from "../types/cart";

export class ShopifyCartClient extends BaseCartClient {
  private config: CartConfig;

  constructor(options: CartClientOptions) {
    super(options);
    this.config = {
      apiVersion: "2024-01",
      ...options.config,
    };
  }

  async fetchStorefront(query: string, variables: any) {
    const storefrontAccessToken = this.config.accessToken;
    const shopifyDomain = this.config.storeDomain;

    if (!storefrontAccessToken || !shopifyDomain) {
      throw new Error("Missing Shopify configuration");
    }

    try {
      const response = await fetch(
        `https://${shopifyDomain}/api/${this.config.apiVersion}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
          },
          body: JSON.stringify({ query, variables }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Shopify API Error:", error);
      throw error;
    }
  }

  async getCart(cartId: string): Promise<CartResponse> {
    const graphqlQuery = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    `;
    const response = await this.fetchStorefront(graphqlQuery, { cartId });
    return response.data.cart;
  }

  async addToCart(
    cartId: string,
    lines: CartLineInput[]
  ): Promise<CartResponse> {
    const graphqlQuery = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                      }
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const response = await this.fetchStorefront(graphqlQuery, {
      cartId,
      lines: [
        { merchandiseId: lines[0].merchandiseId, quantity: lines[0].quantity },
      ],
    });
    const data = await response.json();
    return data.data.cartLinesAdd;
  }

  async updateCartItem(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<CartResponse> {
    const graphqlQuery = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                      }
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const response = await this.fetchStorefront(graphqlQuery, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });
    const data = await response.json();
    return data.data.cartLinesUpdate;
  }

  async removeFromCart(
    cartId: string,
    lineIds: string[]
  ): Promise<CartResponse> {
    const graphqlQuery = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            totalQuantity
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                      }
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const response = await this.fetchStorefront(graphqlQuery, {
      cartId,
      lineIds,
    });
    const data = await response.json();
    return data.data.cartLinesRemove;
  }
}
