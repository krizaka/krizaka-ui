// Server-safe. The window of a split hero (LandingPage, ProductPage): the product alive, framed as a plate with its caption bar.
import type * as React from "react";

/** The framed `figure` of a hero's visual; its bar (the caption) is decorative. */
export function HeroStage({ visual, label }: Readonly<{ visual: React.ReactNode; label?: React.ReactNode }>) {
  return (
    <figure className="kz-tpl-stage">
      <div className="kz-tpl-stage-bar" aria-hidden>
        {label && <span>{label}</span>}
      </div>
      {visual}
    </figure>
  );
}
