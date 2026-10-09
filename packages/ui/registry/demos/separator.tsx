import { Separator } from "@krizaka/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="flex w-72 flex-col gap-3 text-sm text-fg">
      <p>Account</p>
      <Separator />
      <p className="text-fg-secondary">Notifications</p>
    </div>
  );
}
