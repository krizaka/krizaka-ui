import { MediaCarousel } from "@krizaka/ui/media-carousel";

const PIC = (a: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><rect width='1600' height='900' fill='${a}'/></svg>`)}`;

// The company's sites: the Cahier frame (square, a solid paper shadow), the caption in the bar, a hue per product, the
// text version under it, and « Sound on » for the slides that have sound (pressed first, then hover or focus plays it).
export default function MediaCarouselCahierExample() {
  return (
    <div className="max-w-2xl" data-hue="cobalt">
      <MediaCarousel
        label="Sovkora, what it made"
        autoplay
        sound
        frame="cahier"
        caption="bar"
        textVersion
        slides={[
          { id: "a", src: PIC("#1d3f6b"), alt: "A duck builds a shelf in a workshop", caption: "Fig. 3a — a clip from one prompt", audio: true },
          { id: "b", src: PIC("#2a3f5c"), alt: "The run's cost and model, side by side", caption: "Fig. 3b — the run, accounted for", text: "The run's page: the model, the cost and the time, line by line." },
        ]}
      >
        <p>Clips generated with Sovkora; stills drawn for this example.</p>
      </MediaCarousel>
    </div>
  );
}
