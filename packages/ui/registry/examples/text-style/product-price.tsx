import { StyledText, type TextStyle, TextStylePicker } from "@krizaka/ui/text-style";
import { useState } from "react";

// Only the controls a price needs, and the stored value drawn where the price shows.
export default function TextStyleProductPrice() {
  const [value, setValue] = useState<TextStyle>({
    font: "mono", size: "2xl", weight: 700, leading: "normal", tracking: "normal", align: "start", case: "none", italic: false, tone: "accent",
  });
  return (
    <div className="flex flex-col gap-4">
      <TextStylePicker value={value} onChange={setValue} previewText="12,50 €" fields={["font", "size", "weight", "tone"]} labels={{ picker: "Price style" }} />
      <StyledText as="span" value={value}>
        12,50 €
      </StyledText>
    </div>
  );
}
