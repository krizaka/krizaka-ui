import { Txt } from "@krizaka/ui/native";

// The text roles; `muted` reaches AA only as large text, like the status roles.
export default function NativeTxtTones() {
  return (
    <>
      <Txt tone="text">Every night, a new set.</Txt>
      <Txt tone="secondary">Every night, a new set.</Txt>
      <Txt tone="muted" variant="display">
        Every night, a new set.
      </Txt>
      <Txt tone="accent" variant="title">
        Every night, a new set.
      </Txt>
    </>
  );
}
