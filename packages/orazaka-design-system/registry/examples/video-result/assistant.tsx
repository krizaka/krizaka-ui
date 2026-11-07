import { VideoResult } from "@krizaka/orazaka-design-system";

// A clip without its command: the player, the prompt and the facts of the run, nothing else to copy.
export default function Assistant() {
  return (
    <VideoResult
      title="A night workshop where a holographic interface of orange light unfolds blueprints"
      sources={{
        mp4: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/assistant.8b571af009.mp4",
        webm: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/assistant.7311e0410e.webm",
        poster: "https://krizaka-assets.b-cdn.net/site/products/orazaka/gallery-video/assistant-poster.fc37abd8c7.webp",
      }}
      prompt="A genius engineer's workshop at night, a floating holographic interface of orange light blooms in mid-air and organises blueprints of a machine."
      facts={[
        { label: "Model", value: "Wan 2.2 A14B" },
        { label: "Seed", value: "20261011" },
        { label: "Frame", value: "832×480 · 16 fps · 5 s" },
      ]}
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
