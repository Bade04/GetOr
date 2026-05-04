import { useCallback, useEffect, useState } from "react";
import "./checkoutPage.css";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutCartList } from "./CheckoutCartList";
import { CheckoutPaymentSummary } from "./CheckoutPaymentSummary";
import {
  deleteCartItem,
  getCartItems,
  getDeliveryOptions,
  getPaymentSummary,
  updateCartItem,
} from "../../api/shop";
import type {
  DeliveryOptionWithEstimate,
  ExpandedCartItem,
  PaymentSummary,
} from "../../types/shop";

type CheckoutProps = {
  cartQuantity?: number;
  refreshCartItems?: (signal?: AbortSignal) => Promise<void>;
};

export function Checkout({
  cartQuantity = 0,
  refreshCartItems,
}: CheckoutProps) {
  const [cartItems, setCartItems] = useState<ExpandedCartItem[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<
    DeliveryOptionWithEstimate[]
  >([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );

  const loadCheckoutData = useCallback(async (signal?: AbortSignal) => {
    try {
      const [cartItemsData, deliveryOptionsData, paymentSummaryData] =
        await Promise.all([
          getCartItems({ expandProduct: true }) as Promise<ExpandedCartItem[]>,
          getDeliveryOptions({
            expandEstimatedDeliveryTime: true,
          }) as Promise<DeliveryOptionWithEstimate[]>,
          getPaymentSummary(),
        ]);

      if (signal?.aborted) {
        return;
      }

      setCartItems(cartItemsData);
      setDeliveryOptions(deliveryOptionsData);
      setPaymentSummary(paymentSummaryData);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to load checkout data:", error);

      if (!signal?.aborted) {
        setErrorMessage("Unable to load checkout data from the backend.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void loadCheckoutData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadCheckoutData]);

  const loadCart = useCallback(
    async (signal?: AbortSignal) => {
      await loadCheckoutData(signal);
      await refreshCartItems?.(signal);
    },
    [loadCheckoutData, refreshCartItems],
  );

  const getPaymentSummaryFromCart = useCallback(
    (currentCartItems: ExpandedCartItem[]) => {
      const productCostCents = currentCartItems.reduce(
        (total, item) => total + item.product.priceCents * item.quantity,
        0,
      );

      const shippingCostCents = currentCartItems.reduce((total, item) => {
        const deliveryOption = deliveryOptions.find(
          (option) => option.id === item.deliveryOptionId,
        );
        return total + (deliveryOption?.priceCents ?? 0);
      }, 0);

      const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
      const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
      const totalCostCents = totalCostBeforeTaxCents + taxCents;
      const totalItems = currentCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      return {
        totalItems,
        productCostCents,
        shippingCostCents,
        totalCostBeforeTaxCents,
        taxCents,
        totalCostCents,
      };
    },
    [deliveryOptions],
  );

  const handleDeliveryOptionChange = useCallback(
    async (productId: string, deliveryOptionId: string) => {
      setUpdatingProductId(productId);
      setCartItems((currentCartItems) => {
        const updatedCartItems = currentCartItems.map((item) =>
          item.productId === productId ? { ...item, deliveryOptionId } : item,
        );
        setPaymentSummary(getPaymentSummaryFromCart(updatedCartItems));
        return updatedCartItems;
      });

      try {
        await updateCartItem(productId, { deliveryOptionId });
        await loadCheckoutData();
        await refreshCartItems?.();
      } catch (error) {
        console.error("Failed to update delivery option:", error);
        setErrorMessage("Unable to update delivery option right now.");
        await loadCheckoutData();
      } finally {
        setUpdatingProductId(null);
      }
    },
    [getPaymentSummaryFromCart, loadCheckoutData, refreshCartItems],
  );

  const handleQuantityUpdate = useCallback(
    async (productId: string, quantity: number) => {
      setUpdatingProductId(productId);
      setCartItems((currentCartItems) => {
        const updatedCartItems = currentCartItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        setPaymentSummary(getPaymentSummaryFromCart(updatedCartItems));
        return updatedCartItems;
      });

      try {
        await updateCartItem(productId, { quantity });
        await loadCheckoutData();
        await refreshCartItems?.();
      } catch (error) {
        console.error("Failed to update quantity:", error);
        setErrorMessage("Unable to update quantity right now.");
        await loadCheckoutData();
      } finally {
        setUpdatingProductId(null);
      }
    },
    [getPaymentSummaryFromCart, loadCheckoutData, refreshCartItems],
  );

  const handleDeleteCartItem = useCallback(
    async (productId: string) => {
      setUpdatingProductId(productId);
      setCartItems((currentCartItems) => {
        const updatedCartItems = currentCartItems.filter(
          (item) => item.productId !== productId,
        );
        setPaymentSummary(getPaymentSummaryFromCart(updatedCartItems));
        return updatedCartItems;
      });

      try {
        await deleteCartItem(productId);
        await loadCheckoutData();
        await refreshCartItems?.();
      } catch (error) {
        console.error("Failed to delete cart item:", error);
        setErrorMessage("Unable to delete cart item right now.");
        await loadCheckoutData();
      } finally {
        setUpdatingProductId(null);
      }
    },
    [getPaymentSummaryFromCart, loadCheckoutData, refreshCartItems],
  );

  return (
    <>
      <title>Checkout</title>
      <CheckoutHeader
        cartQuantity={cartQuantity}
        totalItems={paymentSummary?.totalItems ?? cartQuantity}
      />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>
        {isLoading ? <p>Loading checkout...</p> : null}
        {errorMessage ? <p>{errorMessage}</p> : null}

        <div className="checkout-grid">
          <CheckoutCartList
            cartItems={cartItems}
            deliveryOptions={deliveryOptions}
            onDeliveryOptionChange={handleDeliveryOptionChange}
            onQuantityUpdate={handleQuantityUpdate}
            onDeleteCartItem={handleDeleteCartItem}
            updatingProductId={updatingProductId}
          />
          <CheckoutPaymentSummary
            paymentSummary={paymentSummary}
            loadCart={loadCart}
          />
        </div>
      </div>
    </>
  );
}

export default Checkout;
