"use client";

/* The one interactive moment of the home: the identity switch. The tiles are rendered by the server (static first);
   this only puts the stage under `.brand-<id>` (@krizaka/tokens/brands/scoped.css), so every live component re-skins at
   once — Krizaka is the default, without a class. */

import { format } from "@krizaka/i18n";
import { ProductLogo } from "@krizaka/ui";
import { Chip } from "@krizaka/ui/chip";
import { type ReactNode,useState } from "react";

export const IDENTITIES = [
  { id: "krizaka", name: "Krizaka" },
  { id: "orazaka", name: "Orazaka" },
  { id: "orochia", name: "Orochia" },
  { id: "yasakia", name: "Yasakia" },
  { id: "yororis", name: "Yororis" },
] as const;
type Identity = (typeof IDENTITIES)[number]["id"];

export function IdentityStage({ label, stageLabel, children }: { label: string; stageLabel: string; children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity>("krizaka");
  const name = IDENTITIES.find((i) => i.id === identity)?.name ?? "Krizaka";
  return (
    <>
      <Chip.Group type="single" required label={label} value={identity} onValueChange={(v) => v && setIdentity(v as Identity)} size="sm" className="kz-land-identities">
        {IDENTITIES.map((i) => (
          <Chip key={i.id} value={i.id}>
            <ProductLogo id={i.id} size={14} animated={false} />
            {i.name}
          </Chip>
        ))}
      </Chip.Group>
      <div className={identity === "krizaka" ? "kz-land-bento" : `kz-land-bento brand-${identity}`} role="group" aria-label={format(stageLabel, { brand: name })}>
        {children}
      </div>
    </>
  );
}
