import { TextField } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// The e-mail and the password of a sign-up: the right keyboards and autofill, a hint, then an error in its place.
export default function NativeFieldDefault() {
  const [email, setEmail] = React.useState("eric@example.com");
  const [password, setPassword] = React.useState("hunter");
  return (
    <View style={{ gap: 16, width: 296 }}>
      <TextField label="E-mail" value={email} onValueChange={setEmail} keyboardType="email-address" autoComplete="email" autoCapitalize="none" textContentType="emailAddress" hint="We send a link to confirm it." />
      <TextField
        label="Password"
        value={password}
        onValueChange={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        error={password.length < 8 ? "Use at least 8 characters." : undefined}
      />
    </View>
  );
}
