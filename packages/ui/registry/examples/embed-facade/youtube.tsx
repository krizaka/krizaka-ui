import { EmbedFacade } from "@krizaka/ui/embed-facade";

// Nothing is requested from YouTube until the visitor presses the button. The poster is the host's own copy (here inline;
// in an app, a picture of your own storage or CDN).
const POSTER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 16"><rect width="9" height="16" fill="#9fb8cc"/><path d="m0 16 4-8 2 4 1.5-2L9 16Z" fill="#2c5f8a"/></svg>')}`;

export default function EmbedFacadeYoutube() {
  return (
    <div className="w-64 max-w-full">
      <EmbedFacade
        platform="youtube-shorts"
        url="https://www.youtube.com/shorts/abcDEF_-123"
        title="Latest reel"
        playLabel="Load YouTube and play"
        poster={POSTER}
        notice="YouTube will receive your visit when you press play."
      />
    </div>
  );
}
