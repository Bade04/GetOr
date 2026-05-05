import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./HomePage";

vi.mock("../../api/shop", () => ({
  getProducts: vi.fn(),
}));

import { getProducts } from "../../api/shop";

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

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays products from the backend", async () => {
    getProducts.mockResolvedValue([product]);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={<HomePage cartQuantity={0} onAddToCart={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading live catalog...")).toBeInTheDocument();

    expect(
      await screen.findByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("Loading live catalog..."),
      ).not.toBeInTheDocument();
    });
  });

  it("shows a no-results message when the search query matches nothing", async () => {
    getProducts.mockResolvedValue([product]);

    render(
      <MemoryRouter initialEntries={["/?search=shoes"]}>
        <Routes>
          <Route
            path="/"
            element={<HomePage cartQuantity={0} onAddToCart={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText('No products found for "shoes".'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
    ).not.toBeInTheDocument();
  });
});
