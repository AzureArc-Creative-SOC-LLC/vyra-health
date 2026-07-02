import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import PageHeader from "../components/layout/PageHeader";
import Reveal from "../components/ui/Reveal";
import { IconChat, IconClock, IconCheck, IconShield } from "../components/art/Icons";
import { useSeo } from "../lib/seo";
import "./Contact.css";

interface FormState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const CONTACT_METHODS = [
  {
    icon: IconChat,
    title: "1:1 Clinician chat",
    description:
      "Active members can message a registered clinician directly from their account. Clinical queries are answered by a clinician, not a bot.",
    meta: "Available in your account",
  },
  {
    icon: IconClock,
    title: "Email support",
    description:
      "Send us a message at help@vyrahealth.example for billing, delivery and general questions. We aim to reply within one working day.",
    meta: "help@vyrahealth.example",
  },
  {
    icon: IconShield,
    title: "Response times",
    description:
      "General enquiries: within 1 working day. Clinical queries: within 4 hours during clinic hours. Urgent safety concerns are prioritised.",
    meta: "Mon – Fri, 9 am – 6 pm",
  },
  {
    icon: IconCheck,
    title: "Support hours",
    description:
      "Our team is online Monday to Friday, 9 am to 6 pm. Messages received outside these hours are answered first thing the next working day.",
    meta: "Mon – Fri, 9 am – 6 pm",
  },
];

const TOPICS = [
  "Eligibility question",
  "My order",
  "Treatment question",
  "Billing & payments",
  "Something else",
];

export default function Contact() {
  useSeo({
    title: "Contact us",
    description:
      "Get in touch with the Vyra Health team for help with your order, treatment or account.",
    path: "/contact",
  });
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.topic) errs.topic = "Please select a topic.";
    if (!form.message.trim()) errs.message = "Please write your message.";
    return errs;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="contact">
      <PageHeader
        eyebrow="Contact support"
        title="We're here to help"
        subtitle="Whether you have a clinical question, a delivery update or just need some guidance, our team is on hand."
      />

      {/* ===================== CONTACT METHODS ===================== */}
      <section className="section-sm bg-alt">
        <div className="container">
          <div className="grid grid-4">
            {CONTACT_METHODS.map((method, i) => {
              const Icon = method.icon;
              return (
                <Reveal key={method.title} index={i}>
                  <div className="contact__method card">
                    <span className="contact__method-icon">
                      <Icon size={22} />
                    </span>
                    <strong className="contact__method-title">{method.title}</strong>
                    <p className="contact__method-desc">{method.description}</p>
                    <span className="contact__method-meta tag tag-green">{method.meta}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CONTACT FORM ===================== */}
      <section className="section container">
        <div className="contact__form-wrap">
          <Reveal from="right" className="contact__form-copy">
            <span className="eyebrow">Send a message</span>
            <h2>Tell us what's on your mind</h2>
            <p className="lead">
              Fill in the form and we'll get back to you within one working day. Clinical queries
              go straight to a registered clinician.
            </p>
          </Reveal>

          <Reveal from="left">
            {submitted ? (
              <div className="contact__success card">
                <span className="contact__success-icon">
                  <IconCheck size={28} />
                </span>
                <h3>Message received</h3>
                <p>
                  Thanks, <strong>{form.name.split(" ")[0]}</strong> — we've got your message
                  and will reply to <strong>{form.email}</strong> within one working day.
                </p>
              </div>
            ) : (
              <form className="contact__form card" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="contact-name">Full name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                    aria-describedby={errors.name ? "contact-name-err" : undefined}
                  />
                  {errors.name && (
                    <span id="contact-name-err" className="error-text">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-describedby={errors.email ? "contact-email-err" : undefined}
                  />
                  {errors.email && (
                    <span id="contact-email-err" className="error-text">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-topic">Topic</label>
                  <select
                    id="contact-topic"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    aria-describedby={errors.topic ? "contact-topic-err" : undefined}
                  >
                    <option value="">Select a topic…</option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <span id="contact-topic-err" className="error-text">
                      {errors.topic}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what you need help with…"
                    value={form.message}
                    onChange={handleChange}
                    aria-describedby={errors.message ? "contact-message-err" : undefined}
                  />
                  {errors.message && (
                    <span id="contact-message-err" className="error-text">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="contact__submit">
                  Send message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
