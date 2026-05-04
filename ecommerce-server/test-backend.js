import { spawn } from "child_process";
import assert from "assert";
import { setTimeout as delay } from "timers/promises";

const server = spawn(process.execPath, ["./server.js"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

process.on("exit", () => {
  if (!server.killed) {
    server.kill();
  }
});

async function waitForServerReady() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/products");
      if (response.ok) {
        return;
      }
    } catch {
      // ignore until server is ready
    }
    await delay(500);
  }
  throw new Error("Server did not start within 15 seconds");
}

async function request(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:3000${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = response.status === 204 ? null : await response.json();
  return { status: response.status, body };
}

async function runTests() {
  await waitForServerReady();

  const productsResponse = await request("/api/products");
  assert.strictEqual(productsResponse.status, 200);
  assert.ok(Array.isArray(productsResponse.body));
  assert.ok(productsResponse.body.length > 0);

  const deliveryResponse = await request("/api/delivery-options");
  assert.strictEqual(deliveryResponse.status, 200);
  assert.ok(Array.isArray(deliveryResponse.body));
  assert.ok(deliveryResponse.body.length > 0);

  const initialCartResponse = await request("/api/cart-items?expand=product");
  assert.strictEqual(initialCartResponse.status, 200);
  assert.ok(Array.isArray(initialCartResponse.body));

  const paymentSummaryResponse = await request("/api/payment-summary");
  assert.strictEqual(paymentSummaryResponse.status, 200);
  assert.strictEqual(typeof paymentSummaryResponse.body.totalItems, "number");
  assert.strictEqual(typeof paymentSummaryResponse.body.totalCostCents, "number");

  const productId = productsResponse.body[0]?.id;
  assert.ok(typeof productId === "string" && productId.length > 0, "Product ID must be a string");

  const addCartResponse = await request("/api/cart-items", {
    method: "POST",
    body: { productId, quantity: 1 },
  });
  assert.strictEqual(addCartResponse.status, 201);

  const orderResponse = await request("/api/orders", { method: "POST" });
  assert.strictEqual(orderResponse.status, 201);
  assert.ok(orderResponse.body?.id, "Order response must include an ID");

  const ordersResponse = await request("/api/orders?expand=products");
  assert.strictEqual(ordersResponse.status, 200);
  assert.ok(Array.isArray(ordersResponse.body));

  const resetResponse = await request("/api/reset", { method: "POST" });
  assert.strictEqual(resetResponse.status, 204);
}

runTests()
  .then(() => {
    console.log("Backend automated tests passed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Backend automated tests failed:", error);
    process.exit(1);
  });
