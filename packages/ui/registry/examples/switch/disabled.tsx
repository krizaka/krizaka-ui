import { Switch } from "@krizaka/ui/switch";

export default function SwitchDisabled() {
  return (
    <div className="flex gap-4">
      <Switch label="Autoplay" disabled />
      <Switch label="Loop" disabled defaultChecked />
    </div>
  );
}
