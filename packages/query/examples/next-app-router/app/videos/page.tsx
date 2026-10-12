// A Server Component: the first screen is rendered with its data (LCP intact); Query takes over on the client.
import { KrizakaHydration } from "@krizaka/query/server";

import { videosQuery } from "../../lib/videos";
import { VideoList } from "./video-list";

export default function VideosPage() {
  return (
    <main>
      <KrizakaHydration queries={[videosQuery()]}>
        <VideoList />
      </KrizakaHydration>
    </main>
  );
}
