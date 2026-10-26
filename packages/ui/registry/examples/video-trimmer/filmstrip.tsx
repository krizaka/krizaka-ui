"use client";

import { VideoTrimmer } from "@krizaka/ui/video-trimmer";
import * as React from "react";

// Frames of the Krizaka films on the CDN (hashed: a URL never changes content).
const FRAMES = [
  "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-16x9.f3ec7dbb08.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/film/le-monde-de-krizaka-9x16.8133fbbaa5.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/ambient/home-valley-16x9-dark.257f7e2c5d.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/ambient/home-valley-16x9-light.4e71f09920.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/ambient/home-valley-4x5-dark.b6f2a4ae2f.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/ambient/home-valley-4x5-light.31a0ae9e3a.jpg",
  "https://krizaka-assets.b-cdn.net/site/brand-films/epic/le-monde-de-krizaka-la-tournee-16x9.97d42bd916.jpg",
  "https://krizaka-assets.b-cdn.net/site/home/kit/challenge-v.7f6f208377.jpg",
];

// A 42-second clip: keep 12 seconds of it. Render the preview on commit, not on every move.
export default function VideoTrimmerFilmstrip() {
  const [kept, setKept] = React.useState<[number, number]>([8, 20]);
  return <VideoTrimmer duration={42} value={kept} onValueChange={setKept} frames={FRAMES} labels={{ kept: (length) => `${length} kept` }} />;
}
