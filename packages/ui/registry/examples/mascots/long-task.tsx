import { Mascot } from "@krizaka/ui/mascots";
import { Progress } from "@krizaka/ui/progress";

// A job of a few minutes: the pigeon thinks beside its progress; the label says what runs.
export default function MascotLongTask() {
  return (
    <div className="flex w-96 items-center gap-4 rounded-xl border border-border-default bg-surface-1 p-4">
      <Mascot bird="pigeon" mood="thinking" size={72} />
      <div className="flex-1">
        <p className="text-sm font-medium text-fg">Rendering the product video</p>
        <Progress label="Rendering" value={42} className="mt-2" />
      </div>
    </div>
  );
}
