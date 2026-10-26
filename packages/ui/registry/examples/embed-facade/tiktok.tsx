import { EmbedFacade } from "@krizaka/ui/embed-facade";

// TikTok, in French: the words are the host's. Without a poster the gate is plain paper.
export default function EmbedFacadeTiktok() {
  return (
    <div className="w-64 max-w-full">
      <EmbedFacade
        platform="tiktok"
        url="https://www.tiktok.com/@cedre.ciseaux/video/7301234567890123456"
        title="Dernier reel du salon"
        playLabel="Charger TikTok et lire"
        notice="TikTok saura que vous avez ouvert cette vidéo."
      />
    </div>
  );
}
