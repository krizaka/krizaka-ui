import { Txt } from "@krizaka/ui/native";

// The platform's type scale: display · title · body · caption · label · mono.
export default function NativeTxtVariants() {
  return (
    <>
      <Txt variant="display">Every night, a new set.</Txt>
      <Txt variant="title">Every night, a new set.</Txt>
      <Txt variant="body">Every night, a new set.</Txt>
      <Txt variant="caption">Every night, a new set.</Txt>
      <Txt variant="label">Every night, a new set.</Txt>
      <Txt variant="mono">01:24:09</Txt>
    </>
  );
}
