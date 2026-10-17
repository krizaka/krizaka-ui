import { AuthLayout, Button, KrizakaMark, TextField, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeAuthLayoutSignIn() {
  return (
    <View style={{ width: 360, height: 640 }}>
      <AuthLayout
        brand={<KrizakaMark size={56} />}
        title="Welcome back"
        description="Sign in to pick up where you left off."
        footer={<Button variant="ghost" label="No account yet? Ask for an invitation" />}
        legal="By signing in you accept the terms and the privacy policy."
      >
        <TextField label="Email" placeholder="you@company.com" keyboardType="email-address" autoComplete="email" />
        <TextField label="Password" secureTextEntry autoComplete="current-password" />
        <Button variant="primary" size="lg" label="Sign in" />
        <Txt variant="caption" tone="secondary" style={{ textAlign: "center" }}>
          Forgot your password?
        </Txt>
      </AuthLayout>
    </View>
  );
}
