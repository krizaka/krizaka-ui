import { Button, KrizakaMark, Screen, TextField, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// Sign in: the mark, the promise, two fields, the main action pinned above the keyboard, the legal words.
export default function NativeScreenAuth() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <Screen footer={<View style={{ padding: 16, gap: 8 }}><Button label="Sign in" variant="gradient" size="lg" /><Button label="Create an account" variant="ghost" /></View>}>
        <View style={{ alignItems: "center", gap: 8, marginVertical: 24 }}>
          <KrizakaMark size={64} />
          <Txt variant="display">Welcome back</Txt>
          <Txt tone="secondary" style={{ textAlign: "center" }}>Meet people who like what you like.</Txt>
        </View>
        <TextField label="Email" autoComplete="email" keyboardType="email-address" placeholder="you@example.com" />
        <TextField label="Password" hint="At least 12 characters" autoComplete="current-password" secureTextEntry />
        <Txt variant="caption" tone="secondary" style={{ textAlign: "center" }}>By continuing you accept the terms and the privacy policy.</Txt>
      </Screen>
    </View>
  );
}
