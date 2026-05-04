import type { PaymentSummary } from "../../types/shop";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/money";
import { createOrder as createOrderRequest } from "../../api/shop";

type CheckoutPaymentSummaryProps = {
  paymentSummary: PaymentSummary | null;
  loadCart: (signal?: AbortSignal) => Promise<void>;
};

export function CheckoutPaymentSummary({
  paymentSummary,
  loadCart,
}: CheckoutPaymentSummaryProps) {
  const navigate = useNavigate();

  const handleCreateOrder = () => async () => {
    try {
      await createOrderRequest();
      await loadCart();
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>
      <div className="payment-summary-row">
        <div>Items ({paymentSummary?.totalItems ?? 0}):</div>
        <div className="payment-summary-money">
          {formatCurrency(paymentSummary?.productCostCents ?? 0)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div className="payment-summary-money">
          {formatCurrency(paymentSummary?.shippingCostCents ?? 0)}
        </div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div className="payment-summary-money">
          {formatCurrency(paymentSummary?.totalCostBeforeTaxCents ?? 0)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div className="payment-summary-money">
          {formatCurrency(paymentSummary?.taxCents ?? 0)}
        </div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money">
          {formatCurrency(paymentSummary?.totalCostCents ?? 0)}
        </div>
      </div>

      <button
        className="place-order-button button-primary"
        onClick={handleCreateOrder()}
      >
        Place your order
      </button>
    </div>
  );
}
