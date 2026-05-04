import { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/home/HomePage";
import { Checkout } from "./pages/checkout/Checkout";
import { Orders } from "./pages/orders/Orders";
import { Tracking } from "./pages/tracking/Tracking";
import { addCartItem, getCartItems } from "./api/shop";

export function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartError, setCartError] = useState("");

  const loadCartItems = useCallback(async (signal) => {
    try {
      const cartItemsData = await getCartItems();

      if (signal?.aborted) {
        return;
      }

      setCartItems(cartItemsData);
      setCartError("");
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      console.error("Failed to load cart items:", error);
      setCartError("Unable to load cart items from the backend.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      void loadCartItems(controller.signal);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadCartItems]);

  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleAddToCart = useCallback(
    async (productId, quantity) => {
      setCartItems((currentCartItems) => {
        const existingItem = currentCartItems.find(
          (item) => item.productId === productId,
        );

        if (existingItem) {
          return currentCartItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [
          ...currentCartItems,
          { productId, quantity, deliveryOptionId: "1" },
        ];
      });

      try {
        await addCartItem(productId, quantity);
        await loadCartItems();
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        setCartError("Unable to update cart right now.");
        await loadCartItems();
      }
    },
    [loadCartItems],
  );

  return (
    <Router>
      {cartError ? <p>{cartError}</p> : null}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartQuantity={cartQuantity}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartQuantity={cartQuantity}
              refreshCartItems={loadCartItems}
            />
          }
        />
        <Route
          path="/orders"
          element={<Orders cartQuantity={cartQuantity} />}
        />
        <Route
          path="/tracking/:orderId/:productId"
          element={<Tracking cartQuantity={cartQuantity} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
