import { Grid } from "@krizaka/ui/columns";

const photos = ["Harbour", "Market", "Station", "Bridge", "Park", "Library", "Square", "Tower"];

// Two columns in a compact container, three in a regular one, four in an expanded one; never a tile under 120 px.
export default function ColumnsPhotos() {
  return (
    <Grid columns={{ compact: 2, regular: 3, expanded: 4 }} minItemWidth={120} gap="sm" aria-label="Photos">
      {photos.map((name) => (
        <div key={name} className="grid aspect-square place-items-center rounded-md border border-border-subtle bg-surface-2 text-sm text-fg-muted">
          {name}
        </div>
      ))}
    </Grid>
  );
}
