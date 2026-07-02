import { motion } from "framer-motion";
import type { ReactNode } from "react";
import "./PageHeader.css";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  /** optional element rendered under the subtitle (buttons, meta…) */
  children?: ReactNode;
}

/** Consistent page-top hero band used across all secondary pages. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__glow" aria-hidden="true" />
      <div className="container page-header__inner">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="page-header__sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="page-header__extra"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
