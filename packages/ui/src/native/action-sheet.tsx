import * as React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { type Controlled, modalName, useOpen } from "./dialog";
import { useTheme } from "./theme";
import { Txt } from "./txt";

export type ActionSheetAction = {
  /** The action's words — passed translated. */
  label: string;
  /** What it does; the sheet closes first. */
  onPress: () => void;
  /** A destructive action wears the danger text. */
  destructive?: boolean;
  /** A decorative icon before the words. */
  icon?: React.ReactNode;
  /** Cannot be chosen now. */
  disabled?: boolean;
};

export type ActionSheetProps = Controlled & {
  /** What the choices are about (“Your video”) — the accessible name. */
  title: string;
  /** One line under the title. */
  description?: string;
  /** The choices, in order. */
  actions: readonly ActionSheetAction[];
  /** The cancel button's words (“Cancel”) — passed translated. */
  cancelLabel: string;
};

/** A short list of actions from the bottom edge — share, edit, delete — and a cancel button apart, as the platforms do. */
export function ActionSheet({ title, description, actions, cancelLabel, ...controlled }: ActionSheetProps) {
  const [open, setOpen] = useOpen(controlled);
  const { theme, radius, insets, haptics } = useTheme();
  // The material: what floats over the screen is glass, its top edge catching the light.
  const card = { backgroundColor: theme.glassBg, borderColor: theme.glassBorder, borderTopColor: theme.edgeLight, borderRadius: radius.xl };
  return (
    <Modal {...modalName(title)} visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} statusBarTranslucent>
      <Pressable aria-hidden accessible={false} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]} onPress={() => setOpen(false)} />
      <View style={[styles.bottom, styles.actionWrap, { paddingBottom: 8 + insets.bottom }]} pointerEvents="box-none">
        <View role="menu" aria-label={title} style={[styles.actionCard, card]}>
          <View style={styles.actionHead}>
            <Txt variant="caption" tone="secondary" style={styles.centred}>
              {title}
            </Txt>
            {description ? (
              <Txt variant="caption" tone="muted" style={styles.centred}>
                {description}
              </Txt>
            ) : null}
          </View>
          {actions.map((action, i) => (
            <Pressable
              key={i}
              role="menuitem"
              aria-disabled={action.disabled}
              disabled={action.disabled}
              onPress={() => {
                haptics.selection();
                setOpen(false);
                action.onPress();
              }}
              style={({ pressed }) => [styles.action, { borderTopColor: theme.borderSubtle, backgroundColor: pressed ? theme.surface2 : "transparent", opacity: action.disabled ? 0.4 : 1 }]}
            >
              {action.icon ? <View aria-hidden>{action.icon}</View> : null}
              <Txt variant="label" tone={action.destructive ? "danger" : "text"}>
                {action.label}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Pressable role="button" onPress={() => setOpen(false)} style={({ pressed }) => [styles.cancel, card, { backgroundColor: pressed ? theme.surface2 : theme.surface1 }]}>
          <Txt variant="label">{cancelLabel}</Txt>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottom: { flex: 1, justifyContent: "flex-end" },
  actionWrap: { paddingHorizontal: 8, gap: 8 },
  actionCard: { borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  actionHead: { paddingVertical: 12, paddingHorizontal: 16, gap: 2 },
  centred: { textAlign: "center" },
  action: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 52, paddingHorizontal: 16, borderTopWidth: StyleSheet.hairlineWidth },
  cancel: { minHeight: 52, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
});
