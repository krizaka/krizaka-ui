import { cn } from "@krizaka/ui/cn";

/** One fact of a run: `Seed` → `20261011`. */
export interface RunFact {
  /** What it is, translated by the app (`Seed`). */
  label: string;
  /** Its value, as the run recorded it (`20261011`). */
  value: string;
}

/** Props of {@link RunFacts}. */
export interface RunFactsProps {
  /** The facts, in reading order. */
  facts: readonly RunFact[];
  /** Extra classes on the list, merged last. */
  className?: string;
}

/**
 * What a run recorded, as a description list in mono: label left, value right (a long id breaks instead of overflowing).
 *
 * @param props - {@link RunFactsProps}
 * @returns A description list.
 */
export function RunFacts({ facts, className }: Readonly<RunFactsProps>) {
  return (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs", className)}>
      {facts.map((fact) => (
        <div key={fact.label} className="contents">
          <dt className="text-fg-muted">{fact.label}</dt>
          <dd className="text-fg [overflow-wrap:anywhere]">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
