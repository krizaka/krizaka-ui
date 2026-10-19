import { ChipRow } from "@krizaka/ui/chip-row";

const tags = ["All", "Night", "Street", "Portrait", "Drone", "Macro", "Travel", "Food", "Architecture", "Sport"];

// More chips than a phone shows: one swipeable row with snap and a fading edge; from md it wraps.
export default function ChipRowMany() {
  return (
    <ChipRow label="Tags">
      {tags.map((tag) => (
        <ChipRow.Item key={tag} href={`#tag-${tag.toLowerCase()}`} selected={tag === "All"}>
          {tag}
        </ChipRow.Item>
      ))}
    </ChipRow>
  );
}
