import type {
  DeliveryOptionWithEstimate,
  ExpandedCartItem,
} from "../../types/shop";
import { formatLongDate } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { publicAssetUrl } from "../../utils/asset";

type CheckoutCartListProps = {
  cartItems: ExpandedCartItem[];
  deliveryOptions: DeliveryOptionWithEstimate[];
  onDeliveryOptionChange: (
    productId: string,
    deliveryOptionId: string,
  ) => Promise<void>;
  onQuantityUpdate: (productId: string, quantity: number) => Promise<void>;
  onDeleteCartItem: (productId: string) => Promise<void>;
  updatingProductId: string | null;
};

export function CheckoutCartList({
  cartItems,
  deliveryOptions,
  onDeliveryOptionChange,
  onQuantityUpdate,
  onDeleteCartItem,
  updatingProductId,
}: CheckoutCartListProps) {
  if (cartItems.length === 0) {
    return (
      <div className="order-summary-empty-state">
        <p>Your cart is empty. Add products from the store to continue.</p>
      </div>
    );
  }

  return (
    <div className="order-summary">
      {cartItems.map((cartItem) => {
        const selectedDeliveryOption = deliveryOptions.find(
          (option) => option.id === cartItem.deliveryOptionId,
        );

        return (
          <div key={cartItem.productId} className="cart-item-container">
            <div className="delivery-date">
              Delivery date:{" "}
              {selectedDeliveryOption
                ? formatLongDate(selectedDeliveryOption.estimatedDeliveryTimeMs)
                : "Unavailable"}
            </div>

            <div className="cart-item-details-grid">
              <img
                alt={cartItem.product.name}
                className="product-image"
                src={publicAssetUrl(cartItem.product.image)}
              />

              <div className="cart-item-details">
                <div className="product-name">{cartItem.product.name}</div>
                <div className="product-price">
                  {formatCurrency(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                  <span>
                    Quantity:{" "}
                    <span className="quantity-label">{cartItem.quantity}</span>
                  </span>
                  <button
                    type="button"
                    className="update-quantity-link px-3"
                    disabled={updatingProductId === cartItem.productId}
                    onClick={() => {
                      const nextQuantity = window.prompt(
                        "Enter a quantity between 1 and 10:",
                        String(cartItem.quantity),
                      );

                      if (!nextQuantity) {
                        return;
                      }

                      const parsedQuantity = Number(nextQuantity);

                      if (
                        !Number.isInteger(parsedQuantity) ||
                        parsedQuantity < 1 ||
                        parsedQuantity > 10
                      ) {
                        window.alert(
                          "Please enter a whole number from 1 to 10.",
                        );
                        return;
                      }

                      void onQuantityUpdate(cartItem.productId, parsedQuantity);
                    }}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="delete-quantity-link px-3"
                    disabled={updatingProductId === cartItem.productId}
                    onClick={() => {
                      void onDeleteCartItem(cartItem.productId);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="delivery-options">
                <div className="delivery-options-title">
                  Choose a delivery option:
                </div>

                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className="delivery-option"
                    htmlFor={`${cartItem.productId}-${option.id}`}
                  >
                    <input
                      id={`${cartItem.productId}-${option.id}`}
                      type="radio"
                      checked={cartItem.deliveryOptionId === option.id}
                      className="delivery-option-input"
                      name={`delivery-option-${cartItem.productId}`}
                      disabled={updatingProductId === cartItem.productId}
                      onChange={() => {
                        void onDeliveryOptionChange(
                          cartItem.productId,
                          option.id,
                        );
                      }}
                    />
                    <div>
                      <div className="delivery-option-date">
                        {formatLongDate(option.estimatedDeliveryTimeMs)}
                      </div>
                      <div className="delivery-option-price">
                        {option.priceCents === 0
                          ? "FREE Shipping"
                          : `${formatCurrency(option.priceCents)} - Shipping`}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
