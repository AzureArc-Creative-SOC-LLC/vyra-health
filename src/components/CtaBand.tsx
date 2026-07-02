import { LinkButton } from "./ui/Button";
import Reveal from "./ui/Reveal";
import { IconArrow } from "./art/Icons";
import "./CtaBand.css";

interface CtaBandProps {
  title?: string;
  text?: string;
  buttonLabel?: string;
  buttonTo?: string;
}

/** Reusable closing call-to-action band for secondary pages. */
export default function CtaBand({
  title = "See if treatment is right for you",
  text = "The free eligibility quiz takes two minutes. A clinician reviews every answer — no commitment, no card needed.",
  buttonLabel = "Start the free quiz",
  buttonTo = "/quiz",
}: CtaBandProps) {
  return (
    <section className="section container">
      <Reveal>
        <div className="cta-band">
          <div className="cta-band__glow" aria-hidden="true" />
          <h2>{title}</h2>
          <p>{text}</p>
          <LinkButton to={buttonTo} size="lg" variant="light">
            {buttonLabel} <IconArrow size={18} />
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}
