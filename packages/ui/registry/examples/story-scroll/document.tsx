import { DocumentScene } from "@krizaka/ui/product-page";
import { StoryScroll } from "@krizaka/ui/story-scroll";

// One journey while scrolling: the same document changes with each step, the light shifts, the owl guides.
const lines = [{ text: "The rent is paid on the first day." }, { text: "A deposit of two months of rent.", flagged: true }, { text: "The lease renews itself." }];

export default function StoryScrollDocument() {
  return (
    <StoryScroll
      label="How a file is checked"
      guide="owl"
      steps={[
        { id: "arrive", title: "The file arrives.", cue: "arrive" },
        { id: "read", title: "Every line is read.", cue: "read", mood: "thinking" },
        { id: "light", title: "One clause lights up.", cue: "light", light: "danger", mood: "thinking" },
        { id: "attach", title: "Its reference attaches.", cue: "attach", light: "accent-2" },
        { id: "decide", title: "You decide.", cue: "decide", mood: "success" },
      ]}
      scene={
        <DocumentScene
          lines={lines}
          reference="Art. 1904"
          decision={{ title: "A deposit cannot be asked for.", primary: "Review the clause", secondary: "Keep it", stamp: "Decision noted" }}
        />
      }
    />
  );
}
