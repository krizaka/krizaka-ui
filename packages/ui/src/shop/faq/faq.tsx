// Server-safe. The questions clients ask (ADR-007 §3): a native `details` each — no script — and the page's FAQPage
// JSON-LD, so a search engine reads the same answers.
import * as React from "react";

import { ShopSection } from "../frame";

export type ShopQuestion = { id: string; question: string; answer: string };

export type FaqSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** @default "list" */
  variant?: "list";
  title: React.ReactNode;
  questions: readonly ShopQuestion[];
};

/** The FAQPage structured data of a list of questions, as a JSON string safe inside a `script`. */
export function faqJsonLd(questions: readonly ShopQuestion[]): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** The questions and their answers. */
export function FaqSection({ title, questions, className, ...props }: FaqSectionProps) {
  if (questions.length === 0) return null;
  return (
    <ShopSection title={title} className={className} data-variant="list" {...props}>
      <div className="max-w-3xl divide-y divide-border-subtle border-y border-border-subtle">
        {questions.map((q) => (
          <details key={q.id} className="group py-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {q.question}
              <span aria-hidden className="shrink-0 text-fg-secondary transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
            </summary>
            <p className="m-0 mt-2 text-[15px] leading-relaxed text-fg-secondary">{q.answer}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(questions) }} />
    </ShopSection>
  );
}
