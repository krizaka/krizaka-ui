import { ActionBar } from "@krizaka/ui/action-bar";

const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d={d} />
  </svg>
);
const repo = "https://github.com/krizaka/krizaka-java";

// `icons`: where room is short (the foot of a card) — the words are the accessible name and a tooltip on hover and focus.
export default function ActionBarIcons() {
  return (
    <ActionBar
      variant="icons"
      label="Talk about Krizaka Java"
      actions={[
        { href: `${repo}/discussions`, label: "Discuss", icon: glyph("M4 5h16v11H9l-5 4V5Z") },
        { href: `${repo}/issues/new?template=idea.yml`, label: "Propose", icon: glyph("M12 3v4M5 12H3m18 0h-2M8 17h8m-6 4h4M12 7a5 5 0 0 0-3 9h6a5 5 0 0 0-3-9Z") },
        { href: `${repo}/issues/new?template=bug.yml`, label: "Report a problem", icon: glyph("M12 4 2.5 20h19L12 4Zm0 6v4m0 3v.1") },
      ]}
    />
  );
}
