import { Icon, type IconName } from "@krizaka/orazaka-design-system";

const CONCEPTS: { name: IconName; label: string }[] = [
  { name: "router", label: "Router" },
  { name: "pipeline", label: "Pipeline" },
  { name: "model", label: "Model" },
  { name: "rag", label: "RAG" },
  { name: "memory", label: "Memory" },
  { name: "mcp", label: "MCP" },
  { name: "costShield", label: "Cost shield" },
  { name: "shield", label: "Policies" },
];

// The vocabulary of the engine, one picture per concept.
export default function Engine() {
  return (
    <ul className="grid grid-cols-4 gap-4 text-xs text-fg-secondary">
      {CONCEPTS.map((c) => (
        <li key={c.name} className="flex flex-col items-center gap-1.5">
          <Icon name={c.name} size={22} className="text-fg" />
          {c.label}
        </li>
      ))}
    </ul>
  );
}
