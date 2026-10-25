import { call, type TauriBridge } from "./bridge";

export type UpdateChannel = "stable" | "beta";

export interface UpdateInfo {
  channel: UpdateChannel;
  /** The feed this channel reads, when the product has one. */
  feed: string | null;
}

export interface Updates {
  get(): Promise<UpdateInfo>;
  set(channel: UpdateChannel): Promise<UpdateInfo>;
}

/** The update channel on this Mac: `stable` unless the person chose `beta`. */
export function createUpdates(bridge: Pick<TauriBridge, "invoke">): Updates {
  return {
    get: () => call<UpdateInfo>(bridge, "update_channel"),
    set: (channel) => call<UpdateInfo>(bridge, "set_update_channel", { channel }),
  };
}
