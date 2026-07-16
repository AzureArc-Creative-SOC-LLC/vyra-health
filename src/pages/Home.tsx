import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LinkButton } from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import ProductCard from "../components/ProductCard";
import Accordion from "../components/ui/Accordion";
import SmartImage from "../components/art/SmartImage";
import Logo from "../components/art/Logo";
import {
  IconStethoscope,
  IconTag,
  IconTruck,
  IconShield,
  IconCheck,
  IconStar,
  IconFlask,
  IconChat,
  IconClock,
  IconLeaf,
} from "../components/art/Icons";
import { products } from "../data/products";
import Counter from "../components/ui/Counter";
import { reviews, reviewStats } from "../data/reviews";
import { faqs } from "../data/faqs";
import { useSeo, useJsonLd } from "../lib/seo";
import "./Home.css";

/* ---------- small helpers ---------- */

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

function StarRow({ size = 16 }: { size?: number }) {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} size={size} />
      ))}
    </span>
  );
}

/* ---------- interactive goal-weight card ---------- */

function GoalWeightCard() {
  const [weight, setWeight] = useState(90);
  const potential = Math.round(weight * 0.18);
  return (
    <div className="goal__card">
      <div className="goal__row">
        <span className="goal__label">Your current weight</span>
        <span className="goal__big">
          {weight}
          <em>kg</em>
        </span>
      </div>
      <input
        type="range"
        min={55}
        max={180}
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        className="goal__slider"
        aria-label="Your current weight in kilograms"
      />
      <div className="goal__scale">
        <span>55 kg</span>
        <span>180 kg</span>
      </div>
      <div className="goal__divider" />
      <div className="goal__row">
        <span className="goal__label">Weight loss potential</span>
        <span className="goal__big goal__big--accent">
          {potential}
          <em>kg</em>
        </span>
      </div>
    </div>
  );
}

/* ============================================================ */

const PRODUCTS_PREVIEW_COUNT = 4;

export default function Home() {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const visibleProducts = showAllProducts
    ? products
    : products.slice(0, PRODUCTS_PREVIEW_COUNT);
  const hasMoreProducts = products.length > PRODUCTS_PREVIEW_COUNT;

  useSeo({
    title: "Clinician-reviewed GLP-1 weight loss treatments",
    description:
      "Same active ingredients as the brand names, at a fair price — paired with a licensed clinician, dietitian and one clear price per order. Eligibility check in 2 minutes.",
    path: "/",
  });
  // FAQ rich-results schema, built from the same FAQ data shown on the page.
  useJsonLd("home-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 8).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });

  const delivery = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() + 4);
    const to = new Date();
    to.setDate(to.getDate() + 6);
    return `${fmtDate(from)} – ${fmtDate(to)}`;
  }, []);

  const marquee = [
    { icon: IconStethoscope, label: "Licensed clinicians" },
    { icon: IconTruck, label: "Free shipping" },
    { icon: IconLeaf, label: "Vyra Health professional care" },
    { icon: IconTag, label: "Clear pricing" },
    { icon: IconShield, label: "Lab-tested vials" },
    { icon: IconChat, label: "Real human support" },
  ];

  const valueChecks = [
    "Sourced from licensed facilities",
    "Vyra Health quality guarantee",
    "Discreet packaging & free delivery",
  ];

  const compareRows = [
    {
      label: "Active ingredient",
      vyra: "Tirzepatide / Retatrutide",
      other: "Tirzepatide / Semaglutide",
      check: false,
    },
    {
      label: "Format",
      vyra: "Lyophilised vial",
      other: "Pre-filled pen",
      check: false,
    },
    {
      label: "Route to get it",
      vyra: "2-min online quiz",
      other: "GP referral + pharmacy",
      check: true,
    },
    {
      label: "Clinician review",
      vyra: "Included",
      other: "Separate appointment",
      check: true,
    },
    {
      label: "Dietitian support",
      vyra: "Free",
      other: "Not included",
      check: true,
    },
  ];

  const steps = [
    {
      n: 1,
      title: "Take the 2-min quiz",
      text: "A few quick questions about your health and goals.",
      motif: "phone" as const,
      img: "/images/quiz.webp",
      ratio: "3 / 2",
    },
    {
      n: 2,
      title: "Choose your vial",
      text: "Pick the treatment that suits your goals.",
      motif: "desk" as const,
      img: "/images/vial.webp",
    },
    {
      n: 3,
      title: "Delivered to your door",
      text: "Discreet packaging — fast and free.",
      motif: "door" as const,
      img: "/images/deliver.webp",
    },
  ];

  const stats = [
    { num: 18, decimals: 0, unit: "%", label: "Average weight loss" },
    { num: 9, decimals: 0, unit: "/10", label: "Would recommend to a friend" },
    { num: 6.5, decimals: 1, unit: "″", label: "Average waist reduction" },
    { num: 93, decimals: 0, unit: "%", label: "Kept the weight off" },
  ];

  const science = [
    { icon: IconFlask, title: "Lab-tested & verified", sub: "≥99% purity" },
    { icon: IconChat, title: "Ongoing support", sub: "Real humans" },
    { icon: IconShield, title: "Quality assured", sub: "Licensed facilities" },
    { icon: IconClock, title: "24-hr dispatch", sub: "Where possible" },
  ];

  return (
    <div className="home">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero__inner">
          <motion.div
            className="hero__copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="hero__title">
              Weight loss,
              <br />
              <span className="serif-i">made easy.</span>
            </h1>
            <p className="hero__sub">
              Same active ingredients as the brand names, at a fair price.
              Paired with a clinician, dietitian and one clear price per order.
              Eligibility check in 2 minutes.
            </p>

            <div className="hero__pills">
              <span className="hero__pill">
                <IconTag size={15} /> From $35
              </span>
              <span className="hero__pill">
                <IconTruck size={15} /> Free shipping
              </span>
              <span className="hero__pill">
                <IconShield size={15} /> Secure payment
              </span>
            </div>

            <div className="hero__cta">
              <LinkButton to="/quiz" size="lg" arrow>
                Take the 2-min quiz
              </LinkButton>
              <span className="hero__cta-note">
                <strong>Free</strong> · No commitment
              </span>
            </div>

            <div className="hero__order">
              <span className="hero__order-dot" />
              <strong>Order now</strong> · get it by{" "}
              <span className="serif-i hero__order-date">{delivery}</span> with
              free UK delivery
            </div>
          </motion.div>

          <motion.div
            className="hero__media"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.4, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.div
              className="hero__media-inner"
              initial={{ scale: 1.08, y: -18 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <SmartImage
                src="/images/hero2.webp"
                alt="A Vyra Health member at home"
                motif="portrait"
                ratio="4 / 5"
                radius="var(--radius-xl)"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="container">
          <Reveal className="hero__quote">
            <StarRow size={17} />
            <p>
              “Vyra Health made the whole process feel genuinely simple. I finally feel
              like I'm on the right track.”
            </p>
            <span className="hero__quote-by">Sarah M. · Verified customer</span>
          </Reveal>
        </div>
      </section>

      {/* ============ TRUST MARQUEE ============ */}
      <section className="marquee" aria-label="What's included">
        <div className="marquee__track">
          {[...marquee, ...marquee].map((m, i) => {
            const Icon = m.icon;
            return (
              <span className="marquee__item" key={i}>
                <Icon size={18} /> {m.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* ============ VALUE CARDS ============ */}
      <section className="section container">
        <div className="value">
          <Reveal className="value__card value__card--sage">
            <span className="value__icon value__icon--green">
              <IconStethoscope size={26} />
            </span>
            <h3>Clinician-led</h3>
            <p>
              Every order is reviewed by a qualified clinician before it ships.
              No prescription gymnastics, no waiting rooms.
            </p>
          </Reveal>

          <Reveal className="value__card value__card--tan" index={1}>
            <span className="value__icon value__icon--gold">
              <IconTag size={26} />
            </span>
            <h3>Best value</h3>
            <p>
              The same active ingredients as the leading branded pens, sourced
              from licensed facilities and sold without the brand markup.
            </p>
            <span className="value__big serif-i">up to 80% less</span>
          </Reveal>
        </div>

        <div className="value__checks">
          {valueChecks.map((c, i) => (
            <Reveal as="div" key={c} index={i} className="value__check">
              <span className="value__check-dot">
                <IconCheck size={14} />
              </span>
              {c}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ COMPARISON ============ */}
      <section className="section container">
        <div className="compare">
          <Reveal className="compare__copy" from="right">
            <h2>
              Why is it <span className="serif-i">so much cheaper?</span>
            </h2>
            <p>
              Branded pens charge a premium for the brand name and the device.
              Our treatments contain the <strong>exact same active
              ingredient</strong>, prepared at licensed compounding facilities
              and purity-tested to ≥99% — supplied in a vial instead of a pen.
            </p>
            <p>
              Same medicine. Same results. Up to <strong>80% less</strong>. And
              every order is still reviewed by a qualified clinician before it
              ships.
            </p>
            <span className="compare__tag">
              <IconCheck size={15} /> Lab-tested · clinician-reviewed
            </span>
          </Reveal>

          <Reveal className="compare__table" from="left" index={1}>
            <div className="ctable">
              <div className="ctable__cell ctable__label ctable__label--head" />
              <div className="ctable__cell ctable__vyra ctable__vyra--head">
                <Logo size={22} />
              </div>
              <div className="ctable__cell ctable__other ctable__other--head">
                Other branded pens
              </div>

              {compareRows.map((r) => (
                <Fragment key={r.label}>
                  <div className="ctable__cell ctable__label">{r.label}</div>
                  <div className="ctable__cell ctable__vyra">
                    {r.check && (
                      <IconCheck size={15} className="ctable__check" />
                    )}
                    {r.vyra}
                  </div>
                  <div className="ctable__cell ctable__other">{r.other}</div>
                </Fragment>
              ))}

              <div className="ctable__cell ctable__label">Typical price</div>
              <div className="ctable__cell ctable__vyra ctable__vyra--price">
                From $35
              </div>
              <div className="ctable__cell ctable__other ctable__other--price">
                $200+/mo
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="section bg-alt" style={{ scrollMarginTop: 80 }}>
        <div className="container">
          <Reveal className="section-head center">
            <h2>
              From quiz to your door, <span className="serif-i">in days.</span>
            </h2>
            <p>
              No clinics, no waiting rooms. Three simple steps from the comfort
              of home.
            </p>
          </Reveal>

          <div className="hp-steps">
            {steps.map((s, i) => (
              <Reveal className="hp-step" key={s.n} index={i}>
                <span className="hp-step__num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <SmartImage
                  src={s.img}
                  alt={s.title}
                  motif={s.motif}
                  ratio={("ratio" in s && s.ratio) || "16 / 11"}
                  radius="var(--radius-md)"
                  className="hp-step__img"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section id="numbers" className="section container" style={{ scrollMarginTop: 80 }}>
        <Reveal className="section-head center">
          <h2>
            Why are people choosing Vyra?{" "}
            <span className="serif-i">It just works.</span>
          </h2>
          <p>
            On average, members in the Vyra Health programme lose 15–20% of their body
            weight.
          </p>
        </Reveal>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal className="stats__card" key={s.label} index={i}>
              <span className="stats__value">
                <strong>
                  <Counter to={s.num} decimals={s.decimals} delay={i * 100} />
                </strong>
                <em>{s.unit}</em>
              </span>
              <span className="stats__label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ GOAL WEIGHT ============ */}
      <section className="section container">
        <Reveal className="goal">
          <div className="goal__copy">
            <h2>
              Want to reach your <span className="serif-i">goal weight</span>{" "}
              fast?
            </h2>
            <p>
              It's not magic, it's metabolic science. GLP-1 peptides regulate
              appetite and help you eat less, lose weight steadily and{" "}
              <strong>improve your metabolism</strong>.
            </p>
            <LinkButton to="/quiz" size="lg" variant="dark" arrow>
              Take the 2-min quiz
            </LinkButton>
          </div>
          <GoalWeightCard />
        </Reveal>
      </section>

      {/* ============ ONE PRICE ============ */}
      <section className="section">
        <div className="container">
          <div className="oneprice">
            <Reveal className="oneprice__list" from="right">
              <h2 className="oneprice__title">
                One price, <span className="serif-i">everything included.</span>
              </h2>
              <p className="oneprice__lede">
                No hidden fees, no subscription, no surprise charges. We do our
                part but the support is what makes it work.
              </p>
              {[
                [
                  "Affordable treatments",
                  "Tirzepatide, Retatrutide and recovery peptides in pre-filled pen form",
                ],
                [
                  "1:1 clinician guidance",
                  "Direct chat with a real clinician",
                ],
                [
                  "Free dietitian sessions",
                  "Ongoing nutrition coaching tailored to your goals",
                ],
                [
                  "Free, discreet delivery",
                  "Shipped fast in plain packaging",
                ],
              ].map(([t, s]) => (
                <div className="oneprice__item" key={t}>
                  <span className="oneprice__check">
                    <IconCheck size={14} />
                  </span>
                  <div>
                    <strong>{t}</strong>
                    <span>{s}</span>
                  </div>
                </div>
              ))}
              <LinkButton to="/quiz" size="lg" arrow>
                Take the 2-min quiz
              </LinkButton>
            </Reveal>
            <Reveal className="oneprice__media" from="left" index={1}>
              <SmartImage
                src="/images/one-price-image.webp"
                alt="Vyra Health treatment package"
                motif="package"
                ratio="1 / 1"
                radius="var(--radius-xl)"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="section container" style={{ scrollMarginTop: 80 }}>
        <Reveal className="section-head center">
          <h2>
            Choose your <span className="serif-i">vial.</span>
          </h2>
          <p>
            Same active ingredients as Ozempic® and Mounjaro®, without the
            brand name or the markup. We'll help you pick the right one for
            your goals.
          </p>
        </Reveal>
        <div className="home__products">
          {visibleProducts.map((p, i) => (
            <Reveal key={p.id} index={i}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        {hasMoreProducts && (
          <div className="home__products-cta">
            <button
              type="button"
              className="home__see-all"
              onClick={() => setShowAllProducts((v) => !v)}
              aria-expanded={showAllProducts}
            >
              {showAllProducts
                ? "Show fewer"
                : `See all ${products.length} treatments`}
            </button>
          </div>
        )}
      </section>

      {/* ============ SCIENCE ============ */}
      <section className="section container">
        <Reveal className="science">
          <div className="science__head">
            <h2>
              Backed by <span className="serif-i science__i">science.</span>
            </h2>
            <p>
              Every vial is held to the same standards as the branded versions
              — and often a higher one.
            </p>
          </div>
          <div className="science__grid">
            {science.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="div" className="science__card" key={s.title} index={i}>
                  <span className="science__icon">
                    <Icon size={24} />
                  </span>
                  <strong>{s.title}</strong>
                  <span className="science__sub">{s.sub}</span>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="section container" style={{ scrollMarginTop: 80 }}>
        <Reveal className="section-head center">
          <h2>
            People are <span className="serif-i">raving</span> about Vyra.
          </h2>
          <div className="hp-revscore">
            <StarRow size={14} />
            <strong>{reviewStats.average}</strong>
            <span>· {reviewStats.total.toLocaleString()} reviews</span>
          </div>
        </Reveal>
        <div className="hp-revmarquee">
          <div className="hp-revtrack">
            {(() => {
              const peopleImgs = [
                "/images/people1.webp",
                "/images/people2.webp",
                "/images/people3.webp",
                "/images/people4.webp",
                "/images/people5.webp",
              ];
              const trimmed = reviews.slice(0, peopleImgs.length);
              return [...trimmed, ...trimmed].map((r, i) => {
                const position = trimmed.findIndex((x) => x.id === r.id);
                const reviewImg = peopleImgs[position];
                return (
              <div className="hp-revslide" key={`${r.id}-${i}`}>
                <article className="hp-revcard">
                  <div className="hp-revcard__top">
                    <strong>{r.name}</strong>
                    <StarRow size={12} />
                  </div>
                  <p>“{r.quote}”</p>
                  <span className="hp-revcard__meta">{r.monthsIn} months in</span>
                </article>
                <div className="hp-revphoto">
                  <SmartImage
                    src={reviewImg}
                    alt={`${r.name} review portrait`}
                    motif="person"
                    ratio="1 / 1"
                    radius="var(--radius-lg)"
                  />
                </div>
              </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faqs" className="section bg-alt" style={{ scrollMarginTop: 80 }}>
        <div className="container container-narrow">
          <Reveal className="section-head center">
            <h2>
              Questions, <span className="serif-i">answered.</span>
            </h2>
          </Reveal>
          <Reveal>
            <Accordion items={faqs.slice(0, 6)} defaultOpen="f1" />
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section container">
        <Reveal>
          <div className="finalcta">
            <div className="finalcta__body">
              <h2>
                Start your <span className="serif-i">journey</span> in two
                minutes.
              </h2>
              <p>
                No commitment. No upfront fees. Just an honest medical
                assessment and a real plan if it's right for you.
              </p>
              <LinkButton to="/quiz" size="lg" arrow>
                Take the 2-min quiz
              </LinkButton>
            </div>
            <div className="finalcta__ring" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="finalcta__ring-svg">
                <defs>
                  <path
                    id="finalcta-ring-path"
                    d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                  />
                </defs>
                <text className="finalcta__ring-text">
                  <textPath href="#finalcta-ring-path">
                    vyra · vyra · vyra · vyra · vyra · vyra · vyra · vyra ·
                  </textPath>
                </text>
              </svg>
              <span className="finalcta__ring-center">vyra</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="refund" index={1}>
          <span className="refund__icon">
            <IconShield size={30} />
          </span>
          <h3>No-quibble first-order refund</h3>
          <p>
            If your first order isn't for you, send the unopened vial back
            within 30 days for a full refund. No forms, no follow-up calls.
          </p>
        </Reveal>

        <p className="home__disclaimer">
          <strong>Important:</strong>{" "}
          <em>
            Results may vary. You must be 18 or older to purchase. Always
            consult a qualified healthcare professional before starting any new
            health programme. This page is provided for informational purposes
            and is not a substitute for medical advice.
          </em>
        </p>
      </section>
    </div>
  );
}
