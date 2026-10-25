import { Doodle } from "@krizaka/ui/doodle";

// The five doodles, kept in the flow (`place="inline"`) so each can be seen at any width.
export default function DoodleKinds() {
  return (
    <div className="flex flex-wrap items-center gap-8 p-4">
      <Doodle kind="arrow" place="inline" />
      <Doodle kind="circle" word="ça !" place="inline" />
      <Doodle kind="star" place="inline" />
      <Doodle kind="wave" place="inline" />
      <Doodle kind="bird" place="inline" />
    </div>
  );
}
