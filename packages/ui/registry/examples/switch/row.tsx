import { Switch } from "@krizaka/ui/switch";

// A settings row: `children` and `description` at the start, the switch at the end, the whole row clickable.
export default function SwitchRow() {
  return (
    <div className="flex w-80 flex-col">
      <Switch defaultChecked description="One email on Monday with what you missed.">
        Weekly digest
      </Switch>
      <Switch description="Plays the next video when this one ends.">Autoplay</Switch>
    </div>
  );
}
