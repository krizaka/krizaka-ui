import { Avatar } from "@krizaka/ui/avatar";

// No photo: the brand's default picture, one of six tones from the person's id — the same one on every screen.
export default function AvatarDefault() {
  const people = ["ada", "camille", "noor", "tomas", "ines", "kofi"];
  return (
    <div className="flex items-center gap-3">
      {people.map((id) => (
        <Avatar key={id} defaultAvatar={{ brand: "orochia", seed: id }} alt={id} fallback={id.slice(0, 2)} size="lg" />
      ))}
    </div>
  );
}
