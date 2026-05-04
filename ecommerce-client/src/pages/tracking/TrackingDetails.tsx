import type { ExpandedOrderProduct } from "../../types/shop";
import { formatLongDate } from "../../utils/date";
import { publicAssetUrl } from "../../utils/asset";

type TrackingDetailsProps = {
  orderProduct: ExpandedOrderProduct;
};

export function TrackingDetails({ orderProduct }: TrackingDetailsProps) {
  return (
    <>
      <div className="delivery-date">
        Arriving on {formatLongDate(orderProduct.estimatedDeliveryTimeMs)}
      </div>

      <div className="product-info">{orderProduct.product.name}</div>

      <div className="product-info">Quantity: {orderProduct.quantity}</div>

      <img
        alt={orderProduct.product.name}
        className="product-image"
        src={publicAssetUrl(orderProduct.product.image)}
      />

      <div className="progress-labels-container">
        <div className="progress-label">Preparing</div>
        <div className="progress-label current-status">Shipped</div>
        <div className="progress-label">Delivered</div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </>
  );
}
