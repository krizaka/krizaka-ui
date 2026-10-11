"use client";

import { VideoTrimmer } from "@krizaka/ui/video-trimmer";
import * as React from "react";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";
const FRAMES = ["alex-discover", "alex-story", "alex-bid", "elena-earnings", "elena-publish", "alex-unlock", "elena-live", "alex-back"].map((n) => `${TOUR}/${n}.jpg`);

// A 42-second clip: keep 12 seconds of it. Render the preview on commit, not on every move.
export default function VideoTrimmerFilmstrip() {
  const [kept, setKept] = React.useState<[number, number]>([8, 20]);
  return <VideoTrimmer duration={42} value={kept} onValueChange={setKept} frames={FRAMES} labels={{ kept: (length) => `${length} kept` }} />;
}
