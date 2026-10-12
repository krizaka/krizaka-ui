import { DocsLayout } from "@krizaka/ui/docs-layout";
import { Toc } from "@krizaka/ui/toc";

const PAGES = ["Getting started", "Architecture", "API reference"];

// A documentation page in the site's frame: pages · article · contents; on a phone the pages fold above the article.
export default function DocsLayoutPage() {
  return (
    <DocsLayout
      className="pt-6"
      sidebarLabel="Pages of the documentation"
      sidebar={
        <nav aria-label="Documentation">
          <ul className="flex flex-col gap-1 text-sm">
            {PAGES.map((p, i) => (
              <li key={p}>
                <a href={`#${i}`} aria-current={i === 0 ? "page" : undefined} className="block rounded-md px-3 py-2 text-fg-secondary no-underline hover:bg-surface-2 aria-[current=page]:bg-accent-soft aria-[current=page]:text-fg">{p}</a>
              </li>
            ))}
          </ul>
        </nav>
      }
      toc={<Toc label="On this page" items={[{ id: "install", label: "Install" }, { id: "run", label: "Run" }]} />}
    >
      <h1 className="font-display text-3xl font-extrabold text-fg">Getting started</h1>
      <h2 id="install" className="mt-6 text-xl font-bold text-fg">Install</h2>
      <p className="mt-2 text-sm text-fg-secondary">npx orazaka install</p>
    </DocsLayout>
  );
}
