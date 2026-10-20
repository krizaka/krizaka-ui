import type { Metadata } from "next";

import { homeMetadata, HomePageView } from "@/app/components/landing/HomePageView";

export function generateMetadata(): Metadata {
  return homeMetadata("en");
}

export default function Page() {
  return <HomePageView locale="en" />;
}
