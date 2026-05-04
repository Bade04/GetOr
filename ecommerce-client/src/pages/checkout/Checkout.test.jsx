import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Checkout } from "./Checkout";

vi.mock("../../api/shop", () => ({
  deleteCartItem: vi.fn(),
  getCartItems: vi.fn(),
  getDeliveryOptions: vi.fn(),
  getPaymentSummary: vi.fn(),
  updateCartItem: vi.fn(),
}));

import {
  deleteCartItem,
  getCartItems,
  getDeliveryOptions,
  getPaymentSummary,
  updateCartItem,
} from "../../api/shop";

const product = {
  id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  image: "images/products/athletic-cotton-socks-6-pairs.jpg",
  name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
  rating: {
    stars: 4.5,
    count: 87,
  },
  priceCents: 1090,
};

const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
    estimatedDeliveryTimeMs: new Date("2026-05-01T00:00:00Z").getTime(),
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
    estimatedDeliveryTimeMs: new Date("2026-04-29T00:00:00Z").getTime(),
  },
];

describe("Checkout", () => {
  let cartItems;
  let paymentSummary;
  let refreshCartItems;

  beforeEach(() => {
    vi.clearAllMocks();

    cartItems = [
      {
        id: "cart-1",
        productId: product.id,
        quantity: 1,
        deliveryOptionId: "1",
        product,
      },
    ];

    paymentSummary = {
      totalItems: 1,
      productCostCents: 1090,
      shippingCostCents: 0,
      totalCostBeforeTaxCents: 1090,
      taxCents: 109,
      totalCostCents: 1199,
    };

    refreshCartItems = vi.fn().mockResolvedValue(undefined);

    getCartItems.mockImplementation(() => Promise.resolve(cartItems));
    getDeliveryOptions.mockResolvedValue(deliveryOptions);
    getPaymentSummary.mockImplementation(() => Promise.resolve(paymentSummary));

    updateCartItem.mockImplementation(async (productId, updates) => {
      cartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item,
      );

      if (updates.quantity) {
        paymentSummary = {
          ...paymentSummary,
          totalItems: updates.quantity,
          productCostCents: product.priceCents * updates.quantity,
          totalCostBeforeTaxCents: product.priceCents * updates.quantity,
          taxCents: Math.round(product.priceCents * updates.quantity * 0.1),
          totalCostCents:
            product.priceCents * updates.quantity +
            Math.round(product.priceCents * updates.quantity * 0.1),
        };
      }
    });

    deleteCartItem.mockImplementation(async (productId) => {
      cartItems = cartItems.filter((item) => item.productId !== productId);
      paymentSummary = {
        totalItems: 0,
        productCostCents: 0,
        shippingCostCents: 0,
        totalCostBeforeTaxCents: 0,
        taxCents: 0,
        totalCostCents: 0,
      };
    });
  });

  it("loads and displays the checkout summary", async () => {
    render(
      <MemoryRouter>
        <Checkout cartQuantity={1} refreshCartItems={refreshCartItems} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading checkout...")).toBeInTheDocument();

    expect(
      await screen.findByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).toBeInTheDocument();
    expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    expect(screen.getByText("$11.99")).toBeInTheDocument();
  });

  it("updates quantity from the checkout page", async () => {
    const user = userEvent.setup();
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("3");

    render(
      <MemoryRouter>
        <Checkout cartQuantity={1} refreshCartItems={refreshCartItems} />
      </MemoryRouter>,
    );

    await screen.findByText("Black and Gray Athletic Cotton Socks - 6 Pairs");

    await user.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateCartItem).toHaveBeenCalledWith(product.id, { quantity: 3 });
    });
    await waitFor(() => {
      expect(screen.getByText("Quantity:")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
    expect(refreshCartItems).toHaveBeenCalled();

    promptSpy.mockRestore();
  });

  it("deletes an item from the checkout page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Checkout cartQuantity={1} refreshCartItems={refreshCartItems} />
      </MemoryRouter>,
    );

    await screen.findByText("Black and Gray Athletic Cotton Socks - 6 Pairs");

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteCartItem).toHaveBeenCalledWith(product.id);
    });
    await waitFor(() => {
      expect(
        screen.queryByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
      ).not.toBeInTheDocument();
    });
    expect(refreshCartItems).toHaveBeenCalled();
  });
});
