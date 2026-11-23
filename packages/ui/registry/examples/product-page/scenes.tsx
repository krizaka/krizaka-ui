import { SceneList } from "@krizaka/ui/product-page";

// The scenes: one useful action each, its recording beside a few words, alternating; the first enlarged on a phone.
const poster = "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg";
const sources = { mp4: "https://krizaka-assets.b-cdn.net/org/v1/films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4" };

export default function SceneListExample() {
  return (
    <SceneList
      labels={{ pause: "Pause the scene", play: "Play the scene" }}
      scenes={[
        { id: "binder", title: "The file, in order.", line: "Every document in one place.", device: "browser", poster, sources, width: 16, height: 9, focus: { x: 0.3, y: 0.4, zoom: 1.8 } },
        { id: "mac", title: "Also on the Mac.", line: "The same files, offline.", device: "desktop", poster, sources, width: 16, height: 9 },
      ]}
    />
  );
}
