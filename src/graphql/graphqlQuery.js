export const getCartQuery = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      discountCodes {
        code
      }
      note
      attributes {
        key
        value
      }
      estimatedCost {
        subtotalAmount {
          amount
        }
        totalAmount {
          amount
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            attributes {
              key
              value
            }
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  handle
                  productType
                  title
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        title
                        sku
                      }
                    }
                  }
                }
                sku
              }
            }
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const addToCartMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const updateCartItemMutation = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      userErrors {
        field
        message
      }
    }
  }
`;

export const removeFromCartMutation = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      userErrors {
        field
        message
      }
    }
  }
`;
