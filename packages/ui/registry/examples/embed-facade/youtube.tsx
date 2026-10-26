import { EmbedFacade } from "@krizaka/ui/embed-facade";

// Nothing is requested from YouTube until the visitor presses the button. The poster is the host's own copy.
export default function EmbedFacadeYoutube() {
  return (
    <div className="w-64 max-w-full">
      <EmbedFacade
        platform="youtube-shorts"
        url="https://www.youtube.com/shorts/abcDEF_-123"
        title="Latest reel"
        playLabel="Load YouTube and play"
        poster="https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.8133fbbaa5.jpg"
        notice="YouTube will receive your visit when you press play."
      />
    </div>
  );
}
