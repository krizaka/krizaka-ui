import { OrazakaLogo } from "@krizaka/ui";
import { Button } from "@krizaka/ui/button";
import { NavBar } from "@krizaka/ui/nav-bar";

// The product-site standard (every Krizaka product: dev.orazaka.com, dev.orochia.com…): the product's mark alone (a
// product is independent — no family switcher, no version in the bar), then Product ▾ (what it does) · Platforms ▾
// (where it runs) · Docs, at most four entries; Sign in and one action on the right. The phone panel repeats the
// groups in the same order.
const icon = (
  <svg data-kz-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9Z" />
    <circle data-node cx="12" cy="12" r="2.4" fill="currentColor" />
  </svg>
);

const groups = [
  {
    id: "product",
    label: "Product",
    links: [
      { href: "#how", title: "How it works", description: "Install to first answer in three commands." },
      { href: "#studios", title: "Studios", description: "Ready-made workflows, priced before you run." },
      { href: "#packs", title: "Packs", description: "Installable offers, one per trade." },
      { href: "#models", title: "Models", description: "The models it runs, on your machine." },
      { href: "#demo", title: "Demo", description: "Real runs: prompts, images, videos." },
    ],
  },
  {
    id: "platforms",
    label: "Platforms",
    links: [
      { href: "#web", title: "Web", description: "The workspace in your browser." },
      { href: "#mac", title: "Mac", description: "Orazaka Desktop for Apple Silicon." },
      { href: "#self-host", title: "Self-host", description: "Install it on your own servers." },
    ],
  },
];

export default function NavBarFamilyProduct() {
  return (
    <NavBar.Root label="Main" floating={false}>
      <NavBar.Brand href="#home">
        <OrazakaLogo size={22} />
        Orazaka
      </NavBar.Brand>
      <NavBar.Items>
        {groups.map((g) => (
          <NavBar.Menu key={g.id} value={g.id} label={g.label}>
            {g.links.map((l) => (
              <NavBar.MenuLink key={l.href} href={l.href} title={l.title} description={l.description} icon={icon} />
            ))}
          </NavBar.Menu>
        ))}
        <NavBar.Link href="#docs">Docs</NavBar.Link>
      </NavBar.Items>
      <NavBar.Actions>
        <NavBar.Repo href="https://github.com/krizaka/orazaka" label="Source on GitHub" className="hidden lg:inline-flex" />
        <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
          <a href="#sign-in">Sign in</a>
        </Button>
        <Button asChild variant="primary" size="sm" shape="cut" className="hidden md:inline-flex">
          <a href="https://www.krizaka.com/contact?topic=orazaka">Talk to us</a>
        </Button>
        <NavBar.Mobile openLabel="Open the menu" closeLabel="Close the menu">
          {groups.map((g) => (
            <NavBar.MobileGroup key={g.id} label={g.label}>
              {g.links.map((l) => (
                <NavBar.MobileLink key={l.href} href={l.href}>
                  {l.title}
                </NavBar.MobileLink>
              ))}
            </NavBar.MobileGroup>
          ))}
          <NavBar.MobileLink href="#docs">Docs</NavBar.MobileLink>
        </NavBar.Mobile>
      </NavBar.Actions>
    </NavBar.Root>
  );
}
