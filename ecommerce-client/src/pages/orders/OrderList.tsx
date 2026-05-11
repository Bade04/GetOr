import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { ExpandedOrder } from "../../types/shop";
import { formatShortDate } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { publicAssetUrl } from "../../utils/asset";

type OrderListProps = {
  orders: ExpandedOrder[];
};

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="orders-empty-state">
        <p>No orders yet. Place an order to see your purchase history here.</p>
        <Link className="orders-empty-link link-primary" to="/">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-grid">
      {orders.map((order) => (
        <div key={order.id} className="order-container">
          <div className="order-header">
            <div className="order-header-left-section">
              <div className="order-date">
                <div className="order-header-label">Order Placed:</div>
                <div>{formatShortDate(order.orderTimeMs)}</div>
              </div>
              <div className="order-total">
                <div className="order-header-label">Total:</div>
                <div>{formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div className="order-header-right-section">
              <div className="order-header-label">Order ID:</div>
              <div>{order.id}</div>
            </div>
          </div>

          <div className="order-details-grid">
            {order.products.map((orderProduct) => (
              <Fragment key={`${order.id}-${orderProduct.productId}`}>
                <div className="product-image-container">
                  <img
                    alt={orderProduct.product.name}
                    src={publicAssetUrl(orderProduct.product.image)}
                  />
                </div>

                <div className="product-details">
                  <div className="product-name">
                    {orderProduct.product.name}
                  </div>
                  <div className="product-delivery-date">
                    Arriving on:{" "}
                    {formatShortDate(orderProduct.estimatedDeliveryTimeMs)}
                  </div>
                  <div className="product-quantity">
                    Quantity: {orderProduct.quantity}
                  </div>
                  <button className="buy-again-button button-primary">
                    <img
                      alt="Add to cart icon"
                      className="buy-again-icon"
                      src={publicAssetUrl("images/icons/buy-again.png")}
                    />
                    <span className="buy-again-message">Add to Cart</span>
                  </button>
                </div>

                <div className="product-actions">
                  <Link to={`/tracking/${order.id}/${orderProduct.productId}`}>
                    <button className="track-package-button button-secondary">
                      Track package
                    </button>
                  </Link>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
