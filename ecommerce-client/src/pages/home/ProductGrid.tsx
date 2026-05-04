import type { Product } from "../../types/shop";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
