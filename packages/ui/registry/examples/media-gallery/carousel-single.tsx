import { MediaCarousel } from "@krizaka/ui/media-carousel";

const PIC = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><rect width='800' height='500' fill='#1d3f6b'/></svg>")}`;

// One slide: the frame alone, no arrows and no « 1 / 1 ». A page can pass one or many without branching.
export default function MediaCarouselSingleExample() {
  return (
    <div className="max-w-xl">
      <MediaCarousel label="Realisation" slides={[{ id: "a", src: PIC, alt: "A lease read in a minute", caption: "Fig. 1a" }]} />
    </div>
  );
}
