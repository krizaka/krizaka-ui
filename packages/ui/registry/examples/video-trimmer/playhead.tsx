"use client";

import { VideoTrimmer } from "@krizaka/ui/video-trimmer";
import * as React from "react";

const FRAMES = ["alex-discover", "alex-story", "alex-bid", "elena-earnings", "elena-publish", "alex-unlock"].map((n) => `https://www.krizaka.com/assets/orochia/tour/${n}.jpg`);

// The playhead follows the video's time; a drag on the track (or its arrows) seeks within the part kept.
export default function VideoTrimmerPlayhead() {
  const [kept, setKept] = React.useState<[number, number]>([3, 24]);
  const [time, setTime] = React.useState(11.5);
  return <VideoTrimmer duration={30} value={kept} onValueChange={setKept} time={time} onSeek={setTime} frames={FRAMES} minLength={2} />;
}
