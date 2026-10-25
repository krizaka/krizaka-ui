import { type TextStyle, TextStylePicker } from "@krizaka/ui/text-style";
import { useState } from "react";

// A shop owner sets the look of the shop's title; the app stores `value` as it is and draws it with `StyledText`.
export default function TextStyleStorefrontTitle() {
  const [value, setValue] = useState<TextStyle>({
    font: "display", size: "3xl", weight: 400, leading: "tight", tracking: "normal", align: "center", case: "none", italic: false, tone: "primary",
  });
  return (
    <TextStylePicker
      value={value}
      onChange={setValue}
      previewText="Boulangerie Martin"
      role="title"
      presets={[
        { id: "title", label: "Title", value: { font: "display", size: "3xl", align: "center" } },
        { id: "subtitle", label: "Subtitle", value: { font: "text", size: "xl", weight: 600 } },
        { id: "text", label: "Text", value: { font: "text", size: "md" } },
      ]}
    />
  );
}
