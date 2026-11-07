import { SentinelMini } from "@krizaka/orazaka-design-system";

// Beside the name of the section the governance watches.
export default function Sidebar() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-fg">
      <SentinelMini size={24} />
      Governance · 12 policies active
    </div>
  );
}
