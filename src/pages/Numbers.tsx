import { motion } from "framer-motion";
import PageHeader from "../components/layout/PageHeader";
import CtaBand from "../components/CtaBand";
import Reveal from "../components/ui/Reveal";
import StarRating from "../components/ui/StarRating";
import Avatar from "../components/art/Avatar";
import {
  IconStethoscope,
  IconShield,
  IconTag,
  IconChat,
  IconFlask,
} from "../components/art/Icons";
import { numberStats, trustPoints } from "../data/content";
import { reviews, reviewStats } from "../data/reviews";
import { useSeo } from "../lib/seo";
import "./Numbers.css";

const trustIcons = [IconStethoscope, IconTag, IconShield, IconChat];

export default function Numbers() {
  useSeo({
    title: "The results, in numbers",
    description:
      "Real outcomes from Vyra Health members — average weight change, satisfaction scores and the data behind our clinician-led GLP-1 weight-loss programme.",
    path: "/numbers",
  });
  return (
    <div className="numbers">
      <PageHeader
        eyebrow="The numbers"
        title="Results you can actually look at"
        subtitle="Real figures from real members of this practice project. We show you exactly what these numbers mean — and how they were collected."
      />

      {/* ===================== STAT GRID ===================== */}
      <section className="section bg-green">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">At a glance</span>
              <h2>Figures that speak for themselves</h2>
            </Reveal>
          </div>
          <div className="numbers__stats">
            {numberStats.map((stat, i) => (
              <Reveal key={stat.label} index={i} className="numbers__stat">
                <strong className="numbers__stat-value">{stat.value}</strong>
                <span className="numbers__stat-label">{stat.label}</span>
                <span className="numbers__stat-sub">{stat.sub}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RATING BREAKDOWN ===================== */}
      <section className="section container">
        <div className="numbers__rating-wrap">
          {/* Average panel */}
          <Reveal from="right" className="numbers__rating-avg card">
            <span className="eyebrow">Overall rating</span>
            <div className="numbers__avg-score">
              <strong>{reviewStats.average}</strong>
              <span className="numbers__avg-slash">/&thinsp;5</span>
            </div>
            <StarRating value={reviewStats.average} size={26} />
            <p className="numbers__avg-total muted">
              Based on {reviewStats.total.toLocaleString()} verified reviews
            </p>
          </Reveal>

          {/* Breakdown bars */}
          <Reveal from="left" className="numbers__breakdown card">
            <span className="eyebrow">Rating breakdown</span>
            <div className="numbers__bars">
              {reviewStats.breakdown.map((row) => (
                <div key={row.stars} className="numbers__bar-row">
                  <span className="numbers__bar-label">{row.stars} star</span>
                  <div className="numbers__bar-track">
                    <motion.div
                      className="numbers__bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: (5 - row.stars) * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                  <span className="numbers__bar-pct">{row.pct}%</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== SELECTED REVIEWS ===================== */}
      <section className="section bg-alt">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">Member stories</span>
              <h2>Behind the numbers</h2>
              <p>
                Stats are only meaningful when there are real people behind
                them. Here are six members who chose to share their stories.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} index={i} className="numbers__review card">
                <StarRating value={review.rating} size={15} />
                <p className="numbers__review-quote">"{review.quote}"</p>
                <div className="numbers__review-foot">
                  <Avatar initials={review.initials} size={40} />
                  <div>
                    <strong>{review.name}</strong>
                    <span>
                      {review.location} · {review.product} · {review.lostLabel}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== METHODOLOGY ===================== */}
      <section className="section container">
        <div className="numbers__methodology-wrap">
          <Reveal className="numbers__methodology">
            <div className="section-head">
              <span className="eyebrow">Methodology & honesty</span>
              <h2>Where these numbers come from</h2>
            </div>
            <div className="numbers__methodology-body">
              <div className="numbers__method-block">
                <span className="numbers__method-icon">
                  <IconFlask size={20} />
                </span>
                <div>
                  <h3>Illustrative figures</h3>
                  <p>
                    All statistics on this page are invented for the purposes of
                    this practice project. They are not drawn from any real
                    clinical trial, real patient cohort, or real business. They
                    are intended to demonstrate the layout and design of a
                    data-rich page.
                  </p>
                </div>
              </div>
              <div className="numbers__method-block">
                <span className="numbers__method-icon">
                  <IconShield size={20} />
                </span>
                <div>
                  <h3>No misleading claims</h3>
                  <p>
                    We do not assert that these figures represent achievable
                    outcomes for any specific individual. Weight loss depends on
                    many individual factors. Any real GLP-1 clinic should
                    disclose the basis for statistics it publishes.
                  </p>
                </div>
              </div>
              <div className="numbers__method-block">
                <span className="numbers__method-icon">
                  <IconStethoscope size={20} />
                </span>
                <div>
                  <h3>Reviews</h3>
                  <p>
                    The member reviews shown throughout this site are entirely
                    fictional, written as placeholder copy. They do not reflect
                    the experience of any real person.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="left" className="numbers__context card">
            <p className="numbers__context-eyebrow eyebrow">Quick reference</p>
            <ul className="numbers__context-list">
              {[
                { label: "Members reviewed", note: "Fictional count — illustrative" },
                { label: "Average weight loss (6 mo)", note: "15–20% — illustrative benchmark" },
                { label: "Rating", note: "4.8★ from invented reviews" },
                { label: "Dispatch time", note: "72 hrs — illustrative target" },
                { label: "Batch purity", note: "≥99% — aspirational standard" },
                { label: "Cost saving", note: "80% vs branded — illustrative" },
              ].map((row) => (
                <li key={row.label} className="numbers__context-row">
                  <span className="numbers__context-key">{row.label}</span>
                  <span className="numbers__context-note muted">{row.note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ===================== TRUST POINTS ===================== */}
      <section className="section bg-alt">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">Why members trust Vyra Health</span>
              <h2>The reasons behind the rating</h2>
            </Reveal>
          </div>
          <div className="grid grid-4">
            {trustPoints.map((point, i) => {
              const Icon = trustIcons[i];
              return (
                <Reveal key={point.title} index={i} className="numbers__trust card">
                  <span className="numbers__trust-icon">
                    <Icon size={22} />
                  </span>
                  <h3 className="numbers__trust-title">{point.title}</h3>
                  <p className="numbers__trust-text">{point.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Convinced? Let's find your best treatment."
        text="Take the two-minute quiz and a clinician will confirm whether you're eligible and recommend the right option for you."
        buttonLabel="Start the free quiz"
        buttonTo="/quiz"
      />
    </div>
  );
}
