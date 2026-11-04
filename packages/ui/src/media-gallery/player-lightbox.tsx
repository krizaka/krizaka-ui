// Client. The lightbox's dialog and its player: loaded by `MediaPlayer` only when the poster is pressed.
import * as React from "react";

import { Dialog } from "../dialog";
import { VideoPlayer, type VideoPlayerProps } from "../video-player";
import { useCalm } from "./pausable-loop";

export type PlayerLightboxProps = {
  player: Omit<VideoPlayerProps, "aspectRatio" | "className">;
  ratio: string;
  closeLabel: string;
  onClose: () => void;
};

/** A frame taller than wide (`9 / 16`, `3 / 4`) takes the narrow dialog. */
function isPortrait(ratio: string): boolean {
  const [w, h] = ratio.split("/").map((n) => Number.parseFloat(n));
  return Boolean(w && h && w < h);
}

/** The open dialog holding the player, started by the press that opened it, except under reduced motion or Save-Data: it waits on the poster. */
export default function PlayerLightbox({ player, ratio, closeLabel, onClose }: Readonly<PlayerLightboxProps>) {
  const calm = useCalm();
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content size={isPortrait(ratio) ? "sm" : "lg"} closeLabel={closeLabel} className="bg-media p-0">
        <Dialog.Title className="sr-only">{player.title}</Dialog.Title>
        <VideoPlayer {...player} aspectRatio={ratio} playOnMount={!calm} pauseWhenHidden={false} />
      </Dialog.Content>
    </Dialog.Root>
  );
}
