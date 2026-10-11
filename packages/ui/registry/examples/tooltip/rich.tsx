import { IconButton } from "@krizaka/ui/button";
import { Tooltip } from "@krizaka/ui/tooltip";

// A rich tooltip: a `title`, a line of explanation, and the action's keyboard `shortcut`.
export default function TooltipRich({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Tooltip title="Command palette" content="Search pages, actions and people." shortcut={["⌘", "K"]} defaultOpen={defaultOpen}>
      <IconButton label="Open the command palette" variant="outline">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
