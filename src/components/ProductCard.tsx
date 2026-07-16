import { Link } from "react-router-dom";
import type { Product } from "../types";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

const badgeClass: Record<string, string> = {
  "Most popular": "product-card__badge--green",
  "Best value": "product-card__badge--tan",
  "Max strength": "product-card__badge--dark",
  New: "product-card__badge--sage",
};

/** Product card — Vyra Health-style white card with box art, price and CTAs. */
export default function ProductCard({ product }: ProductCardProps) {
  const fromPrice = Math.min(...product.doses.map((d) => d.price));

  return (
    <article className="product-card" data-product={product.slug}>
      {product.badge && (
        <span
          className={`product-card__badge ${badgeClass[product.badge] ?? ""}`}
        >
          {product.badge}
        </span>
      )}

      <div className="product-card__head">
        <h3>{product.name}</h3>
      </div>

      <Link to={`/product/${product.slug}`} className="product-card__art">
        <img
          src={product.img}
          alt={`${product.name} box`}
          className="product-card__art-img"
          loading="lazy"
          decoding="async"
        />
      </Link>

      <p className="product-card__desc">{product.summary}</p>

      <div className="product-card__price">
        <span className="product-card__from">From</span>
        <span className="product-card__amount">${fromPrice}</span>
      </div>

      <div className="product-card__actions">
        <Link to="/quiz" className="product-card__btn product-card__btn--ghost">
          Check eligibility
        </Link>
        <Link
          to={`/product/${product.slug}`}
          className="product-card__btn product-card__btn--dark"
        >
          View treatment
        </Link>
      </div>
    </article>
  );
}
