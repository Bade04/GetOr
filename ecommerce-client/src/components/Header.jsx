import React from "react";
import "./Header.css";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { publicAssetUrl } from "../utils/asset";

export function Header({ cartQuantity = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawSearch = formData.get("search");
    const trimmedSearch = typeof rawSearch === "string" ? rawSearch.trim() : "";

    if (trimmedSearch === "") {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link" aria-label="Go to homepage">
          <span className="logo-text">GetOr</span>
        </NavLink>
      </div>

      <div className="middle-section">
        <form
          key={searchParams.get("search") ?? ""}
          className="search-form"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="search-bar"
            type="text"
            name="search"
            placeholder="Search products"
            defaultValue={searchParams.get("search") ?? ""}
          />
          <button className="search-button" type="submit">
            <img
              alt="Search icon"
              className="search-icon"
              src={publicAssetUrl("images/icons/search-icon.png")}
            />
          </button>
        </form>
      </div>

      <div className="right-section">
        <NavLink className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink
          className="cart-link header-link"
          to={
            location.pathname === "/" && searchParams.toString()
              ? `/checkout?${searchParams.toString()}`
              : "/checkout"
          }
        >
          <img
            alt="Cart icon"
            className="cart-icon"
            src={publicAssetUrl("images/icons/cart-icon.png")}
          />
          <div className="cart-quantity">{cartQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
