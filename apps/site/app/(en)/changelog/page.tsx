import type { Metadata } from "next";

import { ChangelogView } from "@/app/components/ChangelogView";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const c = getDictionary("en").site.changelog;
  return localizedMetadata("en", { path: "/changelog", title: c.metaTitle, description: c.metaDescription });
}

export default function Page() {
  return <ChangelogView locale="en" />;
}
