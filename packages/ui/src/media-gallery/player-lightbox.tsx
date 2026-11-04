// Client. The lightbox's dialog and its player: loaded by `MediaPlayer` only when the poster is pressed.
import * as React from "react";

import { Dialog } from "../dialog";
import { usePrefersReducedMotion } from "../media";
import { VideoPlayer, type VideoPlayerProps } from "../video-player";

export type PlayerLightboxProps = {
  player: Omit<VideoPlayerProps, "aspectRatio" | "className">;
  ratio: string;
  vertical: boolean;
  closeLabel: string;
  onClose: () => void;
};

/** The open dialog holding the player, started by the press that opened it, except under reduced motion: it waits on the poster. */
export default function PlayerLightbox({ player, ratio, vertical, closeLabel, onClose }: Readonly<PlayerLightboxProps>) {
  const calm = usePrefersReducedMotion();
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content size={vertical ? "sm" : "lg"} closeLabel={closeLabel} className="bg-media p-0">
        <Dialog.Title className="sr-only">{player.title}</Dialog.Title>
        <VideoPlayer {...player} aspectRatio={ratio} playOnMount={!calm} pauseWhenHidden={false} />
      </Dialog.Content>
    </Dialog.Root>
  );
}
