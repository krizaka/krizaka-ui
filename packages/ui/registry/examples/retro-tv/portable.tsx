import { RetroTv } from "@krizaka/ui/retro-tv";

const TOUR = "https://www.krizaka.com/assets/orochia/tour";

export default function RetroTvPortable() {
  return <div className="w-72 max-w-full"><RetroTv variant="portable" title="Story: behind the scenes" src={`${TOUR}/alex-story.mp4`} poster={`${TOUR}/alex-story.jpg`} channel="CH 3 · Plateau" /></div>;
}
