import { FormFlow, TextField } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// TEMPLATE — A form in steps: one question per step, the position in words, the main action pinned above the keyboard (it
// rises with it) and clear of the home indicator. The action stays dimmed until the step is valid.
export default function NativeFormFlowSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <View style={{ width: 360, height: 640 }}>
      <FormFlow
        labels={{ next: "Next", done: "Create my account", back: "Back", position: (n, total) => `Step ${n} of ${total}` }}
        onDone={() => undefined}
        onExit={() => undefined}
        steps={[
          { id: "name", title: "What should we call you?", description: "Your first name is enough.", valid: name.trim().length > 0, content: <TextField label="First name" value={name} onValueChange={setName} /> },
          { id: "email", title: "Where do we send your results?", valid: email.includes("@"), content: <TextField label="Email" value={email} onValueChange={setEmail} keyboardType="email-address" autoCapitalize="none" /> },
        ]}
      />
    </View>
  );
}
