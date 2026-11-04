import { MediaPlayer } from "@krizaka/ui/media-player";

const POSTER = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><rect width='800' height='450' fill='#1d3f6b'/></svg>")}`;

// One player, three ways: a lightbox (a press opens it, with sound), inline, and vertical 9:16 in a lightbox.
export default function MediaPlayerExample() {
  return (
    <div className="grid max-w-2xl grid-cols-[2fr_1fr] items-start gap-3">
      <MediaPlayer mode="lightbox" src="/film.mp4" poster={POSTER} title="Film: the world of Krizaka" playLabel="Play the film" caption="Fig. 1" />
      <MediaPlayer mode="lightbox" vertical src="/film-9x16.mp4" poster={POSTER} title="Film: the world of Krizaka, vertical" playLabel="Play the vertical film" />
    </div>
  );
}
