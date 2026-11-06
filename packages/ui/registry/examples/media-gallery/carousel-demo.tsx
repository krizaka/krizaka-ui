import { MediaCarousel } from "@krizaka/ui/media-carousel";

const PIC = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><rect width='1600' height='900' fill='#23496f'/></svg>")}`;

// A screen demo: a product journey of 30 s with its chapters — marks on the tick, the caption follows the step under the
// playhead, the steps listed in the text version. Its files pass `krizaka-media-guard` (16:9, no bars, no black end card).
export default function MediaCarouselDemoExample() {
  return (
    <div className="max-w-2xl">
      <MediaCarousel
        label="Verikora, a lease read"
        autoplay
        caption="bar"
        textVersion
        slides={[
          {
            id: "journey",
            kind: "screen-demo",
            src: PIC,
            alt: "Eric drops a lease and reads its report",
            caption: "Fig. 4 — a lease read in a minute",
            duration: 30,
            chapters: [
              { at: 0, label: "Drop the lease" },
              { at: 9, label: "The clauses found" },
              { at: 21, label: "The report" },
            ],
          },
          { id: "report", kind: "still", src: PIC, alt: "The report, page one", caption: "Fig. 4b — the report" },
        ]}
      />
    </div>
  );
}
