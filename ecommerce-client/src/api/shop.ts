import axios from "axios";
import type {
  CartItem,
  DeliveryOption,
  DeliveryOptionWithEstimate,
  ExpandedCartItem,
  ExpandedOrder,
  Order,
  PaymentSummary,
  Product,
} from "../types/shop";
import { apiUrl } from "../utils/asset";

export async function getProducts() {
  const response = await axios.get<Product[]>(apiUrl("/api/products"));
  return response.data;
}

export async function getCartItems(options?: { expandProduct?: boolean }) {
  const response = await axios.get<CartItem[] | ExpandedCartItem[]>(
    apiUrl("/api/cart-items"),
    {
      params: options?.expandProduct ? { expand: "product" } : undefined,
    },
  );
  return response.data;
}

export async function addCartItem(productId: string, quantity: number) {
  const response = await axios.post<CartItem>(apiUrl("/api/cart-items"), {
    productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(
  productId: string,
  updates: { quantity?: number; deliveryOptionId?: string },
) {
  const response = await axios.put<CartItem>(
    apiUrl(`/api/cart-items/${productId}`),
    updates,
  );
  return response.data;
}

export async function deleteCartItem(productId: string) {
  await axios.delete(apiUrl(`/api/cart-items/${productId}`));
}

export async function getDeliveryOptions(options?: {
  expandEstimatedDeliveryTime?: boolean;
}) {
  const response = await axios.get<
    DeliveryOption[] | DeliveryOptionWithEstimate[]
  >(apiUrl("/api/delivery-options"), {
    params: options?.expandEstimatedDeliveryTime
      ? { expand: "estimatedDeliveryTime" }
      : undefined,
  });
  return response.data;
}

export async function getPaymentSummary() {
  const response = await axios.get<PaymentSummary>(apiUrl("/api/payment-summary"));
  return response.data;
}

export async function getOrders(options?: { expandProducts?: boolean }) {
  const response = await axios.get<Order[] | ExpandedOrder[]>(
    apiUrl("/api/orders"),
    {
      params: options?.expandProducts ? { expand: "products" } : undefined,
    },
  );
  return response.data;
}

export async function getOrderById(
  orderId: string,
  options?: { expandProducts?: boolean },
) {
  const response = await axios.get<Order | ExpandedOrder>(
    apiUrl(`/api/orders/${orderId}`),
    {
      params: options?.expandProducts ? { expand: "products" } : undefined,
    },
  );
  return response.data;
}

export async function createOrder() {
  const response = await axios.post<Order>(apiUrl("/api/orders"));
  return response.data;
}
