import { Loader } from "@krizaka/ui/loader";

// The minimal API: a label. It appears after 250 ms and stays at least 600 ms once shown.
export default function LoaderMinimal() {
  return <Loader label="Loading" delay={0} />;
}
