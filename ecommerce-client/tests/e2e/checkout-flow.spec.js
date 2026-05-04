import { test, expect } from "@playwright/test";

test("customer can add a product to cart, checkout, and place an order", async ({
  page,
}) => {
  const product = {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "/images/products/athletic-cotton-socks-6-pairs.jpg",
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

  let cartItems = [];
  let orders = [];

  const buildPaymentSummary = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const productCostCents = cartItems.reduce(
      (sum, item) => sum + item.product.priceCents * item.quantity,
      0,
    );
    const shippingCostCents = cartItems.reduce((sum, item) => {
      const selectedOption = deliveryOptions.find(
        (option) => option.id === item.deliveryOptionId,
      );
      return sum + (selectedOption?.priceCents ?? 0);
    }, 0);
    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);

    return {
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents: totalCostBeforeTaxCents + taxCents,
    };
  };

  const buildExpandedCartItems = () =>
    cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      product: item.product,
    }));

  await page.route("**/images/**", async (route) => {
    await route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
    });
  });

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname, searchParams } = url;
    const method = request.method();

    if (pathname === "/api/products" && method === "GET") {
      await route.fulfill({ json: [product] });
      return;
    }

    if (pathname === "/api/cart-items" && method === "GET") {
      const shouldExpand = searchParams.get("expand") === "product";
      await route.fulfill({
        json: shouldExpand
          ? buildExpandedCartItems()
          : cartItems.map(({ id, productId, quantity, deliveryOptionId }) => ({
              id,
              productId,
              quantity,
              deliveryOptionId,
            })),
      });
      return;
    }

    if (pathname === "/api/cart-items" && method === "POST") {
      const body = request.postDataJSON();
      const existingItem = cartItems.find(
        (item) => item.productId === body.productId,
      );

      if (existingItem) {
        existingItem.quantity += body.quantity;
      } else {
        cartItems.push({
          id: `cart-${body.productId}`,
          productId: body.productId,
          quantity: body.quantity,
          deliveryOptionId: "1",
          product,
        });
      }

      await route.fulfill({
        json: {
          id: `cart-${body.productId}`,
          productId: body.productId,
          quantity: body.quantity,
          deliveryOptionId: "1",
        },
      });
      return;
    }

    if (pathname.startsWith("/api/cart-items/") && method === "PUT") {
      const productId = pathname.split("/").pop();
      const updates = request.postDataJSON();

      cartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item,
      );

      const updatedItem = cartItems.find((item) => item.productId === productId);
      await route.fulfill({
        json: {
          id: updatedItem.id,
          productId: updatedItem.productId,
          quantity: updatedItem.quantity,
          deliveryOptionId: updatedItem.deliveryOptionId,
        },
      });
      return;
    }

    if (pathname.startsWith("/api/cart-items/") && method === "DELETE") {
      const productId = pathname.split("/").pop();
      cartItems = cartItems.filter((item) => item.productId !== productId);
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    if (pathname === "/api/delivery-options" && method === "GET") {
      await route.fulfill({ json: deliveryOptions });
      return;
    }

    if (pathname === "/api/payment-summary" && method === "GET") {
      await route.fulfill({ json: buildPaymentSummary() });
      return;
    }

    if (pathname === "/api/orders" && method === "POST") {
      const paymentSummary = buildPaymentSummary();
      const order = {
        id: "order-1",
        orderTimeMs: new Date("2026-04-27T12:00:00Z").getTime(),
        totalCostCents: paymentSummary.totalCostCents,
        products: cartItems.map((item) => {
          const selectedOption = deliveryOptions.find(
            (option) => option.id === item.deliveryOptionId,
          );

          return {
            productId: item.productId,
            quantity: item.quantity,
            estimatedDeliveryTimeMs:
              selectedOption?.estimatedDeliveryTimeMs ??
              deliveryOptions[0].estimatedDeliveryTimeMs,
            product: item.product,
          };
        }),
      };

      orders = [order];
      cartItems = [];

      await route.fulfill({ status: 201, json: order });
      return;
    }

    if (pathname === "/api/orders" && method === "GET") {
      await route.fulfill({ json: orders });
      return;
    }

    await route.fulfill({ status: 404, json: { message: "Not mocked" } });
  });

  await page.goto("/");

  await expect(
    page.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
  ).toBeVisible({ timeout: 15000 });

  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Added")).toBeVisible();
  await expect(page.locator(".cart-quantity")).toHaveText("1");

  await page.getByRole("link", { name: /cart/i }).click();

  await expect(page.getByText("Review your order")).toBeVisible();
  await expect(
    page.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
  ).toBeVisible();
  await expect(page.getByText("$11.99")).toBeVisible();

  await page.getByRole("button", { name: "Place your order" }).click();

  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByText("Your Orders")).toBeVisible();
  await expect(
    page.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs"),
  ).toBeVisible();
});
