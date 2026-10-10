import { RadioGroup } from "@krizaka/ui/radio-group";

const AMOUNTS = [
  ["5", "$5", "A coffee"],
  ["20", "$20", "A dinner"],
  ["50", "$50", "A night out"],
];

// Whole cards: the chosen one carries the accent border and tint.
export default function RadioGroupCards() {
  return (
    <RadioGroup.Root label="Amount" defaultValue="20" className="grid w-[30rem] max-w-full grid-cols-3 gap-3">
      {AMOUNTS.map(([value, amount, hint]) => (
        <RadioGroup.Card key={value} value={value}>
          <span className="font-display text-lg font-bold">{amount}</span>
          <span className="text-xs text-fg-secondary">{hint}</span>
        </RadioGroup.Card>
      ))}
    </RadioGroup.Root>
  );
}
