import { Columns } from "@krizaka/ui/columns";

// Two columns that stack when their container cannot hold them: a form and its summary, a third and two thirds.
export default function ColumnsExample() {
  const box = "flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-1 p-3.5";
  return (
    <Columns weights={[1, 2]} minColumnWidth={220}>
      <div className={box}>
        <span className="text-sm font-medium text-fg">Summary</span>
        <span className="text-xs text-fg-muted">3 files · 42 checks</span>
      </div>
      <div className={box}>
        <span className="text-sm font-medium text-fg">The file</span>
        <span className="text-sm text-fg-muted">Side by side from 2 × 220 px plus the gap; one above the other below.</span>
      </div>
    </Columns>
  );
}
