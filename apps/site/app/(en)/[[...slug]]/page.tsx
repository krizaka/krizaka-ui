import type { Metadata } from "next";

import { docsMetadata, DocsPageView, docsStaticParams } from "@/app/components/docs/DocsPageView";

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return docsStaticParams("en");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return docsMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocsPageView locale="en" slug={(await params).slug} />;
}
