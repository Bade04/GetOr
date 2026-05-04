import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";
import React from "react";

describe("ProductCard", () => {
  const product = {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87,
    },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  };

  it("renders the home page correctly", () => {
    const mockAddToCart = vi.fn().mockResolvedValue(undefined);

    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);

    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).toBeInTheDocument();
  });

  it("calls onAddToCart when the add to cart button is clicked", async () => {
    const user = userEvent.setup();
    const mockAddToCart = vi.fn().mockResolvedValue(undefined);

    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(product.id, 1);
  });
});
