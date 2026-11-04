import { Button } from "@krizaka/ui/button";
import { MediaPlayer } from "@krizaka/ui/media-player";
import * as React from "react";

const FILM = "https://krizaka-assets.b-cdn.net/org/v1/films/film/le-monde-de-krizaka-16x9.b1c7c4ee51.mp4";
const POSTER = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><rect width='800' height='450' fill='#1d3f6b'/></svg>")}`;

// The page's own button opens the lightbox (`trigger`); a second one drives it from outside (`open`), on a free 19 / 16 frame.
// Under reduced motion the dialog opens on the poster and waits for the press on play.
export default function MediaPlayerTriggerExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-wrap gap-3">
      <MediaPlayer mode="lightbox" src={FILM} poster={POSTER} title="Film: the world of Krizaka" trigger={(openIt) => <Button onClick={openIt}>Watch the film</Button>} />
      <Button variant="secondary" onClick={() => setOpen(true)}>Open from outside</Button>
      <MediaPlayer mode="lightbox" ratio="19 / 16" src={FILM} poster={POSTER} title="Film: the engine take" trigger={null} open={open} onOpenChange={setOpen} />
    </div>
  );
}
