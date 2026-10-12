import { Mascot,MASCOT_BIRDS } from "@krizaka/ui/mascots";

// The seven birds in the host's brand colours: blue on Krizaka, orange in Orazaka, violet in Orochia, turquoise in
// Yazakia, sage in Yororis.
export default function MascotFlock() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {MASCOT_BIRDS.map((bird) => (
        <figure key={bird} className="flex flex-col items-center gap-2">
          <Mascot bird={bird} mood="welcome" size={88} />
          <figcaption className="text-xs text-fg-secondary">{bird}</figcaption>
        </figure>
      ))}
    </div>
  );
}
