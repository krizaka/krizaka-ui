import { EmbedFacade } from "@krizaka/ui/embed-facade";
import { RetroTv } from "@krizaka/ui/retro-tv";

// The latest reel of a platform on the shop's television: the screen shows the facade, nothing loads before the click.
export default function RetroTvFacade() {
  return (
    <div className="w-72 max-w-full">
      <RetroTv title="Latest reel" channel="CH 3 · Plateau">
        <EmbedFacade platform="instagram" url="https://www.instagram.com/reel/C1abcDEF123/" title="Latest reel" playLabel="Load Instagram and play" />
      </RetroTv>
    </div>
  );
}
