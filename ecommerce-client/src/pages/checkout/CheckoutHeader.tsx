import "./CheckoutHeader.css";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

type CheckoutHeaderProps = {
  cartQuantity?: number;
  totalItems?: number;
};

export function CheckoutHeader({
  cartQuantity = 0,
  totalItems = cartQuantity,
}: CheckoutHeaderProps) {
  return (
    <>
      <Header cartQuantity={cartQuantity} />

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              <img alt="Amazon" className="logo" src="/images/logo.png" />
              <img
                alt="Amazon"
                className="mobile-logo"
                src="/images/mobile-logo.png"
              />
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <Link className="return-to-home-link" to="/">
              {totalItems} items
            </Link>
            )
          </div>

          <div className="checkout-header-right-section">
            <img
              alt="Checkout lock"
              src="/images/icons/checkout-lock-icon.png"
            />
          </div>
        </div>
      </div>
    </>
  );
}
