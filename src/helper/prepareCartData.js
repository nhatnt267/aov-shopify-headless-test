import { extractIdFromGid } from "./extractIdFromGid";

export const prepareCartData = (cart) => {
  return {
    note: cart.note || "",
    attributes: cart.attributes?.reduce((acc, attr) => {
      acc[attr.key] = attr.value;
      return acc;
    }, {}),
    original_total_price: parseFloat(cart.estimatedCost.subtotalAmount.amount),
    total_price: parseFloat(cart.estimatedCost.totalAmount.amount),
    total_discount:
      parseFloat(cart.estimatedCost.subtotalAmount.amount) -
      parseFloat(cart.estimatedCost.totalAmount.amount),
    item_count: cart.lines.edges.reduce(
      (sum, edge) => sum + edge.node.quantity,
      0
    ),
    items: prepareCartItem(cart.lines),
    currency:
      cart.lines.edges[0]?.node.estimatedCost.subtotalAmount.currencyCode ||
      "USD",
    items_subtotal_price: parseFloat(cart.estimatedCost.subtotalAmount.amount),
    cart_level_discount_applications: cart.discountCodes.map((code) => ({
      title: code.code,
    })),
  };
};

const prepareCartItem = (cartLines) => {
  if (!cartLines || !Array.isArray(cartLines.edges)) return [];
  return cartLines.edges.map((line) => {
    const merchandise = line.node.merchandise;
    const product = merchandise.product;
    const price = line.node.estimatedCost.subtotalAmount.amount;
    const attributes = (line.node.attributes || []).reduce((acc, attr) => {
      acc[attr.key] = attr.value;
      return acc;
    }, {});
    const extractedId = extractIdFromGid(merchandise.id);
    return {
      lineId: line.node.id,
      id: extractedId,
      properties: attributes,
      quantity: line.node.quantity,
      variant_id: extractedId,
      // key: `${merchandise.id}:${attributes["_aovCampId"] || ""}`,
      key: line.node.id,
      title: merchandise.title,
      price,
      original_price: price,
      discounted_price: price,
      line_price: price * line.node.quantity,
      original_line_price: price * line.node.quantity,
      total_discount: 0,
      discounts: [],
      sku: merchandise.sku || product.variants.edges[0]?.node.sku,
      product_id: extractIdFromGid(product.id),
      product_has_only_default_variant: product.variants.edges.length === 1,
      final_price: price,
      final_line_price: price * line.node.quantity,
      url: `/products/${product.handle}?variant=${extractedId}`,
      handle: product.handle,
      product_type: product.productType,
      product_title: product.title,
      variant_title: merchandise.title || null,
    };
  });
};

export const prepareAddToCart = (product) => {
  const attributes = Object.keys(product.properties || {}).map((key) => {
    return {
      key: key,
      value: product.properties[key],
    };
  });

  return {
    quantity: parseInt(product.quantity),
    merchandiseId: `gid://shopify/ProductVariant/${product.id}`,
    attributes: attributes,
  };
};

export const prepareUpdateCartItems = (data) => {
  return Object.keys(data).map((key) => {
    return {
      id: key,
      quantity: data[key],
    };
  });
};

export const prepareChangeCartItem = (data) => {
  return [
    {
      id: data.id,
      attributes: Object.keys(data.properties || {}).map((key) => {
        return {
          key: key,
          value: data.properties[key],
        };
      }),
      quantity: data.quantity,
    },
  ];
};
