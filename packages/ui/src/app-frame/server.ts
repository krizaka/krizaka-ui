/**
 * @krizaka/ui/app-frame/server — the frame's data and rules, with no React and no directive: usable in a Server Component
 * (the footers and the public bar read the shared vocabulary there). `navWords` (EN/FR), `navWord`, `publicBarLinks`, the
 * account menu's fixed order and `framePlaces`.
 */
export { ACCOUNT_LINK_IDS, ACCOUNT_MENU_ORDER, type AccountLinkId, frameIssues, type FramePlaces, framePlaces, type FrameSection, MAIN_SECTIONS_MAX, orderAccountLinks } from "./contract";
export { type NavLocale, navVocabulary, navWord, type NavWordKey, type NavWords, navWords, PUBLIC_BAR_MAX, type PublicBarLink, publicBarLinks,type PublicBarSlot } from "./vocabulary";
