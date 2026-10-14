import { Button } from "@krizaka/ui/button";
import { Showcase, useTypedText } from "@krizaka/ui/showcase";

const CDN = "https://krizaka-assets.b-cdn.net/site/people/ui";
const SHOTS = [
  { id: "a", title: "Golden-hour editorial", prompt: "A woman on a rooftop at golden hour, soft rim light, 85mm.", src: `${CDN}/camille-512.9573eaa0b8.webp` },
  { id: "b", title: "Sunday market", prompt: "A man choosing peaches at a market stall, warm morning haze.", src: `${CDN}/tomas-256.7eaab80903.webp` },
  { id: "c", title: "Backstage", prompt: "A singer in a dressing-room mirror, tungsten bulbs, grain.", src: `${CDN}/noor-256.c340c41421.webp` },
];

function Slide({ shot, active }: { shot: (typeof SHOTS)[number]; active: boolean }) {
  const typed = useTypedText(shot.prompt, { active });
  return (
    <div className="grid items-center gap-6 sm:grid-cols-2">
      <img src={shot.src} alt={shot.title} className="aspect-square w-full rounded-xl object-cover" />
      <div className="flex flex-col items-start gap-3">
        <p className="sr-only">{shot.prompt}</p>
        <p aria-hidden className="m-0 min-h-20 font-mono text-sm text-fg">{typed.text}</p>
        <Button variant="secondary" size="sm">Reproduce it</Button>
      </div>
    </div>
  );
}

// Image left, prompt and action right; the bar below fills over 6 s and moves on, every segment is a button.
export default function ShowcasePromptImage() {
  return <Showcase label="Prompt to image" className="w-full max-w-3xl" items={SHOTS} getId={(s) => s.id} getTitle={(s) => s.title} renderItem={(shot, { active }) => <Slide shot={shot} active={active} />} />;
}
