import { CodeBlock } from "@krizaka/ui/code-block";
import { DocsArticlePage } from "@krizaka/ui/docs-article-page";

const PAGES = ["Getting started", "The CLI", "Packs & Studios"];

// TEMPLATE — a documentation article (Orazaka's CLI): the pages, where it sits, its title and facts, the reading column,
// the contents beside it, previous and next at the foot. On a phone the pages fold above the article.
export default function DocsArticlePageCli() {
  return (
    <DocsArticlePage
      className="brand-orazaka pt-6"
      sidebarLabel="Pages of the documentation"
      sidebar={
        <nav aria-label="Orazaka documentation">
          <ul className="flex flex-col gap-1 text-sm">
            {PAGES.map((p, i) => (
              <li key={p}>
                <a href={`#p${i}`} aria-current={i === 1 ? "page" : undefined} className="block rounded-md px-3 py-2 text-fg-secondary no-underline hover:bg-surface-2 aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg">{p}</a>
              </li>
            ))}
          </ul>
        </nav>
      }
      breadcrumb={[{ href: "#docs", label: "Docs" }, { href: "#orazaka", label: "Orazaka" }]}
      title="The CLI"
      lead="Install, start and develop Orazaka from one command line."
      facts={[{ label: "Updated 11 Oct 2026" }, { label: "4 min read" }]}
      toc={{ label: "On this page", items: [{ id: "install", label: "Install" }, { id: "start", label: "Start" }] }}
      pager={{ previous: { href: "#p0", title: "Getting started" }, next: { href: "#p2", title: "Packs & Studios" }, labels: { previous: "Previous", next: "Next" } }}
    >
      <h2 id="install">Install</h2>
      <p>One command installs the engine, the console and the models you choose.</p>
      <CodeBlock code="npx orazaka install" language="bash" file="Terminal" copyLabel="Copy" copiedLabel="Copied" />
      <h2 id="start">Start</h2>
      <p>Then start it; the console opens on your machine.</p>
    </DocsArticlePage>
  );
}
