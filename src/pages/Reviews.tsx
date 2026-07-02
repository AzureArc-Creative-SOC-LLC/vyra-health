import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import CtaBand from "../components/CtaBand";
import Reveal from "../components/ui/Reveal";
import StarRating from "../components/ui/StarRating";
import Avatar from "../components/art/Avatar";
import { IconCheck } from "../components/art/Icons";
import { reviews, reviewStats } from "../data/reviews";
import { useSeo } from "../lib/seo";
import "./Reviews.css";

const ALL_FILTER = "All";

export default function Reviews() {
  useSeo({
    title: "Member reviews",
    description:
      "Read verified reviews from Vyra Health members on their weight-loss journey, clinician support and delivery experience.",
    path: "/reviews",
  });
  const products = [ALL_FILTER, ...Array.from(new Set(reviews.map((r) => r.product)))];
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);

  const filtered =
    activeFilter === ALL_FILTER ? reviews : reviews.filter((r) => r.product === activeFilter);

  return (
    <div className="reviews">
      <PageHeader
        eyebrow="Member stories"
        title="Real people, real results"
        subtitle="Every review comes from a verified member. We don't filter, cherry-pick or incentivise reviews — just honest feedback."
      />

      {/* ===================== SUMMARY PANEL ===================== */}
      <section className="section-sm bg-alt">
        <div className="container">
          <Reveal>
            <div className="reviews__summary card">
              <div className="reviews__summary-score">
                <span className="reviews__summary-avg">{reviewStats.average}</span>
                <StarRating value={reviewStats.average} size={24} />
                <span className="reviews__summary-total">
                  {reviewStats.total.toLocaleString()} verified reviews
                </span>
              </div>

              <div className="reviews__summary-bars">
                {reviewStats.breakdown.map((row, i) => (
                  <div key={row.stars} className="reviews__bar-row">
                    <span className="reviews__bar-label">{row.stars} star</span>
                    <div className="reviews__bar-track">
                      <motion.div
                        className="reviews__bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.7,
                          delay: i * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>
                    <span className="reviews__bar-pct">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== FILTER ===================== */}
      <section className="section container">
        <Reveal className="reviews__filters">
          {products.map((p) => (
            <button
              key={p}
              className={`reviews__filter-btn${activeFilter === p ? " is-active" : ""}`}
              onClick={() => setActiveFilter(p)}
            >
              {p}
            </button>
          ))}
        </Reveal>

        {/* ===================== GRID ===================== */}
        <div className="grid grid-3 reviews__grid">
          {filtered.map((review, i) => (
            <Reveal key={review.id} index={i} as="div">
              <div className="reviews__card card">
                <div className="reviews__card-top">
                  <Avatar initials={review.initials} accent={undefined} size={44} />
                  <div>
                    <strong className="reviews__card-name">{review.name}</strong>
                    <span className="reviews__card-location muted">{review.location}</span>
                  </div>
                </div>

                <StarRating value={review.rating} size={15} />

                <p className="reviews__card-meta muted">
                  {review.lostLabel} · {review.monthsIn}{" "}
                  {review.monthsIn === 1 ? "month" : "months"} in
                </p>

                <blockquote className="reviews__card-quote">"{review.quote}"</blockquote>

                <div className="reviews__card-foot">
                  <span className="tag tag-green reviews__card-product">{review.product}</span>
                  {review.verified && (
                    <span className="reviews__card-verified">
                      <IconCheck size={12} /> Verified purchase
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Ready to start your own story?"
        text="Take the free two-minute quiz and a clinician will review your answers within 24 hours."
        buttonLabel="Start the free quiz"
      />
    </div>
  );
}
