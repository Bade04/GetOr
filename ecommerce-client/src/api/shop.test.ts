import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getProducts,
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getDeliveryOptions,
  getPaymentSummary,
  getOrders,
  getOrderById,
} from "./shop";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("fetches products successfully", async () => {
      const mockProducts = [{ id: "1", name: "Product 1" }];
      mockedAxios.get.mockResolvedValue({ data: mockProducts });

      const result = await getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/products");
    });
  });

  describe("getCartItems", () => {
    it("fetches cart items without expand", async () => {
      const mockCart = [{ id: "1", productId: "p1", quantity: 1 }];
      mockedAxios.get.mockResolvedValue({ data: mockCart });

      const result = await getCartItems();
      expect(result).toEqual(mockCart);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/cart-items", { params: undefined });
    });

    it("fetches cart items with expand", async () => {
      const mockCart = [{ id: "1", productId: "p1", quantity: 1, product: {} }];
      mockedAxios.get.mockResolvedValue({ data: mockCart });

      const result = await getCartItems({ expandProduct: true });
      expect(result).toEqual(mockCart);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/cart-items", { params: { expand: "product" } });
    });
  });

  describe("addCartItem", () => {
    it("adds item to cart", async () => {
      const mockItem = { id: "1", productId: "p1", quantity: 1 };
      mockedAxios.post.mockResolvedValue({ data: mockItem });

      const result = await addCartItem("p1", 1);
      expect(result).toEqual(mockItem);
      expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/api/cart-items", { productId: "p1", quantity: 1 });
    });
  });

  describe("updateCartItem", () => {
    it("updates cart item", async () => {
      const mockItem = { id: "1", productId: "p1", quantity: 2 };
      mockedAxios.put.mockResolvedValue({ data: mockItem });

      const result = await updateCartItem("p1", { quantity: 2 });
      expect(result).toEqual(mockItem);
      expect(mockedAxios.put).toHaveBeenCalledWith("http://localhost:3000/api/cart-items/p1", { quantity: 2 });
    });
  });

  describe("deleteCartItem", () => {
    it("deletes cart item", async () => {
      mockedAxios.delete.mockResolvedValue({});

      await deleteCartItem("p1");
      expect(mockedAxios.delete).toHaveBeenCalledWith("http://localhost:3000/api/cart-items/p1");
    });
  });

  describe("getDeliveryOptions", () => {
    it("fetches delivery options", async () => {
      const mockOptions = [{ id: "1", deliveryDays: 7 }];
      mockedAxios.get.mockResolvedValue({ data: mockOptions });

      const result = await getDeliveryOptions();
      expect(result).toEqual(mockOptions);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/delivery-options", { params: undefined });
    });
  });

  describe("getPaymentSummary", () => {
    it("fetches payment summary", async () => {
      const mockSummary = { totalItems: 1, totalCostCents: 1000 };
      mockedAxios.get.mockResolvedValue({ data: mockSummary });

      const result = await getPaymentSummary();
      expect(result).toEqual(mockSummary);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/payment-summary");
    });
  });

  describe("getOrders", () => {
    it("fetches orders", async () => {
      const mockOrders = [{ id: "o1" }];
      mockedAxios.get.mockResolvedValue({ data: mockOrders });

      const result = await getOrders();
      expect(result).toEqual(mockOrders);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/orders", { params: undefined });
    });
  });

  describe("getOrderById", () => {
    it("fetches order by id", async () => {
      const mockOrder = { id: "o1" };
      mockedAxios.get.mockResolvedValue({ data: mockOrder });

      const result = await getOrderById("o1");
      expect(result).toEqual(mockOrder);
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3000/api/orders/o1", { params: undefined });
    });
  });
});