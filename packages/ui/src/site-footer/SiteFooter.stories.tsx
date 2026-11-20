import type { Meta, StoryObj } from "@storybook/react-vite";

import AppExample from "../../registry/examples/site-footer/app";
import CompanyExample from "../../registry/examples/site-footer/company";
import ConfiguredExample from "../../registry/examples/site-footer/configured";
import DocsExample from "../../registry/examples/site-footer/docs";
import EverySiteExample from "../../registry/examples/site-footer/every-site";
import FamilyExample from "../../registry/examples/site-footer/family";
import HostedExample from "../../registry/examples/site-footer/hosted";
import OpenSourceFrExample from "../../registry/examples/site-footer/open-source-fr";
import ProductExample from "../../registry/examples/site-footer/product";
import SocialsExample from "../../registry/examples/site-footer/socials";
import { SiteFooter } from "./site-footer";

/** The footer of every Krizaka site. Each story renders a named example of the registry (`registry/examples/site-footer/*`). */
const meta = {
  title: "Primitives/SiteFooter",
  component: SiteFooter,
  args: { current: "krizaka" },
  decorators: [
    (Story) => (
      <div className="w-[64rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteFooter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Product: Story = { render: () => <ProductExample /> };
export const Company: Story = { render: () => <CompanyExample /> };
export const OpenSourceFr: Story = { render: () => <OpenSourceFrExample /> };
export const App: Story = { render: () => <AppExample /> };
export const Docs: Story = { render: () => <DocsExample /> };
/** The footer as the admin configured it (`config`): real columns, then one legal line that names the company once. */
export const Configured: Story = { render: () => <ConfiguredExample /> };
/** The company's accounts (Instagram, Facebook, LinkedIn, YouTube) from `org.links.social`, drawn as its icon on the last line. */
export const Socials: Story = { render: () => <SocialsExample /> };
/** The developer sites' footer from the org JSON (`footerFor`): at most three lines on a desktop, folded groups at 360 px. */
export const Family: Story = { render: () => <FamilyExample /> };
/** `variant="hosted"`: a shop's page on a platform — the shop's legal links and « made with » on one line, at 360, 390 and 1440 px. */
export const Hosted360: Story = { tags: ["pb3746"], render: () => <HostedExample />, parameters: { viewportWidth: 360, noOverflow: true } };
export const Hosted390: Story = { tags: ["pb3746"], render: () => <HostedExample />, parameters: { viewportWidth: 390, noOverflow: true } };
export const Hosted1440: Story = { tags: ["pb3746"], render: () => <HostedExample />, parameters: { viewportWidth: 1440, noOverflow: true } };
/** Every site id draws the same footer from the org's data, at 390 and 1440 px. */
export const EverySite390: Story = { render: () => <EverySiteExample />, parameters: { viewportWidth: 390, noOverflow: true } };
export const EverySite1440: Story = { render: () => <EverySiteExample />, parameters: { viewportWidth: 1440, noOverflow: true } };
/** From 1024 px the family's groups are columns (title on top, links stacked); at 360 px they fold and nothing scrolls sideways (#4336). */
export const Family1440: Story = { tags: ["pb4336"], render: () => <FamilyExample />, parameters: { viewportWidth: 1440, noOverflow: true } };
export const Family360: Story = { tags: ["pb4336"], render: () => <FamilyExample />, parameters: { viewportWidth: 360, noOverflow: true } };
/** The site's own column and the family's columns in ONE row from 1024 px (up to 4 columns), the legal line at the small size, said once; stacked at 390 px (#4470). */
export const OneRow1440: Story = { tags: ["pb4470"], render: () => <FamilyExample />, parameters: { viewportWidth: 1440, noOverflow: true } };
export const OneRow390: Story = { tags: ["pb4470"], render: () => <FamilyExample />, parameters: { viewportWidth: 390, noOverflow: true } };
