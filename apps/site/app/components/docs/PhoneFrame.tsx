import { readFileSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import type { RegistryExample } from "@/lib/ui-registry";

/* A native example in a phone: the screenshot of its React Native story (both themes, the page's own shown) behind the
   glass of an iPhone or an Android phone. The stories are rendered at a phone's width (360 points) with 16 points of
   margin, so the picture is placed at that scale: a component story shows with its margins, a whole screen (`inset`)
   is cut to its own 360 points, edge to edge. Server Component. */

/** The width, in points, of the screen the stories are rendered on, and the margin around them. */
export const STORY_SCREEN = 360;
export const STORY_MARGIN = 16;

export function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

export function PhoneFrame({ example, os, alt, eager = false, inset = false }: { example: RegistryExample; os: "ios" | "android"; alt: string; eager?: boolean; inset?: boolean }) {
  const window = inset ? STORY_SCREEN : STORY_SCREEN + 2 * STORY_MARGIN;
  const shift = inset ? `${(-STORY_MARGIN / window) * 100}%` : "0";
  if (!example.screenshots) return null;
  const shot = (theme: "dark" | "light") => {
    const file = example.screenshots![theme].replace(/^examples\//, "");
    const size = pngSize(path.join(process.cwd(), "public", "ui-examples", file));
    return (
      <Image
        src={`/ui-examples/${file}`}
        alt={theme === "dark" ? alt : ""}
        aria-hidden={theme === "light" ? true : undefined}
        {...size}
        loading={eager ? "eager" : "lazy"}
        className={`kz-phone-shot kz-shot-${theme}`}
        style={{ width: `${(size.width / window) * 100}%`, marginLeft: shift, marginTop: shift }}
      />
    );
  };
  return (
    <figure className="kz-phone" data-os={os}>
      <div className="kz-phone-screen">
        <div className="kz-phone-status" aria-hidden>
          <span>9:41</span>
          <i />
        </div>
        <div className="kz-phone-content">
          {shot("dark")}
          {shot("light")}
        </div>
      </div>
    </figure>
  );
}

/** The height of an example's screenshot (0 without one): the richest story is the one a phone shows first. */
export const shotHeight = (example: RegistryExample) =>
  example.screenshots ? pngSize(path.join(process.cwd(), "public", "ui-examples", example.screenshots.dark.replace(/^examples\//, ""))).height : 0;
