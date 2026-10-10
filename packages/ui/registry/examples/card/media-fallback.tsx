import { Card } from "@krizaka/ui/card";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

// No image: the `fallback` (an icon on the accent gradient), hidden from assistive technology.
export default function CardMediaFallback() {
  return (
    <Card.Root>
      <Card.Media aspect="square">
        <Card.Image src={null} fallback={<PlayIcon />} />
      </Card.Media>
      <Card.Body padding="sm">
        <Card.Title>Untitled draft</Card.Title>
        <Card.Description>Processing — the cover arrives with the first frame.</Card.Description>
      </Card.Body>
    </Card.Root>
  );
}
