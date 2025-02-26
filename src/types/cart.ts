export interface Money {
  amount: string;
  currencyCode: string;
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: {
      title: string;
      images: {
        edges: {
          node: {
            url: string;
          };
        }[];
      };
    };
  };
}

export interface Cart {
  id: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
}

export interface CartResponse {
  cart: Cart;
  userErrors?: {
    field: string;
    message: string;
  }[];
}
