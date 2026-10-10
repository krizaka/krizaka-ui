import { MotionObserver } from "@krizaka/ui";
import { Card } from "@krizaka/ui/card";

const COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#4338ca"/>' +
      '<circle cx="118" cy="30" r="14" fill="#fde68a"/></svg>',
  );

// `reveal={index}` + one `MotionObserver` per page: the cards enter in cascade (at once under reduced motion).
export default function CardRevealGrid() {
  return (
    <>
      <MotionObserver />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {["Enter", "Reveal", "Open", "Lift", "Glow", "Roll"].map((word, index) => (
          <Card.Root key={word} reveal={index} interactive radius="lg">
            <Card.Media aspect="video">
              <Card.Image src={index % 2 ? null : COVER} />
            </Card.Media>
            <Card.Body padding="sm">
              <Card.Title>{word}</Card.Title>
              <Card.Description>Step {index + 1} of the signature.</Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </>
  );
}
