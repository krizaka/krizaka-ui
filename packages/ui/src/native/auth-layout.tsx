import * as React from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "./screen";
import { Txt } from "./txt";

export type AuthLayoutProps = {
  /** The product's mark (`<OrazakaMark size={64} />`), above the title. */
  brand?: React.ReactNode;
  /** The form's title (`Welcome back`): the screen's heading. */
  title: string;
  /** One sentence under the title. */
  description?: string;
  /** The form: fields, the primary Button, the alternatives. */
  children: React.ReactNode;
  /** Under the form: the other way (`No account yet? Create one`). */
  footer?: React.ReactNode;
  /** The fine print at the very bottom (terms, privacy). */
  legal?: React.ReactNode;
};

/**
 * An entry screen on a phone: the product's mark, a title and a line, the form, the other way, the fine print — one
 * centred column in the native `Screen` (safe areas, keyboard avoidance, scroll).
 */
export function AuthLayout({ brand, title, description, children, footer, legal }: AuthLayoutProps) {
  return (
    <Screen padding={24} contentStyle={styles.content}>
      <View style={styles.head}>
        {brand ? <View style={styles.brand}>{brand}</View> : null}
        <Txt variant="display" style={styles.centre}>
          {title}
        </Txt>
        {description ? (
          <Txt tone="secondary" style={styles.centre}>
            {description}
          </Txt>
        ) : null}
      </View>
      <View style={styles.form}>{children}</View>
      {footer ? <View style={styles.footer}>{typeof footer === "string" ? <Txt tone="secondary">{footer}</Txt> : footer}</View> : null}
      {legal ? <View style={styles.legal}>{typeof legal === "string" ? <Txt variant="caption" tone="muted" style={styles.centre}>{legal}</Txt> : legal}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: "center", gap: 20, width: "100%", maxWidth: 440, alignSelf: "center" },
  head: { alignItems: "center", gap: 8 },
  brand: { marginBottom: 4 },
  centre: { textAlign: "center" },
  form: { gap: 12 },
  footer: { alignItems: "center" },
  legal: { alignItems: "center", marginTop: 8 },
});
