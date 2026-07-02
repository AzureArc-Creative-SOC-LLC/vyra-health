import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./Accordion.css";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** id of item open by default */
  defaultOpen?: string;
}

/** Animated accordion used for FAQs. */
export default function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="accordion">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={`accordion__item ${open ? "is-open" : ""}`}
          >
            <button
              className="accordion__trigger"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className="accordion__icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  className="accordion__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
