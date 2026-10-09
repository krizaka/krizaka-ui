import { Button } from "@krizaka/ui/button";
import { DropdownMenu } from "@krizaka/ui/dropdown-menu";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export default function DropdownMenuDemo({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu.Root defaultOpen={defaultOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="center">
        <DropdownMenu.Label>Video</DropdownMenu.Label>
        <DropdownMenu.Item>{icon("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z")}Edit</DropdownMenu.Item>
        <DropdownMenu.Item>{icon("M4 12v8h16v-8M16 6l-4-4-4 4M12 2v13")}Share</DropdownMenu.Item>
        <DropdownMenu.Item disabled>{icon("M12 3v12M7 10l5 5 5-5M5 21h14")}Download</DropdownMenu.Item>
        <DropdownMenu.CheckboxItem checked>Pinned to the profile</DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.Item tone="danger">{icon("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6")}Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
