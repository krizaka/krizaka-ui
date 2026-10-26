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
];

// The playhead follows the video's time; a drag on the track (or its arrows) seeks within the part kept.
export default function VideoTrimmerPlayhead() {
  const [kept, setKept] = React.useState<[number, number]>([3, 24]);
  const [time, setTime] = React.useState(11.5);
  return <VideoTrimmer duration={30} value={kept} onValueChange={setKept} time={time} onSeek={setTime} frames={FRAMES} minLength={2} />;
}
