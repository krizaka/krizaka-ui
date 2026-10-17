import { Txt, Waveform } from "@krizaka/ui/native";
import { View } from "react-native";

const PEAKS = [0.2, 0.35, 0.6, 0.9, 0.5, 0.4, 0.8, 1, 0.7, 0.3, 0.5, 0.65, 0.4, 0.25, 0.55, 0.85, 0.6, 0.35, 0.2, 0.45, 0.7, 0.5, 0.3, 0.15];

// A voice on a card: the waveform moves while the sound plays; the name and the length say what it is.
export default function NativeWaveformCard() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16, padding: 16 }}>
      <View style={{ flex: 1 }}>
        <Txt variant="label">Eric</Txt>
        <Txt variant="caption" tone="secondary">Voice note · 0:42</Txt>
      </View>
      <View style={{ width: 160 }}>
        <Waveform peaks={PEAKS} bars={24} size="sm" playing />
      </View>
    </View>
  );
}
