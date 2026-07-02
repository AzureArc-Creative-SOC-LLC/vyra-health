import { LinkButton } from "../components/ui/Button";
import { IconArrow } from "../components/art/Icons";
import { useSeo } from "../lib/seo";
import "./NotFound.css";

export default function NotFound() {
  useSeo({ title: "Page not found", description: "The page you're looking for doesn't exist.", noindex: true });
  return (
    <div className="notfound">
      <div className="notfound__glow" aria-hidden="true" />

      <div className="notfound__inner container">
        {/* decorative circles */}
        <div className="notfound__deco" aria-hidden="true">
          <span className="notfound__deco-ring notfound__deco-ring--lg" />
          <span className="notfound__deco-ring notfound__deco-ring--md" />
          <span className="notfound__deco-ring notfound__deco-ring--sm" />
        </div>

        <span className="notfound__code">404</span>
        <h1 className="notfound__heading">Nothing here, sorry</h1>
        <p className="notfound__message">
          The page you were looking for has moved, been removed or never existed.
          Let's get you back on track.
        </p>

        <div className="notfound__actions">
          <LinkButton to="/" size="lg">
            Back to home <IconArrow size={18} />
          </LinkButton>
          <LinkButton to="/quiz" size="lg" variant="secondary">
            Take the free quiz
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
