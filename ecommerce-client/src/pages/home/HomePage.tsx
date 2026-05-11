import { useEffect, useState } from "react";
import "./HomePage.css";
import Header from "../../components/Header.jsx";
import { getProducts } from "../../api/shop";
import type { Product } from "../../types/shop";
import { ProductGrid } from "./ProductGrid";
import { Link, useSearchParams } from "react-router-dom";
import { getCurrentMonthYear } from "../../utils/date";

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
  const averageRating = products.length
    ? (
        products.reduce((total, product) => total + product.rating.stars, 0) /
        products.length
      ).toFixed(1)
    : null;

  const hasNoResults = Boolean(searchQuery) && visibleProducts.length === 0;
  const catalogTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : "Featured catalog";
  const catalogSubtitle = searchQuery
    ? `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} matched your search.`
    : "Browse the live catalog, add items to the cart, and walk through checkout and order tracking.";
  const stackItems = [
    "React",
    "Vite",
    "Express",
    "Sequelize",
    "Render",
    "Vercel",
  ];

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
          "Unable to load inventory right now. Check the backend deployment or local API connection and try again.",
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

  useEffect(() => {
    document.title = "GetOr | Full-Stack E-Commerce Portfolio Project";

    return () => {
      document.title = "GetOr";
    };
  }, []);

  return (
    <>
      <Header cartQuantity={cartQuantity} />

      <div className="home-page">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="hero-eyebrow">Full-stack storefront demo</p>
            <h1>
              GetOr is a full-stack e-commerce app built to feel like a real
              shopping product.
            </h1>
            <p className="hero-description">
              The frontend is built with React and Vite, the backend runs on
              Express and Sequelize, and the project is set up for Vercel plus
              Render deployment. It highlights end-to-end product thinking, not
              just isolated UI screens.
            </p>

            <div className="hero-stack" aria-label="Technology stack">
              {stackItems.map((item) => (
                <span key={item} className="hero-stack-pill">
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <a className="hero-action hero-action-primary" href="#catalog">
                Explore catalog
              </a>
              <Link className="hero-action hero-action-secondary" to="/orders">
                View orders
              </Link>
            </div>

            <p className="hero-updated">Updated: {getCurrentMonthYear()}</p>
            <p className="hero-description-secondary">
              Browse curated inventory, add items to your cart, and complete checkout to create your own order history.
            </p>
          </div>

          <div className="hero-proof-grid" aria-label="Core product features">
            <article className="hero-proof-card">
              <p className="hero-proof-label">Storefront</p>
              <h2>Searchable product browsing</h2>
              <p>
                Visitors can scan product cards, review ratings, and search the
                catalog without leaving the main shopping flow.
              </p>
            </article>
            <article className="hero-proof-card">
              <p className="hero-proof-label">Architecture</p>
              <h2>Frontend and backend connected end to end</h2>
              <p>
                Cart updates are saved through the API so the checkout
                experience reflects backend state instead of static mock data.
              </p>
            </article>
            <article className="hero-proof-card">
              <p className="hero-proof-label">Post-purchase</p>
              <h2>Orders and tracking built in</h2>
              <p>
                The project goes beyond add-to-cart by showing order history and
                package tracking as part of the product story.
              </p>
            </article>
          </div>
        </section>

        {isLoading ? (
          <p className="status-banner">Loading live catalog...</p>
        ) : null}
        {errorMessage ? (
          <p className="status-banner status-banner-error">{errorMessage}</p>
        ) : null}

        <section className="catalog-shell" id="catalog">
          <div className="catalog-header">
            <div>
              <p className="catalog-eyebrow">Interactive catalog</p>
              <h2>{catalogTitle}</h2>
              <p className="catalog-subtitle">{catalogSubtitle}</p>
            </div>

            <div className="catalog-summary">
              <span>{visibleProducts.length}</span>
              <p>Products visible</p>
            </div>
          </div>

          {hasNoResults ? (
            <div className="search-empty-state">
              No products found for "{searchQuery}".
            </div>
          ) : (
            <ProductGrid products={visibleProducts} onAddToCart={onAddToCart} />
          )}
        </section>
      </div>
    </>
  );
}

export default HomePage;
