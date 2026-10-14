import { DocsArticlePage } from "@krizaka/ui/docs-article-page";

const QUESTIONS = [
  { id: "cloud", q: "Does anything leave my server?", a: "No. Requests are answered by models on your machine; the only calls out are the ones you configure yourself." },
  { id: "models", q: "Which models can I run?", a: "Any model your hardware can hold. Orazaka lists the ones that fit before you download them." },
  { id: "price", q: "How is it priced?", a: "A plan with a monthly credit allowance. Credits are spent per job, and what is left is always shown." },
];

// TEMPLATE — a FAQ: the questions as a list of disclosures, each answer one short paragraph, the contents beside them.
// Open by the address (`#price`), reachable by keyboard; one column on a phone.
export default function DocsArticlePageFaq() {
  return (
    <DocsArticlePage
      className="brand-orazaka pt-6"
      sidebarLabel="Pages of the documentation"
      sidebar={
        <nav aria-label="Orazaka documentation">
          <ul className="flex flex-col gap-1 text-sm">
            {["Getting started", "The CLI", "Questions"].map((p) => (
              <li key={p}>
                <a href={`#${p}`} aria-current={p === "Questions" ? "page" : undefined} className="block rounded-md px-3 py-2 text-fg-secondary no-underline hover:bg-surface-2 aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg">{p}</a>
              </li>
            ))}
          </ul>
        </nav>
      }
      breadcrumb={[{ href: "#docs", label: "Docs" }, { href: "#orazaka", label: "Orazaka" }]}
      title="Questions, answered"
      lead="What people ask before they install."
      toc={{ label: "Questions", items: QUESTIONS.map((x) => ({ id: x.id, label: x.q })) }}
    >
      {QUESTIONS.map((x) => (
        <details key={x.id} id={x.id} className="group border-b border-border-subtle py-3">
          <summary className="cursor-pointer rounded-md py-1 font-semibold text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">{x.q}</summary>
          <p className="mt-2 text-fg-secondary">{x.a}</p>
        </details>
      ))}
    </DocsArticlePage>
  );
}
