import { Progress, Stepper } from "@krizaka/ui/native";
import { View } from "react-native";

// An Orazaka studio run: two steps done, the third tracing its progress, the last to come.
export default function NativeStepperRun() {
  return (
    <View style={{ width: 320 }}>
      <Stepper
        aria-label="Run of the dubbing studio"
        current={2}
        steps={[
          { title: "Transcribe", description: "French · 2 min 14 s" },
          { title: "Translate", description: "English, Spanish" },
          { title: "Synthesise voices", value: 0.6, content: <Progress label="Voices" value={60} size="sm" /> },
          { title: "Mix and export" },
        ]}
      />
    </View>
  );
}
