export type Product = {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  deliveryOptionId: string;
};

export type ExpandedCartItem = CartItem & {
  product: Product;
};

export type DeliveryOption = {
  id: string;
  deliveryDays: number;
  priceCents: number;
};

export type DeliveryOptionWithEstimate = DeliveryOption & {
  estimatedDeliveryTimeMs: number;
};

export type OrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
};

export type ExpandedOrderProduct = OrderProduct & {
  product: Product;
};

export type Order = {
  id: string;
  orderTimeMs: number;
  totalCostCents: number;
  products: OrderProduct[];
};

export type ExpandedOrder = Omit<Order, "products"> & {
  products: ExpandedOrderProduct[];
};

export type PaymentSummary = {
  totalItems: number;
  productCostCents: number;
  shippingCostCents: number;
  totalCostBeforeTaxCents: number;
  taxCents: number;
  totalCostCents: number;
};
