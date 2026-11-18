import { DocsArticlePage } from "@krizaka/ui/docs-article-page";
import { DocsNav } from "@krizaka/ui/docs-nav";
import { docsSource } from "@krizaka/ui/docs-source";
import { Markdown } from "@krizaka/ui/markdown";

// On a real site `readDocsFolder("docs/public")` (from "@krizaka/ui/docs-source/node") gives the files.
const files = [
  { path: "getting-started.fr.md", content: "---\ntitle: Démarrer\ngroup: Guide\norder: 1\n---\n## Installer\nUne commande." },
  { path: "getting-started.en.md", content: "---\ntitle: Getting started\ngroup: Guide\norder: 1\nupdated: 2026-11-16\n---\n## Install\nOne command.\n\n## Start\nThen open the console." },
  { path: "guides/backup.en.md", content: "---\ntitle: Backups\ngroup: Guide\norder: 2\n---\n## Where they go\nOn your machine." },
];

// A folder of Markdown files read into the docs frame: the pages, the contents and previous / next come from the files.
export default function DocsSourceArticle() {
  const docs = docsSource(files, { locale: "en" });
  const page = docs.page("getting-started");
  if (!page) return null;
  return (
    <DocsArticlePage
      className="pt-6"
      sidebarLabel="Pages of the documentation"
      sidebar={<DocsNav label="Documentation" groups={docs.groups} current={page.href} />}
      breadcrumb={page.breadcrumb}
      title={page.title}
      facts={[...(page.updated ? [{ label: `Updated ${page.updated}` }] : []), { label: `${page.readingMinutes} min read` }]}
      toc={{ label: "On this page", ...page.toc }}
      pager={{ ...page.pager, labels: { previous: "Previous", next: "Next" } }}
    >
      <Markdown headingIds>{page.body}</Markdown>
    </DocsArticlePage>
  );
}
