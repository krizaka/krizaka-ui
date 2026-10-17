import { readFileSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import type { RegistryExample } from "@/lib/ui-registry";

/* A native example in a phone: the screenshot of its React Native story (both themes, the page's own shown) behind the
   glass of an iPhone or an Android phone. The story is rendered at a phone's width (360 points from its left edge), so
   the picture is placed at that scale: what the frame shows is what a 360-point screen shows. Server Component. */

/** The width, in points, of the screen the stories are rendered on. */
export const STORY_SCREEN = 360;

export function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

export function PhoneFrame({ example, os, alt, eager = false }: { example: RegistryExample; os: "ios" | "android"; alt: string; eager?: boolean }) {
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
        style={{ width: `${(size.width / STORY_SCREEN) * 100}%` }}
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
