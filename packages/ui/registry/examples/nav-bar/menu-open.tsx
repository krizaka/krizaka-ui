import { NavBar } from "@krizaka/ui/nav-bar";

const icon = (
  <svg data-kz-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9Z" />
    <circle data-node cx="12" cy="12" r="2.4" fill="currentColor" />
  </svg>
);

// A menu in two columns, open: icons whose node lights up under the pointer, the current page tinted.
export default function NavBarMenuOpen({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <NavBar.Root label="Main" className="mb-72">
      <NavBar.Brand href="#home">Krizaka</NavBar.Brand>
      <NavBar.Items defaultValue={defaultOpen ? "products" : undefined}>
        <NavBar.Menu value="products" label="Products" columns={2} active>
          <NavBar.MenuLink href="#overview" icon={icon} title="Overview" description="What it does, in one page." active />
          <NavBar.MenuLink href="#how" icon={icon} title="How it works" description="The request journey, step by step." />
          <NavBar.MenuLink href="#demo" icon={icon} title="Demo" description="Try it on the real application." />
          <NavBar.MenuLink href="#signature" icon={icon} title="Signature" description="What only it does." />
        </NavBar.Menu>
        <NavBar.Link href="#docs">Docs</NavBar.Link>
      </NavBar.Items>
    </NavBar.Root>
  );
}
