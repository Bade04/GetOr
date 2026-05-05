import "./CheckoutHeader.css";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { publicAssetUrl } from "../../utils/asset";

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
              <span className="logo-text">GetOr</span>
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
              src={publicAssetUrl("images/icons/checkout-lock-icon.png")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
