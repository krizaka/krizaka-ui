import { Page } from "@krizaka/ui/page";

// `Page` alone: the frame of a custom layout — centred, at most `--kz-page-max` wide, the gutters of the site.
// `narrow` for a reading column, `wide` for documentation with a sidebar.
export default function PageFrame() {
  return (
    <div className="grid w-full gap-3">
      {(["narrow", "default", "wide"] as const).map((size) => (
        <Page key={size} size={size}>
          <div className="rounded-lg border border-dashed border-border-strong bg-surface-1 px-4 py-3 font-mono text-xs text-fg-secondary">
            size=&quot;{size}&quot;
          </div>
        </Page>
      ))}
    </div>
  );
}
