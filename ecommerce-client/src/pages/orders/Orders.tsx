import { useEffect, useState } from "react";
import "./Orders.css";
import Header from "../../components/Header";
import { getOrders } from "../../api/shop";
import type { ExpandedOrder } from "../../types/shop";
import { OrderList } from "./OrderList";

type OrdersProps = {
  cartQuantity?: number;
};

export function Orders({ cartQuantity = 0 }: OrdersProps) {
  const [orders, setOrders] = useState<ExpandedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadOrders = async () => {
      try {
        const ordersData = (await getOrders({
          expandProducts: true,
        })) as ExpandedOrder[];

        if (controller.signal.aborted) {
          return;
        }

        setOrders(ordersData);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load orders:", error);

        if (!controller.signal.aborted) {
          setErrorMessage("Unable to load orders from the backend.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <title>Orders</title>
      <Header cartQuantity={cartQuantity} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>
        {isLoading ? <p>Loading orders...</p> : null}
        {errorMessage ? <p>{errorMessage}</p> : null}
        <OrderList orders={orders} />
      </div>
    </>
  );
}

export default Orders;
