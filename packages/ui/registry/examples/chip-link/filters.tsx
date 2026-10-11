import { ChipLink } from "@krizaka/ui/chip-link";

const tags = ["All", "Night", "Street", "Portrait", "Drone"];

// Filters that are addresses (`/explore?tag=night`): links with the chip's look, the current one marked — rendered
// on the server, no client JavaScript. With a router: `<ChipLink asChild><Link href="…" /></ChipLink>`.
export default function ChipLinkFilters() {
  return (
    <nav aria-label="Tags" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <ChipLink key={tag} href={`#tag-${tag.toLowerCase()}`} selected={tag === "Night"}>
          {tag}
        </ChipLink>
      ))}
    </nav>
  );
}
