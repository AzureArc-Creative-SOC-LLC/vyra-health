import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./HelpButton.css";

type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const SUGGESTIONS = [
  "Which product should I start with?",
  "What is Tirzepatide?",
  "How is this shipped?",
];

const INTRO: Msg = {
  id: "intro",
  from: "bot",
  text: "Hey! One of our clinicians will be with you shortly. Send a message to get started.",
};

/** Tiny rule-based reply engine — local stub that emulates an AI assistant. */
function generateReply(input: string): string {
  const q = input.toLowerCase().trim();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hi", "hello", "hey", "good morning", "good evening")) {
    return "Hi! Happy to help. Are you asking about a treatment, eligibility, dosing, or delivery?";
  }
  if (has("which product", "what should i start", "start with", "best for me", "recommend")) {
    return "Most members start with Semaglutide (£35 / 4 weeks) — it's the most studied GLP-1 and a gentle entry point. If you've used GLP-1s before and want stronger appetite control, Tirzepatide (£59) is the most-chosen. The 2-min quiz on our home page narrows it down for you.";
  }
  if (has("tirzepatide", "tirze")) {
    return "Tirzepatide is a dual GLP-1 / GIP agonist — it works on two appetite pathways for stronger, more sustained control. Starter dose is 2.5 mg / 4 weeks from £59. Clinician-titrated up to 10 mg.";
  }
  if (has("semaglutide", "sema")) {
    return "Semaglutide is the most studied GLP-1 receptor agonist. Starter dose 0.25 mg / 4 weeks from £35. Once-weekly injection, with a steady build-up overseen by a clinician.";
  }
  if (has("retatrutide", "reta")) {
    return "Retatrutide is a triple agonist (GLP-1 + GIP + Glucagon) — our strongest option, best after tolerating a GLP-1. From £40 / 4 weeks.";
  }
  if (has("cagrilintide", "cagri", "amylin")) {
    return "Cagrilintide acts on amylin (a different pathway) and pairs well with a GLP-1 to keep appetite steady between meals. From £70 / 4 weeks.";
  }
  if (has("ship", "deliver", "delivery", "post", "courier", "arrive")) {
    return "Free, discreet next-day delivery in plain packaging once your clinician approves your order. Most orders ship within 24 hours of approval.";
  }
  if (has("price", "cost", "how much", "fee", "subscription")) {
    return "Pricing starts at £35 / 4 weeks (Semaglutide starter) and includes the clinician review, dietitian sessions and delivery — no subscription, no hidden fees.";
  }
  if (has("refund", "return", "money back")) {
    return "First-order, no-quibble refund: send the unopened vial back within 30 days for a full refund. No forms, no follow-up calls.";
  }
  if (has("dose", "dosing", "schedule", "titration", "how often")) {
    return "Once-weekly self-administered injection. Your clinician sets a titration plan that builds up gradually — starter → build-up → maintenance → full strength.";
  }
  if (has("eligible", "eligibility", "qualify", "can i", "suitable", "right for")) {
    return "Take the 2-min quiz on our home page — it covers BMI, health history and goals, and a clinician reviews every answer before anything is dispensed.";
  }
  if (has("side effect", "safe", "risk", "nausea")) {
    return "GLP-1s are well-studied and generally well-tolerated. Mild nausea is the most common starter-dose effect and usually settles within a week. Your clinician walks you through managing anything that comes up.";
  }
  if (has("pregnant", "breastfeed", "breastfeeding")) {
    return "GLP-1 treatments aren't suitable during pregnancy or breastfeeding. Your safety is our first priority — the quiz will flag this for you.";
  }
  if (has("thank", "thanks", "cheers")) {
    return "Anytime! If you'd like a human clinician, hit 'Take the quiz' and we'll line one up.";
  }

  return "Good question — a clinician can answer that in detail. While we wait, you can take the 2-min quiz on the home page or ask me about Tirzepatide, Semaglutide, pricing, shipping or eligibility.";
}

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      from: "user",
      text: clean,
    };
    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setTyping(true);
    const reply = generateReply(clean);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `b-${Date.now()}`, from: "bot", text: reply },
      ]);
      setTyping(false);
    }, 650 + Math.min(reply.length * 12, 1400));
  }

  const showSuggestions = messages.length === 1 && !typing;

  return (
    <div className="help-fab">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat"
            className="help-chat"
            role="dialog"
            aria-label="Vyra Health chat"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="help-chat__head">
              <span className="help-chat__head-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4L12 3Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div className="help-chat__head-text">
                <strong>Vyra Health Clinician</strong>
                <span>Ask anything about our products</span>
              </div>
              <button
                className="help-chat__close"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="help-chat__scroll" ref={scrollRef}>
              {messages.map((m) =>
                m.from === "bot" ? (
                  <div className="help-chat__row help-chat__row--bot" key={m.id}>
                    <span className="help-chat__avatar">EC</span>
                    <div className="help-chat__bubble help-chat__bubble--bot">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="help-chat__row help-chat__row--user" key={m.id}>
                    <div className="help-chat__bubble help-chat__bubble--user">
                      {m.text}
                    </div>
                  </div>
                )
              )}

              {typing && (
                <div className="help-chat__row help-chat__row--bot">
                  <span className="help-chat__avatar">EC</span>
                  <div className="help-chat__bubble help-chat__bubble--bot help-chat__typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {showSuggestions && (
                <div className="help-chat__suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="help-chat__suggestion"
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="help-chat__form"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <input
                className="help-chat__input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about products, dosing, shipping..."
                aria-label="Message"
                autoComplete="off"
              />
              <button
                type="submit"
                className="help-chat__send"
                aria-label="Send"
                disabled={!draft.trim() || typing}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 11L21 3l-8 18-2-8-8-2Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="label"
            className="help-fab__label"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Need help? Ask our live doctors
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          className="help-fab__btn"
          aria-label="Open chat"
          aria-expanded={false}
          onClick={() => setOpen(true)}
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h16v11H9l-5 4V5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10.5h7M8.5 13h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
