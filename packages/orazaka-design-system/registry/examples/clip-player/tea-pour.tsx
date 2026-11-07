import { ClipPlayer } from "@krizaka/orazaka-design-system";

// Eric's tea-pour shot as a loop: it plays in view, the controls show on hover, a click opens it larger.
export default function TeaPour() {
  return (
    <div className="max-w-xl overflow-hidden rounded-2xl border border-border-default">
      <ClipPlayer
        title="Mint tea pouring into an engraved glass in a Berber tent"
        sources={{
          mp4: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour.c4138c8ce9.mp4",
          webm: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour.b33e468733.webm",
          poster:
            "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/tea-pour-poster.8a062e63c2.webp",
        }}
        labels={{
          badge: "Video · 5 s",
          play: "Play",
          pause: "Pause",
          mute: "Mute",
          unmute: "Sound on",
          enlarge: "Open larger",
          close: "Close",
        }}
      />
    </div>
  );
}
