import type { Meta, StoryObj } from "@storybook/react-vite";

import { PresetPage } from "./presets-page";

/** Shop looks (ADR-007 §4, krizaka-ui#745): the same three-section page wearing each of the twelve presets, in both themes. */
const meta = { title: "Primitives/ShopPresets", parameters: { layout: "fullscreen", viewportWidth: 1100 } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CleaningForfait: Story = { name: "cleaning-forfait", render: () => <PresetPage id="cleaning-forfait" /> };
export const CleaningNet: Story = { name: "cleaning-net", render: () => <PresetPage id="cleaning-net" /> };
export const CoachingApproche: Story = { name: "coaching-approche", render: () => <PresetPage id="coaching-approche" /> };
export const CoachingStudio: Story = { name: "coaching-studio", render: () => <PresetPage id="coaching-studio" /> };
export const ConsultingBureau: Story = { name: "consulting-bureau", render: () => <PresetPage id="consulting-bureau" /> };
export const ConsultingCabinet: Story = { name: "consulting-cabinet", render: () => <PresetPage id="consulting-cabinet" /> };
export const PetsCanal: Story = { name: "pets-canal", render: () => <PresetPage id="pets-canal" /> };
export const PetsCarnet: Story = { name: "pets-carnet", render: () => <PresetPage id="pets-carnet" /> };
export const SalonAtelier: Story = { name: "salon-atelier", render: () => <PresetPage id="salon-atelier" /> };
export const SalonVitrine: Story = { name: "salon-vitrine", render: () => <PresetPage id="salon-vitrine" /> };
export const WorkshopAtelier: Story = { name: "workshop-atelier", render: () => <PresetPage id="workshop-atelier" /> };
export const WorkshopEtabli: Story = { name: "workshop-etabli", render: () => <PresetPage id="workshop-etabli" /> };
// Within a look, the owner may choose another accent from the preset's tested list.
export const SalonVitrineCopper: Story = { name: "salon-vitrine · copper accent", render: () => <PresetPage id="salon-vitrine" accent="akinaza:accent-2" /> };
export const SalonAtelierPhone: Story = { name: "salon-atelier (phone)", render: () => <PresetPage id="salon-atelier" />, parameters: { phone: true, noOverflow: true } };
export const PetsCarnetPhone: Story = { name: "pets-carnet (phone)", render: () => <PresetPage id="pets-carnet" />, parameters: { phone: true, noOverflow: true } };
