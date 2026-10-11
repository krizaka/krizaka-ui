import { ActionBar } from "@krizaka/ui/action-bar";

// `buttons`: the actions of the end of a page, with their words. The first one is the page's action (`primaryFirst`);
// an absolute address opens in a new tab and wears the external mark.
export default function ActionBarButtons() {
  return (
    <ActionBar
      label="What next"
      primaryFirst
      actions={[
        { href: "#docs", label: "Read the documentation" },
        { href: "https://github.com/krizaka/krizaka-java", label: "See the code" },
        { href: "https://github.com/krizaka/krizaka-java/discussions", label: "Discuss" },
      ]}
    />
  );
}
