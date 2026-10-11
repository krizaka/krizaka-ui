import { useEffect, useState } from "react";

export interface RotatingWordProps {
  /** The alternatives, passed translated; the first one is what the server renders. */
  words: readonly string[];
  /**
   * Milliseconds each word stays.
   * @default 2600
   */
  interval?: number;
  /** Classes for every word (a colour, gradient text). */
  className?: string;
}

/**
 * A word that rolls through alternatives — the Krizaka headline signature. Every word shares one grid cell from the
 * first paint, so the line keeps the width of the longest one (no layout shift); the current one rolls in. The server
 * render shows the first word; it stays put under prefers-reduced-motion and while the tab is hidden. Decorative
 * (`aria-hidden`): give the heading a stable accessible label.
 */
export function RotatingWord({ words, interval = 2600, className }: RotatingWordProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setI((k) => (k + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);
  return (
    <span aria-hidden className="kz-rotating">
      {words.map((word, k) => (
        <span key={word} data-active={k === i} className={className}>
          {word}
        </span>
      ))}
    </span>
  );
}
