import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { LinkButton } from "../components/ui/Button";
import { IconArrow } from "../components/art/Icons";
import "./RefundPolicy.css";
import { useSeo } from "../lib/seo";

/* All policy copy below is original placeholder text for this practice
   project — it is not legal advice and not a real refund policy. */

interface Section {
  title: string;
  blocks: Array<
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
  >;
}

const sections: Section[] = [
  {
    title: "Overview",
    blocks: [
      {
        type: "p",
        text: "Vyra Health wants every member to feel confident ordering with us. This page explains when a refund is available, how to ask for one, and how long it takes. It applies to orders placed through this website.",
      },
      {
        type: "p",
        text: "Because treatments are reviewed by a clinician before they are dispensed, some situations are handled differently from ordinary retail returns. Those situations are set out below.",
      },
    ],
  },
  {
    title: "Eligibility for refunds",
    blocks: [
      { type: "p", text: "A refund or replacement may be available in the following situations:" },
      {
        type: "ul",
        items: [
          "Damaged or defective items — a vial that arrives damaged or fails a visible quality check.",
          "Incorrect item dispatched — you received something other than what you ordered.",
          "Order cancelled before dispatch — you cancelled before the order left our facility.",
          "Treatment declined — a clinician decides treatment is not suitable, so the medicine is never dispensed.",
        ],
      },
      {
        type: "p",
        text: "All other refund requests — including a change of mind once an order has shipped — are considered case by case and may not be possible.",
      },
    ],
  },
  {
    title: "Damaged or defective products",
    blocks: [
      {
        type: "p",
        text: "If your order arrives damaged or the product does not match its specification, contact us within 48 hours of receiving it. To help us resolve things quickly, please include:",
      },
      {
        type: "ul",
        items: [
          "Your order number",
          "A short description of the problem",
          "A clear photo showing the packaging, the medicine and any visible damage",
        ],
      },
      {
        type: "p",
        text: "Once a clinician or our care team has reviewed the report, we will arrange a free replacement or a full refund of the affected item. There is no need to return a damaged product before a resolution is offered.",
      },
    ],
  },
  {
    title: "Order cancellations",
    blocks: [
      {
        type: "p",
        text: "You can cancel an order at any time before it has been approved by a clinician and prepared for dispatch. Message our care team and, if the order has not yet moved to dispensing, we will cancel it and refund any amount paid in full.",
      },
      {
        type: "p",
        text: "Once an order has been dispensed it cannot be cancelled, because the treatment has already been prepared specifically for you.",
      },
    ],
  },
  {
    title: "Non-refundable items",
    blocks: [
      { type: "p", text: "Some items and situations are not normally refundable:" },
      {
        type: "ul",
        items: [
          "Opened or part-used vials, for safety reasons, unless the item was faulty",
          "A treatment dispensed correctly and matching your order, once it has shipped",
          "Delivery already completed for a change-of-mind request",
        ],
      },
      {
        type: "p",
        text: "These exclusions exist because medicines cannot be safely resold or reused once they have left our facility.",
      },
    ],
  },
  {
    title: "How to request a refund",
    blocks: [
      { type: "p", text: "To start a refund or replacement, get in touch with our care team:" },
      {
        type: "ul",
        items: [
          "Email help@vyrahealth.example with your order number",
          "Tell us what went wrong and, where relevant, attach photos",
          "We will confirm next steps, usually within one working day",
        ],
      },
      {
        type: "p",
        text: "We aim to acknowledge every refund request within one working day and to resolve it within three to five working days.",
      },
    ],
  },
  {
    title: "Refund timeline",
    blocks: [
      {
        type: "p",
        text: "Once a refund is approved, it is returned to your original payment method. Timings depend on the provider:",
      },
      {
        type: "ul",
        items: [
          "Card payments — typically three to five working days to appear on your statement",
          "Cancellations before dispatch — processed as soon as the cancellation is confirmed",
        ],
      },
      {
        type: "p",
        text: "If a refund has not reached you within ten working days of approval, contact us and we will investigate.",
      },
    ],
  },
  {
    title: "Exchanges",
    blocks: [
      {
        type: "p",
        text: "We do not operate a standard exchange programme for dispensed treatments. If you received the wrong item, or your clinician recommends a different treatment, we will arrange the correct item at no extra cost — a direct swap is not available for an item that has already been opened.",
      },
    ],
  },
  {
    title: "Contact us",
    blocks: [
      {
        type: "p",
        text: "Questions about this policy, or want to check on an existing request? Email help@vyrahealth.example and our care team will be glad to help. We usually reply within one working day.",
      },
    ],
  },
];

export default function RefundPolicy() {
  useSeo({
    title: "Refund policy",
    description:
      "Vyra Health's refund policy — how and when you can request a refund on your clinician-reviewed weight-loss treatment order.",
    path: "/refund-policy",
  });
  return (
    <div className="refund-page">
      <div className="container container-narrow refund-page__back">
        <Link to="/">
          <IconArrow size={15} className="refund-page__back-icon" /> Back to
          shop
        </Link>
      </div>

      <div className="container container-narrow refund-page__inner">
        <Reveal>
          <h1 className="refund-page__title">Refund Policy</h1>
        </Reveal>

        <Reveal>
          <div className="refund-page__callout">
            <strong>Important.</strong> This site is a practice / learning
            project — the text below is illustrative placeholder copy, not a
            real refund policy and not legal advice. No real orders or payments
            are processed here.
          </div>
        </Reveal>

        {sections.map((section, i) => (
          <Reveal as="section" className="refund-page__section" key={section.title}>
            <h2>
              <span className="refund-page__num">{i + 1}.</span> {section.title}
            </h2>
            {section.blocks.map((block, b) =>
              block.type === "p" ? (
                <p key={b}>{block.text}</p>
              ) : (
                <ul key={b}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </Reveal>
        ))}

        <Reveal className="refund-page__foot">
          <LinkButton to="/" variant="dark" size="lg">
            Back to shop
          </LinkButton>
        </Reveal>
      </div>
    </div>
  );
}
