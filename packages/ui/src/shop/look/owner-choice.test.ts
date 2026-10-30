import { shopPresets } from "@krizaka/tokens/shop-presets";
import { describe, expect, it } from "vitest";

import { applyCommand } from "../../shop-composer/commands";
import { parseShopPage, type ShopPage } from "../schema";
import { shopStarters } from "../starters";
import { applyLook, shopLookOf } from "./apply-look";
import { isAcceptedAccent, SHOP_OWNER_FACES, SHOP_OWNER_MOTIONS, shopFrameLook } from "./owner-choice";

const page = (over: Partial<ShopPage> = {}): ShopPage => ({ ...(structuredClone(Object.values(shopStarters)[0]) as ShopPage), preset: { id: "look-rue", version: 1 }, ...over });

describe("the owner's advanced choices over a look", () => {
  it("are closed lists: three title faces, four motion levels", () => {
    expect(SHOP_OWNER_FACES).toEqual(["serif", "sans", "poster"]);
    expect(SHOP_OWNER_MOTIONS).toEqual(["calm", "soft", "editorial", "lively"]);
  });

  it("the frame wears the look's own density and motion when the owner chose nothing (a host never forgets them)", () => {
    for (const look of shopPresets.filter((p) => p.id.startsWith("look-"))) {
      const frame = shopFrameLook({ preset: { id: look.id, version: look.version } });
      expect(frame, look.id).toEqual({ preset: look.id, density: look.density, motion: look.motion });
    }
  });

  it("the owner's face and motion level reach the frame as the CSS mode, the document's density wins over the look's", () => {
    expect(shopFrameLook({ preset: { id: "look-velours", version: 1 }, face: "sans", motion: "editorial", density: "compact" })).toEqual({ preset: "look-velours", density: "compact", face: "sans", motion: "paper" });
    expect(shopFrameLook({ preset: { id: "look-rue", version: 1 }, motion: "calm" }).motion).toBe("still");
  });

  it("an accent the look does not list never reaches the frame: the look's own tested accent is worn instead", () => {
    expect(isAcceptedAccent("look-rue", "orazaka")).toBe(true);
    expect(isAcceptedAccent("look-rue", "yomizaka")).toBe(false);
    expect(shopFrameLook({ preset: { id: "look-rue", version: 1 }, accent: "orazaka" }).accent).toBe("orazaka");
    expect(shopFrameLook({ preset: { id: "look-rue", version: 1 }, accent: "yomizaka" }).accent).toBeUndefined();
  });

  it("the document refuses an unknown look, a version that never shipped, an accent off the look's list, a face or a level off the lists", () => {
    expect(parseShopPage(page()).ok).toBe(true);
    expect(parseShopPage(page({ face: "poster", motion: "lively", accent: "orazaka" })).ok).toBe(true);
    const issues = (p: unknown) => {
      const r = parseShopPage(p);
      return r.ok ? [] : r.issues.map((i) => i.path);
    };
    expect(issues(page({ preset: { id: "look-neon", version: 1 } }))).toContain("preset.id");
    expect(issues(page({ preset: { id: "look-rue", version: 9 } }))).toContain("preset.version");
    expect(issues(page({ accent: "yomizaka" }))).toContain("accent");
    expect(issues({ ...page(), face: "comic" })).toContain("face");
    expect(issues({ ...page(), motion: "wild" })).toContain("motion");
  });

  it("the composer sets and clears the face and the level; a look change keeps them (they are the owner's) and forgets the accent", () => {
    const p = applyCommand(applyCommand(page(), { type: "setFace", face: "serif" }), { type: "setMotion", motion: "calm" });
    expect([p.face, p.motion]).toEqual(["serif", "calm"]);
    expect(applyCommand(p, { type: "setFace", face: "serif" })).toBe(p);
    const moved = applyLook({ ...p, accent: "orazaka" }, shopLookOf("look-atelier")!);
    expect([moved.face, moved.motion, moved.accent]).toEqual(["serif", "calm", undefined]);
    expect(applyCommand(p, { type: "setMotion", motion: undefined }).motion).toBeUndefined();
  });
});
