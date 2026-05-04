import type { Product } from "../../types/shop";
import { useState } from "react";
import { publicAssetUrl } from "../../utils/asset";

type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCartClick = async () => {
    setIsAdding(true);

    try {
      await onAddToCart(product.id, selectedQuantity);
      setShowAddedMessage(true);

      setTimeout(() => {
        setShowAddedMessage(false);
      }, 1500);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          alt={product.name}
          className="product-image"
          src={publicAssetUrl(product.image)}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          alt={`${product.rating.stars} stars`}
          className="product-rating-stars"
          src={`/images/ratings/rating-${Math.round(product.rating.stars * 10)}.png`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">
        ${(product.priceCents / 100).toFixed(2)}
      </div>

      <div className="product-quantity-container">
        <select
          className="product-quantity-select"
          aria-label={`Select quantity for ${product.name}`}
          value={selectedQuantity}
          onChange={(event) => {
            setSelectedQuantity(Number(event.target.value));
          }}
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map(
            (quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className={`added-to-cart ${showAddedMessage ? "visible" : ""}`}>
        <img alt="Added to cart" src="/images/icons/checkmark.png" />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        onClick={handleAddToCartClick}
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
