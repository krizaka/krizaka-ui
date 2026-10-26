import { PaperGrain, Section } from "@krizaka/ui/page";

// `kraft`: brown paper, its ink read at 7:1 on the darkest grain point in both themes. Mount `PaperGrain` once in the
// root layout (one inline SVG filter, a fixed seed, no image); without it the paper is flat, never broken.
export default function PageKraft() {
  return (
    <>
      <PaperGrain />
      <Section id="story" paper="kraft" spacing="sm" title="Our story" lead="Two walkers, one canal, and a notebook of the dogs we know by name." />
    </>
  );
}
