import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal from "../components/ui/Reveal";
import StarRating from "../components/ui/StarRating";
import { LinkButton } from "../components/ui/Button";
import Button from "../components/ui/Button";
import {
  IconArrow,
  IconCheck,
  IconFlask,
  IconShield,
  IconTruck,
} from "../components/art/Icons";
import { products, getProductBySlug } from "../data/products";
import { useCart } from "../context/CartContext";
import type { DoseOption } from "../types";
import { useSeo, useJsonLd, SITE_URL, SITE_NAME } from "../lib/seo";
import "./ProductDetail.css";

type TabKey = "package" | "storage" | "supply";

const TAB_LABEL: Record<TabKey, string> = {
  package: "Package Contents",
  storage: "Storage Logic",
  supply: "Supply Chain",
};

function tabBody(key: TabKey, productName: string, strength: string): string {
  switch (key) {
    case "package":
      return `Each ${productName} ${strength} research kit includes: pre-filled research pen (${strength} ${productName}), sterile alcohol wipes and a research information sheet.`;
    case "storage":
      return "Store refrigerated at 2–8°C on receipt. Once in service, the pen holds room-temperature stability for up to 56 days under our internal QC hold protocol.";
    case "supply":
      return "Supplied from a licensed EU compounding facility. Every batch is fingerprinted, sealed and independently verified by Janoshik Analytical before dispatch.";
  }
}

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedDose, setSelectedDose] = useState<DoseOption | undefined>(
    product?.doses[0]
  );
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("package");
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    return product.images && product.images.length > 0
      ? product.images
      : [product.img];
  }, [product]);

  const related = useMemo(
    () => products.filter((p) => p.slug !== slug).slice(0, 3),
    [slug]
  );

  // --- SEO + structured data (hooks must run before the early return) ---
  useSeo({
    title: product ? product.name : "Product",
    description: product
      ? `${product.summary} ${product.compoundClass}. Clinician-reviewed and lab-tested — from Vyra Health.`
      : "Clinician-reviewed, lab-tested weight-loss treatment from Vyra Health.",
    path: product ? `/product/${product.slug}` : undefined,
    type: "product",
    image: product ? `${SITE_URL}${product.img}` : undefined,
  });
  useJsonLd(
    "product",
    product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          category: product.compoundClass,
          image: (product.images?.length ? product.images : [product.img]).map(
            (i) => `${SITE_URL}${i}`
          ),
          brand: { "@type": "Brand", name: SITE_NAME },
          aggregateRating: product.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              }
            : undefined,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "GBP",
            lowPrice: Math.min(...product.doses.map((d) => d.price)),
            highPrice: Math.max(...product.doses.map((d) => d.price)),
            offerCount: product.doses.length,
            availability: "https://schema.org/InStock",
          },
        }
      : null
  );
  useJsonLd(
    "product-breadcrumb",
    product
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: `${SITE_URL}/product/${product.slug}`,
            },
          ],
        }
      : null
  );

  if (!product) return <Navigate to="/" replace />;

  const dose = selectedDose ?? product.doses[0];
  const priceLabel = `£${dose.price}`;

  const onAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      doseId: dose.id,
      doseLabel: dose.label,
      strength: dose.strength,
      price: dose.price,
      quantity: qty,
      accent: product.accent,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="pdp">
      {/* ============ Breadcrumb ============ */}
      <div className="container pdp__crumbs">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/#products">Shop</Link>
        <span aria-hidden="true">/</span>
        <span className="pdp__crumbs-current">{product.name}</span>
      </div>

      {/* ============ Hero grid ============ */}
      <section className="container pdp__hero">
        {/* Gallery */}
        <div className="pdp__gallery">
          <motion.div
            className="pdp__stage"
            key={gallery[activeImg]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              // subtle brand glow behind the pack shot
              background: `radial-gradient(60% 60% at 50% 42%, ${product.accent}18, transparent 70%), var(--bg-alt)`,
            }}
          >
            <img
              src={gallery[activeImg]}
              alt={`${product.name} — view ${activeImg + 1}`}
              className="pdp__stage-img"
              loading="eager"
              decoding="async"
            />
            <span className="pdp__stage-badge">
              <IconShield size={14} /> Verified
            </span>
          </motion.div>

          <div className="pdp__thumbs" role="tablist" aria-label="Product images">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === activeImg}
                aria-label={`View image ${i + 1}`}
                className={`pdp__thumb${i === activeImg ? " is-active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        {/* Info column */}
        <div className="pdp__info">
          <Reveal>
            <span className="pdp__eyebrow">Compound Analysis</span>
            <h1 className="pdp__title">
              {product.name}{" "}
              <em className="pdp__title-strength">
                {dose.strength}
              </em>
            </h1>
            <div className="pdp__meta">
              <StarRating value={product.rating} size={15} showValue />
              <span className="pdp__meta-dot" aria-hidden="true">
                ·
              </span>
              <span className="pdp__meta-reviews">
                {product.reviewCount.toLocaleString()} reviews
              </span>
              <span className="pdp__meta-dot" aria-hidden="true">
                ·
              </span>
              <span className="pdp__meta-class">{product.compoundClass}</span>
            </div>

            <div className="pdp__price">{priceLabel}</div>

            <p className="pdp__desc">{product.description}</p>

            <div className="pdp__safety">
              <strong>Safety Protocol:</strong> Produced for laboratory research
              only. Not for human or veterinary consumption.
            </div>

            {product.reportUrl && (
              <a
                className="pdp__report"
                href={product.reportUrl}
                target="_blank"
                rel="noreferrer"
              >
                <IconFlask size={16} />
                View Janoshik Analytical Report
                <IconArrow size={14} />
              </a>
            )}
          </Reveal>

          {/* ============ Analytical card ============ */}
          <Reveal index={1}>
            <div className="pdp__lab">
              <div className="pdp__lab-head">
                <span className="pdp__lab-icon">
                  <IconFlask size={20} />
                </span>
                <div>
                  <h3>Janoshik Third-Party Lab Analysis</h3>
                  <p>Independently tested and verified by Janoshik Analytical.</p>
                </div>
              </div>

              <div className="pdp__lab-stats">
                <div>
                  <span>Batch number</span>
                  <strong>{product.batchNumber ?? "—"}</strong>
                </div>
                <div>
                  <span>Fill volume</span>
                  <strong>{product.fillVolume ?? "—"}</strong>
                </div>
                <div>
                  <span>Purity</span>
                  <strong className="pdp__lab-purity">
                    {product.purity ?? "—"}
                  </strong>
                </div>
              </div>

              <table className="pdp__lab-table">
                <thead>
                  <tr>
                    <th>Compound</th>
                    <th>Concentration</th>
                    <th>Verified content</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{product.name}</td>
                    <td>{product.concentration ?? "—"}</td>
                    <td>{product.verifiedContent ?? "—"}</td>
                  </tr>
                </tbody>
              </table>

              <p className="pdp__lab-note">
                Concentration is measured per ml; verified content reflects the
                total assayed mass across the stated fill volume.
              </p>
            </div>
          </Reveal>

          {/* ============ Dose selector + buy ============ */}
          <Reveal index={2}>
            <div className="pdp__buy">
              <div className="pdp__buy-head">
                <span>Choose a dose</span>
                <small>{dose.supply} supply · {dose.label}</small>
              </div>

              <div className="pdp__doses" role="radiogroup" aria-label="Dose">
                {product.doses.map((d) => (
                  <button
                    key={d.id}
                    role="radio"
                    aria-checked={d.id === dose.id}
                    type="button"
                    className={`pdp__dose${
                      d.id === dose.id ? " is-active" : ""
                    }`}
                    onClick={() => setSelectedDose(d)}
                    style={
                      d.id === dose.id
                        ? { borderColor: product.accent }
                        : undefined
                    }
                  >
                    <span className="pdp__dose-label">{d.label}</span>
                    <span className="pdp__dose-str">{d.strength}</span>
                    <span className="pdp__dose-price">£{d.price}</span>
                  </button>
                ))}
              </div>

              <div className="pdp__buy-row">
                <div className="pdp__stepper" aria-label="Quantity">
                  <button
                    type="button"
                    onClick={() => setQty((n) => Math.max(1, n - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((n) => n + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={onAddToCart}
                  className="pdp__buy-btn"
                >
                  {added ? "Added to basket ✓" : `Add to basket · £${dose.price * qty}`}
                </Button>
              </div>

              <div className="pdp__perks">
                <span>
                  <IconTruck size={15} /> Free UK delivery
                </span>
                <span>
                  <IconShield size={15} /> Clinician-reviewed
                </span>
                <span>
                  <IconCheck size={15} /> Lab-tested ≥99% purity
                </span>
              </div>
            </div>
          </Reveal>

          {/* ============ Tabs ============ */}
          <Reveal index={3}>
            <div className="pdp__tabs">
              <div className="pdp__tabs-nav" role="tablist" aria-label="Product details">
                {(Object.keys(TAB_LABEL) as TabKey[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={tab === k}
                    className={`pdp__tab${tab === k ? " is-active" : ""}`}
                    onClick={() => setTab(k)}
                  >
                    {TAB_LABEL[k]}
                  </button>
                ))}
              </div>
              <motion.p
                key={tab}
                className="pdp__tabs-body"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {tabBody(tab, product.name, dose.strength)}
              </motion.p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ Highlights strip ============ */}
      <section className="container pdp__highlights">
        {product.highlights.map((h) => (
          <div className="pdp__highlight" key={h}>
            <span className="pdp__highlight-dot" style={{ background: product.accent }}>
              <IconCheck size={13} />
            </span>
            <p>{h}</p>
          </div>
        ))}
      </section>

      {/* ============ Related ============ */}
      <section id="related" className="section container pdp__related">
        <Reveal className="section-head center">
          <h2>
            Continue your <span className="serif-i">research.</span>
          </h2>
          <p>Handpicked treatments that pair well with {product.name}.</p>
        </Reveal>

        <div className="pdp__related-grid">
          {related.map((p) => {
            const from = Math.min(...p.doses.map((d) => d.price));
            return (
              <div className="pdp__related-card" key={p.id}>
                <Link to={`/product/${p.slug}`} className="pdp__related-link">
                  <div
                    className="pdp__related-art"
                    style={{
                      background: `radial-gradient(60% 60% at 50% 40%, ${p.accent}22, transparent 70%), var(--bg-alt)`,
                    }}
                  >
                    <img src={p.img} alt={`${p.name} pack`} loading="lazy" />
                  </div>
                  <div className="pdp__related-body">
                    <span className="pdp__related-eyebrow">
                      {p.compoundClass}
                    </span>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                    <div className="pdp__related-foot">
                      <span>From £{from}</span>
                      <IconArrow size={14} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="pdp__related-cta">
          <LinkButton to="/quiz" size="lg" arrow>
            Not sure? Take the 2-min quiz
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
