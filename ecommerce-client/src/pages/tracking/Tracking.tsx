import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Tracking.css";
import Header from "../../components/Header";
import { getOrderById } from "../../api/shop";
import type { ExpandedOrder, ExpandedOrderProduct } from "../../types/shop";
import { TrackingDetails } from "./TrackingDetails";

type TrackingProps = {
  cartQuantity?: number;
};

export function Tracking({ cartQuantity = 0 }: TrackingProps) {
  const { orderId, productId } = useParams();
  const [orderProduct, setOrderProduct] = useState<ExpandedOrderProduct | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadTrackingData = async () => {
      if (!orderId || !productId) {
        setErrorMessage("Missing tracking details.");
        setIsLoading(false);
        return;
      }

      try {
        const order = (await getOrderById(orderId, {
          expandProducts: true,
        })) as ExpandedOrder;

        const matchedProduct =
          order.products.find((product) => product.productId === productId) ??
          null;

        if (controller.signal.aborted) {
          return;
        }

        if (!matchedProduct) {
          setErrorMessage("Tracked product not found in this order.");
          return;
        }

        setOrderProduct(matchedProduct);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load tracking data:", error);

        if (!controller.signal.aborted) {
          setErrorMessage("Unable to load tracking details from the backend.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTrackingData();

    return () => {
      controller.abort();
    };
  }, [orderId, productId]);

  return (
    <>
      <title>Tracking</title>
      <Header cartQuantity={cartQuantity} />
      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          {isLoading ? <p>Loading tracking details...</p> : null}
          {errorMessage ? <p>{errorMessage}</p> : null}
          {orderProduct ? (
            <TrackingDetails orderProduct={orderProduct} />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Tracking;
