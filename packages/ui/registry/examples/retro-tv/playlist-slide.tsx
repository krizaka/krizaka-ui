import { RetroTv } from "@krizaka/ui/retro-tv";

const playlist = [
  { id: "film", title: "Film: the world of Krizaka", src: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.aa28980db3.mp4", poster: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.8133fbbaa5.jpg" },
  { id: "film-again", title: "Film: the world of Krizaka, again", src: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.aa28980db3.mp4", poster: "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.8133fbbaa5.jpg" },
];

export default function RetroTvPlaylistSlide() {
  return <div className="w-full max-w-4xl"><RetroTv title="Short videos" playlist={playlist} transition="slide" channel="CH 3 · Plateau" /></div>;
}
