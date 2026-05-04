import { useEffect, useState } from "react";
import "./HomePage.css";
import Header from "../../components/Header.jsx";
import { getProducts } from "../../api/shop";
import type { Product } from "../../types/shop";
import { ProductGrid } from "./ProductGrid";
import { useSearchParams } from "react-router-dom";

type HomePageProps = {
  cartQuantity: number;
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
};

export function HomePage({ cartQuantity, onAddToCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") ?? "").trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery),
  );

  // add a no result state if search query is not empty and there are no visible products
  const hasNoResults = Boolean(searchQuery) && visibleProducts.length === 0;

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const productsData = await getProducts();

        if (controller.signal.aborted) {
          return;
        }

        setProducts(productsData);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to load products:", error);

        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          "Unable to reach the backend. Make sure the server is running on port 3000.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <Header cartQuantity={cartQuantity} />

      <div className="home-page">
        {isLoading ? <p>Loading products...</p> : null}
        {errorMessage ? <p>{errorMessage}</p> : null}
        {hasNoResults ? (
          <div className="search-empty-state">
            No products found for "{searchQuery}".
          </div>
        ) : null}
        <ProductGrid products={visibleProducts} onAddToCart={onAddToCart} />
      </div>
    </>
  );
}

export default HomePage;
