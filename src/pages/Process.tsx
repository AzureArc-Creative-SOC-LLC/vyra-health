import PageHeader from "../components/layout/PageHeader";
import CtaBand from "../components/CtaBand";
import Reveal from "../components/ui/Reveal";
import {
  IconStethoscope,
  IconShield,
  IconTag,
  IconChat,
  IconFlask,
  IconClock,
  IconTruck,
  IconHeart,
  IconCheck,
} from "../components/art/Icons";
import { processSteps, trustPoints } from "../data/content";
import { useSeo } from "../lib/seo";
import "./Process.css";

const stepIcons = [IconFlask, IconStethoscope, IconShield, IconTruck, IconHeart];

const trustIcons = [IconStethoscope, IconTag, IconShield, IconChat];

const reassuranceItems = [
  {
    icon: IconStethoscope,
    heading: "Every order is read by a real clinician",
    body: "No algorithm decides your treatment. A registered clinician reads your quiz answers, reviews your health history, and either approves your order or flags a concern — usually within 24 hours.",
  },
  {
    icon: IconChat,
    heading: "Questions answered within hours",
    body: "Your clinician's message thread stays open throughout your treatment. Ask about side effects, titration, or anything in between — the average response time is under four hours.",
  },
  {
    icon: IconHeart,
    heading: "Dietitian support included",
    body: "Every member gets access to free 1:1 dietitian sessions. Whether you want help with meal structure, portion size, or maintaining progress after treatment, the sessions are yours to use.",
  },
];

export default function Process() {
  useSeo({
    title: "How Vyra Health works",
    description:
      "From a 2-minute eligibility quiz to clinician review, discreet delivery and ongoing dietitian support — see every step of the Vyra Health weight-loss process.",
    path: "/process",
  });
  return (
    <div className="process">
      <PageHeader
        eyebrow="How it works"
        title="From quiz to doorstep in five steps"
        subtitle="We've removed every unnecessary step between you and clinician-reviewed treatment. Here's exactly what happens from the moment you start your quiz."
      />

      {/* ===================== TIMELINE ===================== */}
      <section className="section container">
        <div className="process__timeline">
          {processSteps.map((step, i) => {
            const Icon = stepIcons[i] ?? IconFlask;
            return (
              <Reveal key={step.id} index={i} className="process__step">
                {/* Connecting line */}
                {i < processSteps.length - 1 && (
                  <span className="process__connector" aria-hidden="true" />
                )}
                <div className="process__node">
                  <span className="process__node-num">{step.id}</span>
                </div>
                <div className="process__step-card card">
                  <div className="process__step-icon">
                    <Icon size={22} />
                  </div>
                  <div className="process__step-body">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <span className="process__step-dur">
                      <IconClock size={13} />
                      {step.duration}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===================== WHAT'S INCLUDED ===================== */}
      <section className="section bg-alt">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">Every single order</span>
              <h2>What's included in your price</h2>
              <p>
                One number covers everything. There are no add-ons, no hidden
                renewal fees, and no courier surcharges.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-4">
            {trustPoints.map((point, i) => {
              const Icon = trustIcons[i];
              return (
                <Reveal key={point.title} index={i} className="process__trust card">
                  <span className="process__trust-icon">
                    <Icon size={22} />
                  </span>
                  <h3 className="process__trust-title">{point.title}</h3>
                  <p className="process__trust-text">{point.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== REASSURANCE ===================== */}
      <section className="section container">
        <div className="section-head center">
          <Reveal>
            <span className="eyebrow">Clinical oversight</span>
            <h2>Reviewed, supported, and never rushed</h2>
            <p>
              Every step of the journey is backed by a real clinical team. Here's
              what that looks like in practice.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-3">
          {reassuranceItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.heading} index={i} className="process__reassure card">
                <span className="process__reassure-icon">
                  <Icon size={20} />
                </span>
                <h3 className="process__reassure-heading">{item.heading}</h3>
                <p className="process__reassure-body">{item.body}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="process__checklist card">
          <p className="process__checklist-label eyebrow">
            At a glance — what you never have to worry about
          </p>
          <ul className="process__checklist-list">
            {[
              "Surprise renewal charges — order only when you're ready",
              "Unreviewed orders — every single one goes through a clinician",
              "Unknown sourcing — all treatments come from one licensed UK facility",
              "Going it alone — your care team is there for the whole journey",
              "Locked-in subscriptions — cancel or pause any time, no questions",
            ].map((item) => (
              <li key={item}>
                <IconCheck size={15} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaBand
        title="Ready to start your journey?"
        text="The eligibility quiz is free, takes two minutes, and has no commitment. A clinician will review your answers and guide you on the right next step."
        buttonLabel="Take the free quiz"
        buttonTo="/quiz"
      />
    </div>
  );
}
