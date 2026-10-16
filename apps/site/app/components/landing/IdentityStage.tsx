"use client";

/* The one interactive moment of the home: the identity switch. The tiles are rendered by the server (static first);
   this only puts the stage under `.brand-<id>` (@krizaka/tokens/brands/scoped.css), so every live component re-skins at
   once — Krizaka is the default, without a class. The switch is the stage's toolbar (sticky while the bento scrolls by):
   the identity worn, its two accents, its class, and the chips. On a change the new colours roll across the tiles in a
   wave and one band of light crosses the stage; under reduced motion the change is immediate (globals.css). */

import { format } from "@krizaka/i18n";
import { ProductLogo } from "@krizaka/ui";
import { Chip } from "@krizaka/ui/chip";
import { type ReactNode, useEffect, useRef, useState } from "react";

export const IDENTITIES = [
  { id: "krizaka", name: "Krizaka" },
  { id: "orazaka", name: "Orazaka" },
  { id: "orochia", name: "Orochia" },
  { id: "yasakia", name: "Yasakia" },
  { id: "yororis", name: "Yororis" },
  { id: "yomizaka", name: "Yomizaka" },
  { id: "kachizaka", name: "Kachizaka" },
  { id: "akinaza", name: "Akinaza" },
] as const;
type Identity = (typeof IDENTITIES)[number]["id"];

/** How long the colours take to roll across the stage (the last tile's delay + its transition), in ms. */
const WAVE_MS = 1100;

export function IdentityStage({ label, stageLabel, wearing, children }: { label: string; stageLabel: string; wearing: string; children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity>("krizaka");
  const [wave, setWave] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const name = IDENTITIES.find((i) => i.id === identity)?.name ?? "Krizaka";
  const choose = (next: Identity) => {
    if (next === identity) return;
    setIdentity(next);
    setWave((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWave(0), WAVE_MS);
  };
  return (
    <div className={identity === "krizaka" ? "kz-land-studio" : `kz-land-studio brand-${identity}`} data-identity={identity} data-switching={wave ? "" : undefined}>
      <div className="kz-land-switch">
        <div className="kz-land-now" aria-live="polite">
          <span className="kz-land-now-mark" key={identity}>
            <ProductLogo id={identity} size={30} />
          </span>
          <span className="kz-land-now-text">
            <span className="kz-land-now-label">
              {wearing} <code>{identity === "krizaka" ? ":root" : `.brand-${identity}`}</code>
            </span>
            <strong>{name}</strong>
          </span>
          <span className="kz-land-now-swatches" aria-hidden>
            <i />
            <i />
          </span>
        </div>
        <Chip.Group type="single" required label={label} value={identity} onValueChange={(v) => v && choose(v as Identity)} size="md" className="kz-land-identities">
          {IDENTITIES.map((i) => (
            <Chip key={i.id} value={i.id}>
              <ProductLogo id={i.id} size={16} animated={false} />
              {i.name}
            </Chip>
          ))}
        </Chip.Group>
      </div>
      <div className="kz-land-bento" role="group" aria-label={format(stageLabel, { brand: name })}>
        {wave > 0 && <span key={wave} className="kz-land-sweep" aria-hidden />}
        {children}
      </div>
    </div>
  );
}
