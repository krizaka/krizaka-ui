import { VideoResult } from "@krizaka/orazaka-design-system";
// Eric's tea-pour shot: the clip, its prompt, what the run recorded, how to make it again.
export default function TeaPour() {
  return (
    <VideoResult
      title="Mint tea pouring into an engraved glass in a Berber tent, steam in a shaft of golden light"
      sources={{
        mp4: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour.c4138c8ce9.mp4",
        webm: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour.b33e468733.webm",
        poster: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour-poster.8a062e63c2.webp",
      }}
      prompt="Extreme close-up, slow motion: a stream of amber mint tea pours from a silver teapot into a small engraved glass, steam curling through a shaft of golden-hour light inside a Berber tent."
      facts={[
        { label: "Model", value: "Wan 2.2 A14B" },
        { label: "Run by", value: "Orazaka · run 25948442" },
        { label: "Seed", value: "20261011" },
        { label: "Frame", value: "832×480 · 16 fps · 5 s" },
      ]}
      reproduce={
        'orazaka video "Extreme close-up, slow motion: a stream of amber mint tea pours…" \\\n  --model wan2-2-t2v-a14b --aspect 16:9 --seed 20261011'
      }
      downloadHref="https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour.c4138c8ce9.mp4"
      labels={{
        badge: "Video · 5 s",
        play: "Play",
        pause: "Pause",
        mute: "Mute",
        unmute: "Sound on",
        enlarge: "Open larger",
        close: "Close",
        prompt: "Prompt",
        facts: "The run",
        reproduce: "Reproduce it",
        copy: "Copy command",
        copied: "Command copied",
        download: "Download the clip",
      }}
    />
  );
}
