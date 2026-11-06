import { SovkoraLogo } from "@krizaka/ui";
import { Loader } from "@krizaka/ui/loader";

// The product's mark in place of the Krizaka glyph: Sovkora waits with its own animated mark. Words, delay and ending stay.
export default function LoaderBranded() {
  return <Loader label="Loading your videos" delay={0} variant="block" mark={<SovkoraLogo animated />} />;
}
