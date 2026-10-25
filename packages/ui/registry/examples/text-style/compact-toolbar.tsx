import { Button } from "@krizaka/ui/button";
import { Popover } from "@krizaka/ui/popover";
import { type TextStyle, textStyleLabelsFr,TextStylePicker } from "@krizaka/ui/text-style";
import { useState } from "react";

// `compact` in a popover from a toolbar, with the French words and just two controls.
export default function TextStyleCompactToolbar({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [value, setValue] = useState<TextStyle>({
    font: "text", size: "md", weight: 400, leading: "normal", tracking: "normal", align: "start", case: "none", italic: false, tone: "primary",
  });
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline">Aa</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Style du texte" className="w-72">
        <TextStylePicker compact value={value} onChange={setValue} labels={textStyleLabelsFr} previewText="Pain au levain" fields={["font", "size"]} />
      </Popover.Content>
    </Popover.Root>
  );
}
