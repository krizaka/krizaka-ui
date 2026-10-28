export type ShopGalleryLabels = {
  /** The tile's name: `Open photo 3 of 12: Two chairs by the window`. */
  open: (alt: string, position: number, total: number) => string;
  /** The last tile of the mosaic: `+ 8 photos`. */
  more: (count: number) => string;
  /** The phone strip's counter: `3 / 12`. */
  counter: (position: number, total: number) => string;
  previous: string;
  next: string;
  close: string;
  /** The lightbox's title, read by a screen reader: `Photos of the salon`. */
  title: (label: string) => string;
  /** The lightbox's position: `3 of 12`. */
  position: (position: number, total: number) => string;
};

export const shopGalleryLabels: ShopGalleryLabels = {
  open: (alt, position, total) => (alt ? `Open photo ${position} of ${total}: ${alt}` : `Open photo ${position} of ${total}`),
  more: (count) => `+ ${count} photos`,
  counter: (position, total) => `${position} / ${total}`,
  previous: "Previous photo",
  next: "Next photo",
  close: "Close",
  title: (label) => label,
  position: (position, total) => `${position} of ${total}`,
};

export const shopGalleryLabelsFr: ShopGalleryLabels = {
  open: (alt, position, total) => (alt ? `Ouvrir la photo ${position} sur ${total} : ${alt}` : `Ouvrir la photo ${position} sur ${total}`),
  more: (count) => `+ ${count} photos`,
  counter: (position, total) => `${position} / ${total}`,
  previous: "Photo précédente",
  next: "Photo suivante",
  close: "Fermer",
  title: (label) => label,
  position: (position, total) => `${position} sur ${total}`,
};
