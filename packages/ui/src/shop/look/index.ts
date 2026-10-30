/** @krizaka/ui/shop/look — `applyLook` (a look rewrites the variants of a page, never its content), the looks (`SHOP_LOOKS`), the owner's choices over a look (`shopFrameLook`: tested accent, title face, motion level) and the Krizaka look's birds (`mascotFor`, `ShopMascot`). Server-safe. */
export { applyLook, SHOP_LOOK_ORDER, SHOP_LOOKS, type ShopLookLike, shopLookOf } from "./apply-look";
export { MASCOT_SLOTS, mascotFor, ShopMascot } from "./mascots";
export { isAcceptedAccent, SHOP_OWNER_FACES, SHOP_OWNER_MOTIONS, type ShopFrameLook, shopFrameLook, type ShopOwnerFace, type ShopOwnerMotion } from "./owner-choice";
