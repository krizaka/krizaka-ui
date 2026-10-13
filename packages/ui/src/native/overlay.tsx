// Shared by the overlays of /native (ActionSheet, ImageViewer): controlled-or-not opening, and the name react-native-web
// gives its Modal. Not an entry of its own.
import * as React from "react";

/**
 * The name of a `Modal`: react-native-web draws it as the page's `dialog` and forwards the props it does not know, so the
 * dialog is named there; React Native ignores it (the content carries the name and `accessibilityViewIsModal`).
 */
export const modalName = (label: string) => ({ "aria-label": label }) as object;

export type Controlled = {
  /** Open (controlled). */
  open?: boolean;
  /** Open at first, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes (the back button, the scrim, an action). */
  onOpenChange?: (open: boolean) => void;
};

export function useOpen({ open, defaultOpen = false, onOpenChange }: Controlled): [boolean, (next: boolean) => void] {
  const [own, setOwn] = React.useState(defaultOpen);
  const value = open ?? own;
  const set = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setOwn(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  return [value, set];
}
