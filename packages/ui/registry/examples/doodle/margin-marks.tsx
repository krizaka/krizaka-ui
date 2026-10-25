import { Doodle } from "@krizaka/ui/doodle";

// An arrow to the heading, a circled word and a wavy underline: marks in the flow, the words stay text.
export default function DoodleMarginMarks() {
  return (
    <div className="grid gap-5" style={{ maxWidth: 560 }}>
      <div className="flex items-end gap-2">
        <Doodle kind="arrow" flip place="inline" />
        <h2 className="m-0 text-[32px]" style={{ fontFamily: "var(--kz-font-display)" }}>Start here</h2>
      </div>
      <p className="m-0 text-lg">
        Tokens first, then components, and <Doodle kind="circle">nothing to copy</Doodle> between the products.
      </p>
      <p className="m-0 text-lg">
        Read the <Doodle kind="wave">published version</Doodle>, never a fork. <Doodle kind="star" place="inline" />
      </p>
    </div>
  );
}
