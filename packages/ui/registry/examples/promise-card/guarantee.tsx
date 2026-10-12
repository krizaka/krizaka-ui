import { Mascot } from "@krizaka/ui/mascots";
import { PromiseCard } from "@krizaka/ui/promise-card";

// A product's guarantee with the bird that keeps it — the owl reads your documents and keeps them in the house.
export default function PromiseCardGuarantee() {
  return (
    <PromiseCard
      className="w-[30rem] max-w-full"
      label="Our promise"
      promise="Your documents never leave your servers."
      keys={["⌘", "K"]}
      bearer={<Mascot bird="owl" mood="success" size={48} animated={false} />}
      bearerLabel="Kept by"
      bearerName="The owl · reads, and keeps it in the house"
    />
  );
}
