import { Badge } from "@krizaka/ui/badge";
import { Card } from "@krizaka/ui/card";

// A self-contained cover (no network).
const COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
      '<rect width="160" height="90" fill="url(#g)"/><circle cx="118" cy="30" r="14" fill="#fde68a"/>' +
      '<path d="M0 90 50 44l30 28 22-18 58 36z" fill="#0f172a" opacity=".55"/></svg>',
  );

export default function CardDemo() {
  return (
    <Card.Root>
      <Card.Media>
        <Card.Image src={COVER} />
        <Card.Overlay>
          <Badge tone="scrim">4K</Badge>
        </Card.Overlay>
        <Card.Overlay corner="bottom-right">
          <Badge tone="scrim">12:04</Badge>
        </Card.Overlay>
      </Card.Media>
      <Card.Body>
        <Card.Title>Night ride across the city</Card.Title>
        <Card.Description>Ten minutes of neon, rain and empty avenues, filmed in one take.</Card.Description>
        <Card.Footer>
          <span>1.2k views</span>
          <span aria-hidden>·</span>
          <span>2 days ago</span>
        </Card.Footer>
      </Card.Body>
    </Card.Root>
  );
}
