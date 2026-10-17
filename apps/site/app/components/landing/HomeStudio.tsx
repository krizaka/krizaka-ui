"use client";

/* The identity of the home: one choice (Orazaka, Orochia, Yomizaka, Krizaka) worn by everything inside — the device
   scene, the playground, the families — through `.brand-<id>` of @krizaka/tokens. The choice is a dock that floats at
   the bottom of the screen while these sections are in view (sticky at the end of the studio), with the two ways in
   beside it: no scrolling back up to switch. On a switch the colours roll over in a wave and one band of the brand's
   light crosses the scene; under reduced motion the change is immediate (globals.css « The home »). */

import { ProductLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import Link from "next/link";
import { createContext, type KeyboardEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";

import { SCENE_IDS, type SceneId } from "@/lib/home-scene";

const IdentityContext = createContext<{ id: SceneId; wave: number }>({ id: "orazaka", wave: 0 });
export const useIdentity = () => useContext(IdentityContext);

const NAMES: Record<SceneId, string> = { orazaka: "Orazaka", orochia: "Orochia", yomizaka: "Yomizaka", krizaka: "Krizaka" };
const WAVE_MS = 1100;

export interface DockWords {
  label: string;
  taglines: Record<SceneId, string>;
  start: string;
  browse: string;
  startHref: string;
  browseHref: string;
}

export function HomeStudio({ words, children }: { words: DockWords; children: ReactNode }) {
  const [id, setId] = useState<SceneId>("orazaka");
  const [wave, setWave] = useState(0);
  const [switching, setSwitching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (next: SceneId) => {
    if (next === id) return;
    setId(next);
    setWave((n) => n + 1);
    setSwitching(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSwitching(false), WAVE_MS);
  };
  const move = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = SCENE_IDS[(index + step + SCENE_IDS.length) % SCENE_IDS.length]!;
    choose(next);
    (event.currentTarget.parentElement?.querySelector(`[data-id="${next}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <IdentityContext.Provider value={{ id, wave }}>
      <div className={id === "krizaka" ? "kz-home-studio" : `kz-home-studio brand-${id}`} data-identity={id} data-switching={switching ? "" : undefined}>
        {children}
        <div className="kz-dock" role="region" aria-label={words.label}>
          <div className="kz-dock-ids" role="radiogroup" aria-label={words.label}>
            {SCENE_IDS.map((each, index) => (
              <button
                key={each}
                type="button"
                role="radio"
                data-id={each}
                aria-checked={id === each}
                tabIndex={id === each ? 0 : -1}
                onClick={() => choose(each)}
                onKeyDown={(event) => move(event, index)}
              >
                <ProductLogo id={each} size={22} animated={false} />
                <span>
                  {NAMES[each]}
                  <small>{words.taglines[each]}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="kz-dock-actions">
            <Button asChild variant="primary" shape="cut" size="sm">
              <Link href={words.startHref}>{words.start}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="kz-dock-browse">
              <Link href={words.browseHref}>{words.browse}</Link>
            </Button>
          </div>
        </div>
      </div>
    </IdentityContext.Provider>
  );
}

/** The band of light that crosses the scene on a switch (remounted by its key). */
export function SceneSweep() {
  const { wave } = useIdentity();
  return wave > 0 ? <span key={wave} className="kz-land-sweep" aria-hidden /> : null;
}
