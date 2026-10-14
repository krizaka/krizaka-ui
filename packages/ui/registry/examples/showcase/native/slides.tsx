import { Showcase, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

const SLIDES = [
  { id: "1", title: "Describe it", body: "Write what you want in a sentence." },
  { id: "2", title: "Generate it", body: "The model runs on your own machine." },
  { id: "3", title: "Reproduce it", body: "Every result keeps its prompt and its seed." },
];

// Swipe or wait: the bar fills over 5 s and moves on; every segment is a button, the pause button stops it.
export default function NativeShowcaseSlides() {
  return (
    <View style={{ width: 360 }}>
      <Showcase
        label="How it works"
        items={SLIDES}
        getId={(s) => s.id}
        getTitle={(s) => s.title}
        interval={5000}
        renderItem={(s) => (
          <View style={{ padding: 24 }}>
            <Txt>{s.body}</Txt>
          </View>
        )}
      />
    </View>
  );
}
