import { Doodle } from "@krizaka/ui/doodle";

// An arrow to the heading, a circled word and a wavy underline: marks in the margin, the words stay text.
export default function DoodleMarginMarks() {
  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <Doodle kind="arrow" flip />
        <h2 style={{ margin: 0, fontFamily: "var(--kz-font-display)", fontSize: 32 }}>Start here</h2>
      </div>
      <p style={{ margin: 0, fontSize: 18 }}>
        Tokens first, then components, and <Doodle kind="circle">nothing to copy</Doodle> between the products.
      </p>
      <p style={{ margin: 0, fontSize: 18 }}>
        Read the <Doodle kind="underline">published version</Doodle>, never a fork. <Doodle kind="stars" />
      </p>
    </div>
  );
}
