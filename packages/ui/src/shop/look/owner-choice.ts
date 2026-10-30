// Pure. The owner's « advanced » choices over a look: an accent from the look's tested list, a title face and a motion level
// from closed lists of @krizaka/tokens (`shopOwnerChoices`). Every choice is proven safe where it is defined — the accents by the
// look's AA matrix, the faces by being the ones the page already loads, the motion levels by being CSS only and still under
// reduced motion — so a host never wires a look by hand: it hands `shopFrameLook(page)` to `ShopFrame`.
import { shopOwnerChoices, type ShopOwnerFace, type ShopOwnerMotion,shopPresets } from "@krizaka/tokens/shop-presets";

import type { ShopFrameProps } from "../frame";
import type { ShopPage } from "../schema";

/** The title faces an owner may choose (`serif` · `sans` · `poster`). */
export const SHOP_OWNER_FACES = Object.keys(shopOwnerChoices.faces) as ShopOwnerFace[];
/** The motion levels an owner may choose (`calm` · `soft` · `editorial` · `lively`), in that order. */
export const SHOP_OWNER_MOTIONS = Object.keys(shopOwnerChoices.motions) as ShopOwnerMotion[];

export type { ShopOwnerFace, ShopOwnerMotion };

/** What `ShopFrame` wears for a page: the look, and only the owner's choices the look allows. */
export type ShopFrameLook = Required<Pick<ShopFrameProps, "preset">> & Pick<ShopFrameProps, "density" | "accent" | "face" | "motion">;

/** The look preset a page names, or undefined for an unknown id. */
const presetOf = (id: string) => shopPresets.find((p) => p.id === id);

/** Whether an accent is in the tested list of a preset. */
export const isAcceptedAccent = (presetId: string, accent: string) => presetOf(presetId)?.accents.includes(accent) ?? false;

/**
 * The props of `ShopFrame` for a page: its preset and density, the accent when the look still lists it, the owner's title face,
 * and the motion — the owner's level, else the look's own. Never throws: a choice the look does not offer (an accent kept from
 * another look, an old document) falls back to the look's own, so the page always wears a tested combination.
 */
export function shopFrameLook(page: Pick<ShopPage, "preset" | "density" | "accent" | "face" | "motion">): ShopFrameLook {
  const preset = presetOf(page.preset.id);
  const accent = page.accent && isAcceptedAccent(page.preset.id, page.accent) ? page.accent : undefined;
  const face = page.face && page.face in shopOwnerChoices.faces ? page.face : undefined;
  const motion = page.motion && page.motion in shopOwnerChoices.motions ? shopOwnerChoices.motions[page.motion] : preset?.motion;
  return {
    preset: page.preset.id,
    density: page.density ?? preset?.density,
    ...(accent ? { accent } : {}),
    ...(face ? { face } : {}),
    ...(motion ? { motion } : {}),
  };
}
