import { Doodle } from "@krizaka/ui/doodle";
import { SiteCahier, SiteCahierDoc } from "@krizaka/ui/site-cahier";

// TEMPLATE — a documentation page of the TypeScript site, the pigeon's: ruled paper, a reading column, its contents beside it.
export default function SiteCahierTsDoc() {
  return (
    <SiteCahier site="ts" name="Krizaka TypeScript" bird="pigeon" hue={200} nav={[{ href: "/guides", label: "Guides", current: true }, { href: "/api", label: "API" }]} footer={{ version: "0.8.0" }}>
      <SiteCahierDoc
        eyebrow="Guide · 4 min"
        title="Typed results, no exceptions"
        aside={
          <ol style={{ margin: 0, paddingInlineStart: 18 }}>
            <li><a href="#why">Why</a></li>
            <li><a href="#use">Use it</a></li>
          </ol>
        }
      >
        <h2 id="why">Why</h2>
        <p>
          A function that can fail says so in its type: <Doodle kind="circle">a result</Doodle>, never a surprise.
        </p>
        <h2 id="use">Use it</h2>
        <p>Return <code>ok(value)</code> or <code>fail(error)</code>; the caller must look at both.</p>
      </SiteCahierDoc>
    </SiteCahier>
  );
}
