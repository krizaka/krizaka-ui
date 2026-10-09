import { useEffect, useState } from "react";

import { cx } from "../cx";

/**
 * A word that rolls through alternatives — the Krizaka headline signature. The server render and the first client
 * render show the first word; under prefers-reduced-motion it stays put. Decorative (`aria-hidden`): give the
 * heading a stable accessible label.
 */
export function RotatingWord({ words, interval = 2600, className }: { words: readonly string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setI((k) => (k + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);
  return (
    <span aria-hidden className="kz-rotating">
      <span key={i} className={cx("kz-word", className)}>
        {words[i]}
      </span>
    </span>
  );
}
