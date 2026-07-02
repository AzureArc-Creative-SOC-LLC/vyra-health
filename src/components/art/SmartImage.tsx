import { useEffect, useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";

type Motif =
  | "portrait"
  | "phone"
  | "desk"
  | "door"
  | "package"
  | "person"
  | "abstract";

interface SmartImageProps {
  /** path to the real image, e.g. "/images/hero.jpg" */
  src: string;
  alt: string;
  /** placeholder art shown until a real file exists at `src` */
  motif?: Motif;
  ratio?: string;
  radius?: string;
  className?: string;
  /** above-the-fold hero image — load eagerly with high priority for LCP */
  priority?: boolean;
  /** intrinsic pixel size — helps the browser reserve space (extra CLS guard) */
  width?: number;
  height?: number;
}

/* Renders a real <img>. If the file is missing (or fails to load) it
   falls back to the warm placeholder art — so the layout always looks
   complete, and dropping a file into /public/images "just works".
   No third-party images are bundled with this project. */

export default function SmartImage({
  src,
  alt,
  motif = "abstract",
  ratio = "4 / 3",
  radius = "var(--radius-lg)",
  className,
  priority = false,
  width,
  height,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <ImagePlaceholder
        motif={motif}
        ratio={ratio}
        radius={radius}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      // Priority images (hero/LCP) load eagerly and are fetched first; the
      // rest stay lazy + async so they never compete with above-the-fold work.
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "auto" : "async"}
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        aspectRatio: ratio,
        objectFit: "cover",
        borderRadius: radius,
        display: "block",
      }}
    />
  );
}
