import { IconButton } from "@krizaka/ui/button";

export default function ButtonIcon() {
  return (
    <div className="flex items-center gap-3">
      <IconButton label="Close" variant="ghost">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </IconButton>
      <IconButton label="Add" variant="primary" shape="pill">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
    </div>
  );
}
