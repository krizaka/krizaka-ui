// Client. WCAG 2.4.3: when a dialog closes, focus goes back to what opened it. Radix only does it for `Dialog.Trigger`;
// most app dialogs are controlled (`open` / `onOpenChange`) and opened by a plain button, so on Escape focus fell to
// <body>. The content remembers the focused element when it mounts (it is still the opener: Radix moves focus in an
// effect) and gives it back on close, unless the consumer's `onCloseAutoFocus` prevented the default.
import * as React from "react";

/** The handler for `onCloseAutoFocus`: yours first, then focus back on the opener if it is still on the page. */
export function useReturnFocus(onCloseAutoFocus?: (event: Event) => void) {
  const [opener] = React.useState<Element | null>(() => (typeof document === "undefined" ? null : document.activeElement));
  return React.useCallback(
    (event: Event) => {
      onCloseAutoFocus?.(event);
      if (event.defaultPrevented) return;
      if (opener instanceof HTMLElement && opener !== document.body && opener.isConnected) {
        event.preventDefault();
        opener.focus();
      }
    },
    [opener, onCloseAutoFocus],
  );
}
