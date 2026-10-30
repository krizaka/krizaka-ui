import type { Meta, StoryObj } from "@storybook/react-vite";

import { PresetPage } from "./presets-page";

/** Shop looks (ADR-007 §4, krizaka-ui#745): the same three-section page wearing each of the twelve trade presets and the six trade-agnostic looks (`look-*`, akinaza#478), in both themes. */
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

// The six looks of the addendum (akinaza#478): the same page, six surfaces, faces, motions; desktop, then phone.
export const LookCahier: Story = { name: "look-cahier", render: () => <PresetPage id="look-cahier" /> };
export const LookKrizaka: Story = { name: "look-krizaka", render: () => <PresetPage id="look-krizaka" /> };
export const LookEditorial: Story = { name: "look-editorial", render: () => <PresetPage id="look-editorial" /> };
export const LookBoutique: Story = { name: "look-boutique", render: () => <PresetPage id="look-boutique" /> };
export const LookAffiche: Story = { name: "look-affiche", render: () => <PresetPage id="look-affiche" /> };
export const LookNuit: Story = { name: "look-nuit", render: () => <PresetPage id="look-nuit" /> };
export const LookCahierPhone: Story = { name: "look-cahier (phone)", render: () => <PresetPage id="look-cahier" />, parameters: { phone: true, noOverflow: true } };
export const LookKrizakaPhone: Story = { name: "look-krizaka (phone)", render: () => <PresetPage id="look-krizaka" />, parameters: { phone: true, noOverflow: true } };
export const LookAffichePhone: Story = { name: "look-affiche (phone)", render: () => <PresetPage id="look-affiche" />, parameters: { phone: true, noOverflow: true } };
// The owners' advanced looks: an editorial boutique, a bold dark-leaning street page, a calm premium salon; then an owner's choices over a look.
export const LookAtelier: Story = { name: "look-atelier", render: () => <PresetPage id="look-atelier" /> };
export const LookRue: Story = { name: "look-rue", render: () => <PresetPage id="look-rue" /> };
export const LookVelours: Story = { name: "look-velours", render: () => <PresetPage id="look-velours" /> };
export const LookAtelierPhone: Story = { name: "look-atelier (phone)", render: () => <PresetPage id="look-atelier" />, parameters: { phone: true, noOverflow: true } };
export const LookRuePhone: Story = { name: "look-rue (phone)", render: () => <PresetPage id="look-rue" />, parameters: { phone: true, noOverflow: true } };
export const LookVeloursPhone: Story = { name: "look-velours (phone)", render: () => <PresetPage id="look-velours" />, parameters: { phone: true, noOverflow: true } };
export const LookRueOwnerChoice: Story = { name: "look-rue · orange, serif titles, calm", render: () => <PresetPage id="look-rue" accent="orazaka" face="serif" motion="calm" /> };
export const LookNuitPhone: Story = { name: "look-nuit (phone)", render: () => <PresetPage id="look-nuit" />, parameters: { phone: true, noOverflow: true } };
