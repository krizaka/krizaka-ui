"use client";

import { VideoPlayer } from "@krizaka/ui/video-player";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

// Your server signs a short-lived address for this viewer; it is asked on the first play, and again after an error.
async function signedAddress() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return `${TOUR}/elena-publish.mp4?token=demo&expires=300`;
}

export default function VideoPlayerSignedSource() {
  return <VideoPlayer title="Video: the creator studio" src={signedAddress} preload="none" poster={`${TOUR}/elena-publish.jpg`} />;
}
