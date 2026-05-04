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

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:3000" : "");

export async function getProducts() {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/api/products`);
  return response.data;
}

export async function getCartItems(options?: { expandProduct?: boolean }) {
  const response = await axios.get<CartItem[] | ExpandedCartItem[]>(
    `${API_BASE_URL}/api/cart-items`,
    {
      params: options?.expandProduct ? { expand: "product" } : undefined,
    },
  );
  return response.data;
}

export async function addCartItem(productId: string, quantity: number) {
  const response = await axios.post<CartItem>(`${API_BASE_URL}/api/cart-items`, {
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
    `${API_BASE_URL}/api/cart-items/${productId}`,
    updates,
  );
  return response.data;
}

export async function deleteCartItem(productId: string) {
  await axios.delete(`${API_BASE_URL}/api/cart-items/${productId}`);
}

export async function getDeliveryOptions(options?: {
  expandEstimatedDeliveryTime?: boolean;
}) {
  const response = await axios.get<
    DeliveryOption[] | DeliveryOptionWithEstimate[]
  >(`${API_BASE_URL}/api/delivery-options`, {
    params: options?.expandEstimatedDeliveryTime
      ? { expand: "estimatedDeliveryTime" }
      : undefined,
  });
  return response.data;
}

export async function getPaymentSummary() {
  const response = await axios.get<PaymentSummary>(
    `${API_BASE_URL}/api/payment-summary`,
  );
  return response.data;
}

export async function getOrders(options?: { expandProducts?: boolean }) {
  const response = await axios.get<Order[] | ExpandedOrder[]>(
    `${API_BASE_URL}/api/orders`,
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
    `${API_BASE_URL}/api/orders/${orderId}`,
    {
      params: options?.expandProducts ? { expand: "products" } : undefined,
    },
  );
  return response.data;
}
