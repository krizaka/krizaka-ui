import { RadioGroup } from "@krizaka/ui/radio-group";

const TIPS = [
  ["10", "10 %", "$4.20"],
  ["15", "15 %", "$6.30"],
  ["20", "20 %", "$8.40"],
  ["0", "No tip", "—"],
];

// Tactile keys: raised on their ledge, pressed in while held — the chosen one stays sunk, lit in the accent.
export default function RadioGroupButtons() {
  return (
    <RadioGroup.Root label="Tip" defaultValue="15" variant="buttons">
      {TIPS.map(([value, label, amount]) => (
        <RadioGroup.Button key={value} value={value} hint={amount} className="w-24">
          {label}
        </RadioGroup.Button>
      ))}
    </RadioGroup.Root>
  );
}
