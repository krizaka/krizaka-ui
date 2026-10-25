import { marks } from "@krizaka/tokens/native";

/**
 * The elephant's geometry (200 × 200 view box, a pen line of 8, square caps, mitred joins — the Cahier grammar of the
 * marks and of @krizaka/icons: straight runs and 45° cuts, no rounded outline). It faces right. Two poses of one
 * animal: `standing`, the ear folded down beside the head, and `flying`, the ear spread up like a wing (the darija
 * joke: « l'éléphant avec ses oreilles, il peut voler »), the legs tucked, three lines of wind behind.
 *
 * The body and the trunk are sage, the ear and the wing sand: the two stops of Yororis' mark gradient (`marks.yororis`
 * of @krizaka/tokens), each ≥ 3:1 on the page surfaces of both themes. Flat colours: no glow, no gradient.
 */
export const SAND = marks.yororis[0]![1];
export const SAGE = marks.yororis[marks.yororis.length - 1]![1];

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const ELEPHANT = {
  viewBox: "0 0 200 200",
  stroke: 8,
  sand: SAND,
  sage: SAGE,
  /** The eye: one node, a filled dot. */
  eye: { cx: 154, cy: 66, r: 5 },
  standing: {
    /** Body, head and the two legs, one closed outline: straight runs and 45° cuts. */
    body: "M30 88 L44 74 H112 V54 L126 40 H158 L176 56 V100 L168 108 H132 V168 H108 V138 H62 V168 H38 V138 H30 Z",
    /** The trunk: down from the head's front, curling up at its tip. */
    trunk: "M164 108 V146 L172 158 H184 V144",
    /** The ear, folded down over the shoulder. */
    ear: "M116 52 L92 56 L84 100 L104 124 L128 112 Z",
    tail: "M30 90 L20 108 V118",
  },
  flying: {
    body: "M30 88 L44 74 H112 V54 L126 40 H158 L176 56 V100 L168 108 H132 V140 H108 V128 H62 V140 H38 V128 H30 Z",
    trunk: "M164 108 V142 L172 154 H184 V140",
    /** The ear, spread up and back: the wing. */
    ear: "M116 78 L120 30 L90 10 L78 34 L52 24 L56 52 L30 60 L66 84 Z",
    tail: "M30 90 L18 102 V112",
    wind: "M22 150 H50 M12 166 H44 M32 180 H58",
  },
  /** The flap: a few degrees around the shoulder, 1.6 s. */
  motion: { flap: 1.6, origin: "114px 80px", angle: 7 },
} as const;
