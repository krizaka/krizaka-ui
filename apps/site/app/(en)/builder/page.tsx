// @template: show
import type { Metadata } from "next";

import { builderMetadata,BuilderPageView } from "@/app/components/builder/BuilderPageView";

export function generateMetadata(): Metadata {
  return builderMetadata("en");
}

export default function Page() {
  return <BuilderPageView locale="en" />;
}
