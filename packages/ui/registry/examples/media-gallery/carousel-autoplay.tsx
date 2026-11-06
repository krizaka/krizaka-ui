import { MediaCarousel } from "@krizaka/ui/media-carousel";

const PIC = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='1600' height='900' fill='url(#g)'/></svg>`)}`;

// Carousel v2: it advances by itself at each slide's pace (a clip for its duration, a still for a reading time), with ticks
// and a visible pause; it holds under the pointer, on keyboard focus and off screen. Nothing moves under reduced motion.
export default function MediaCarouselAutoplayExample() {
  return (
    <div className="max-w-2xl">
      <MediaCarousel
        label="What the engine made"
        autoplay
        slides={[
          { id: "a", kind: "still", src: PIC("#1d3f6b", "#4d7fb8"), alt: "A tea pour, the steam lit from the left", caption: "Fig. 2a — a product shot" },
          { id: "b", kind: "still", src: PIC("#23496f", "#6b9bc9"), alt: "A storyboard of six frames", caption: "Fig. 2b — a storyboard" },
          { id: "c", kind: "still", src: PIC("#2a3f5c", "#7aa5d6"), alt: "A finished cut on the timeline", caption: "Fig. 2c — the cut" },
        ]}
      />
    </div>
  );
}
