import { Link } from "react-router-dom";
import type { Doctor } from "../types";
import { LinkButton } from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import SmartImage from "../components/art/SmartImage";
import {
  IconArrow,
  IconCheck,
  IconHeart,
  IconShield,
  IconChat,
} from "../components/art/Icons";
import { doctors, dieticians } from "../data/doctors";
import "./Doctors.css";
import { useSeo } from "../lib/seo";

function TeamCard({ person, index }: { person: Doctor; index: number }) {
  return (
    <Reveal as="div" className="team__card" index={index % 3}>
      <SmartImage
        src={person.img}
        alt={person.name}
        motif="portrait"
        ratio="1 / 1"
        radius="0"
        className="team__photo"
      />
      <div className="team__body">
        <h3>{person.name}</h3>
        <span className="team__role">{person.role}</span>
        <span className="team__cred">{person.credentials}</span>
        <p>{person.bio}</p>
      </div>
    </Reveal>
  );
}

const approach = [
  {
    icon: IconCheck,
    title: "Evidence-based",
    text: "Every treatment we offer is backed by published clinical research and real-world patient outcomes.",
  },
  {
    icon: IconHeart,
    title: "Patient-first",
    text: "We only prescribe when it's clinically appropriate. If a treatment isn't right for you, we'll tell you honestly.",
  },
  {
    icon: IconShield,
    title: "Quality assured",
    text: "All treatments are compounded by licensed facilities under strict controls. Every batch is purity-tested.",
  },
  {
    icon: IconChat,
    title: "Always available",
    text: "Our clinical team is reachable by chat for ongoing support. No appointment needed, no waiting rooms.",
  },
];

export default function Doctors() {
  useSeo({
    title: "Our doctors & clinical team",
    description:
      "Meet the licensed clinicians and dietitians behind Vyra Health's weight-loss programme — the people who review every order.",
    path: "/doctors",
  });
  return (
    <div className="team">
      <div className="container team__back">
        <Link to="/">
          <IconArrow size={15} className="team__back-icon" /> Back to shop
        </Link>
      </div>

      <header className="container team__header">
        <Reveal>
          <h1>
            Meet our <span className="serif-i">team</span>
          </h1>
          <p>
            Every Vyra Health order is personally reviewed by our clinical team. With
            decades of combined experience in weight management, metabolic
            health and patient care, your treatment is in safe hands.
          </p>
        </Reveal>
      </header>

      <section className="container section-sm">
        <Reveal className="team__eyebrow">Our doctors</Reveal>
        <div className="team__grid">
          {doctors.map((d, i) => (
            <TeamCard key={d.id} person={d} index={i} />
          ))}
        </div>
      </section>

      <section className="container section-sm">
        <Reveal className="team__eyebrow">Our dietitians</Reveal>
        <div className="team__grid">
          {dieticians.map((d, i) => (
            <TeamCard key={d.id} person={d} index={i} />
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal className="center">
          <h2 className="team__approach-title">Our approach</h2>
        </Reveal>
        <div className="team__approach">
          {approach.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal
                as="div"
                className="team__approach-card"
                key={a.title}
                index={i % 2}
              >
                <span className="team__approach-icon">
                  <Icon size={20} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container section-sm">
        <Reveal>
          <div className="team__cta">
            <h2>
              Ready to <span className="serif-i">get started?</span>
            </h2>
            <p>
              Take the 2-minute eligibility quiz and one of our doctors will
              review your application.
            </p>
            <LinkButton to="/quiz" size="lg" arrow>
              Take the quiz
            </LinkButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
