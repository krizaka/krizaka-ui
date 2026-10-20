import { Button } from "@krizaka/ui/button";

// The one action a page is about: the brand gradient beside a quiet outline. The arrow of a signature icon leans
// forward on hover; the button itself never moves (krizaka-ui#393).
export default function ButtonSignature() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="gradient" size="lg">
        Start free
        <svg data-kz-icon="ForwardIcon" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Button>
      <Button variant="outline" size="lg">
        Talk to us
      </Button>
    </div>
  );
}
