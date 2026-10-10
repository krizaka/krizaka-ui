import { IconButton } from "@krizaka/ui/button";
import { Tooltip } from "@krizaka/ui/tooltip";

export default function TooltipRight({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Tooltip content="Copy the link" side="right" defaultOpen={defaultOpen}>
      <IconButton label="Copy" variant="outline">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      </IconButton>
    </Tooltip>
  );
}
