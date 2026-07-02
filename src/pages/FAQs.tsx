import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";
import CtaBand from "../components/CtaBand";
import Reveal from "../components/ui/Reveal";
import Accordion from "../components/ui/Accordion";
import { IconChat } from "../components/art/Icons";
import { faqs } from "../data/faqs";
import { useSeo, useJsonLd } from "../lib/seo";
import "./FAQs.css";

const ALL_CAT = "All";

export default function FAQs() {
  useSeo({
    title: "Frequently asked questions",
    description:
      "Answers about eligibility, treatments, delivery, safety and pricing for Vyra Health's clinician-reviewed GLP-1 weight-loss programme.",
    path: "/faqs",
  });
  useJsonLd("faqs-page", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
  const categories = [ALL_CAT, ...Array.from(new Set(faqs.map((f) => f.category)))];
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CAT);

  const filteredFaqs = activeCategory === ALL_CAT
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  const accordionItems = filteredFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="faqs">
      <PageHeader
        eyebrow="Good to know"
        title="Questions, answered"
        subtitle="Everything you're likely to wonder about treatment, delivery, safety and billing — all in one place."
      />

      {/* ===================== CATEGORY FILTER ===================== */}
      <section className="section container container-narrow">
        <Reveal className="faqs__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faqs__filter-btn${activeCategory === cat ? " is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {/* ===================== ACCORDION ===================== */}
        <Reveal delay={0.05}>
          <Accordion items={accordionItems} defaultOpen={accordionItems[0]?.id} />
        </Reveal>

        {/* ===================== STILL NEED HELP ===================== */}
        <Reveal delay={0.1}>
          <div className="faqs__help card">
            <span className="faqs__help-icon">
              <IconChat size={26} />
            </span>
            <div className="faqs__help-copy">
              <h3>Still have a question?</h3>
              <p>
                Our support team usually responds within one working day. If your query is clinical,
                a registered clinician will answer directly.
              </p>
            </div>
            <Link to="/contact" className="faqs__help-link">
              Contact support
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </div>
  );
}
