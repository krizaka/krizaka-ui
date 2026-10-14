import { Showcase } from "@krizaka/ui/showcase";

const SLIDES = [
  { id: "1", title: "Describe it", body: "Write what you want in a sentence." },
  { id: "2", title: "Generate it", body: "The model runs on your own machine." },
  { id: "3", title: "Reproduce it", body: "Every result keeps its prompt and its seed." },
];

// Any content in a slide; 4 s each, a slide effect, no loop back to the first. The pointer, a keyboard focus and a hidden tab hold it still.
export default function ShowcaseSlides() {
  return (
    <Showcase
      label="How it works"
      className="w-full max-w-md"
      items={SLIDES}
      getId={(s) => s.id}
      getTitle={(s) => s.title}
      interval={4000}
      transition="slide"
      loop={false}
      renderItem={(s) => <p className="m-0 rounded-xl border border-border-default bg-surface-1 p-6 text-fg">{s.body}</p>}
    />
  );
}
