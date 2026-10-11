import * as React from "react";
import { AccessibilityInfo, Modal, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { Button } from "./button";
import { useTheme } from "./theme";
import { Txt } from "./txt";

/**
 * The name of a `Modal`: react-native-web draws it as the page's `dialog` and forwards the props it does not know, so the
 * dialog is named there; React Native ignores it (the content view carries the name and `accessibilityViewIsModal`).
 */
export const modalName = (label: string) => ({ "aria-label": label }) as object;

export type Controlled = {
  /** Open (controlled). */
  open?: boolean;
  /** Open at first, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes (the back button, the scrim, a drag down, an action). */
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

export type DialogProps = Controlled & {
  /** The question or the subject, in a few words — the dialog's accessible name. */
  title: string;
  /** One or two sentences under the title. */
  description?: string;
  /** The content: a form, a summary. */
  children?: React.ReactNode;
  /** The buttons, at the bottom (the main one last). */
  actions?: React.ReactNode;
  /** The close button's name (“Close”) — passed translated; absent: no close button (the actions close it). */
  closeLabel?: string;
  /** Styles merged last, on the card. */
  style?: StyleProp<ViewStyle>;
};

/** A centred dialog over a scrim — the web `Dialog`: a modal, the back button and the scrim close it, the title announced. */
export function Dialog({ title, description, children, actions, closeLabel, style, ...controlled }: DialogProps) {
  const [open, setOpen] = useOpen(controlled);
  const { theme, radius } = useTheme();
  React.useEffect(() => {
    if (open) AccessibilityInfo.announceForAccessibility(title);
  }, [open, title]);
  return (
    <Modal {...modalName(title)} visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
      <View style={styles.centre}>
        <Pressable aria-hidden accessible={false} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]} onPress={() => setOpen(false)} />
        <View accessibilityViewIsModal style={[styles.card, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderTopColor: theme.edgeLight, borderRadius: radius.xl }, style]}>
          <View style={styles.head}>
            <View style={styles.headText}>
              <Txt variant="title">{title}</Txt>
              {description ? <Txt tone="secondary">{description}</Txt> : null}
            </View>
            {closeLabel ? <CloseButton label={closeLabel} onPress={() => setOpen(false)} /> : null}
          </View>
          {children ? <View>{children}</View> : null}
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

export type CloseButtonProps = {
  /** Its accessible name (“Close”) — passed translated. */
  label: string;
  /** Closes what it belongs to. */
  onPress: () => void;
};

/** The × of a dialog or a sheet (shared by the overlays). */
export function CloseButton({ label, onPress }: CloseButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable role="button" aria-label={label} hitSlop={10} onPress={onPress} style={styles.close}>
      <Txt style={{ color: theme.textSecondary, fontSize: 20, lineHeight: 22 }} aria-hidden>
        ×
      </Txt>
    </Pressable>
  );
}

export type AlertDialogProps = Omit<DialogProps, "children" | "actions" | "closeLabel"> & {
  /** The confirming button's words (“Delete the video”) — passed translated. */
  confirmLabel: string;
  /** The cancelling button's words (“Keep it”). */
  cancelLabel: string;
  /** What the confirmation does. */
  onConfirm: () => void;
  /** A destructive confirmation wears the danger look. */
  destructive?: boolean;
};

/** A confirmation before an action that cannot be undone — the web `AlertDialog`: cancel or confirm, nothing else. */
export function AlertDialog({ confirmLabel, cancelLabel, onConfirm, destructive, ...props }: AlertDialogProps) {
  const [open, setOpen] = useOpen(props);
  return (
    <Dialog
      {...props}
      open={open}
      onOpenChange={setOpen}
      actions={
        <>
          <Button label={cancelLabel} variant="ghost" onPress={() => setOpen(false)} />
          <Button
            label={confirmLabel}
            variant={destructive ? "danger" : "primary"}
            onPress={() => {
              onConfirm();
              setOpen(false);
            }}
          />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  centre: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 440, padding: 20, gap: 16, borderWidth: StyleSheet.hairlineWidth },
  head: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  headText: { flex: 1, gap: 4 },
  close: { width: 32, height: 32, alignItems: "center", justifyContent: "center", marginTop: -4, marginRight: -6 },
  actions: { flexDirection: "row", justifyContent: "flex-end", flexWrap: "wrap", gap: 8 },
});
