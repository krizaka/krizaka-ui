import { Button } from "@krizaka/ui/button";
import { ConfirmButton } from "@krizaka/ui/confirm-button";
import { Meter } from "@krizaka/ui/meter";
import { SettingsRow, SettingsSection } from "@krizaka/ui/settings-layout";

// The four other sections of an account page, each a flat SettingsSection of rows: security, subscription (the billing
// portal is one link), storage (a Meter), « my data » (export, and a delete that asks twice).
export default function AccountSectionPatterns() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <SettingsSection variant="flat" title="Sécurité" description="Comment vous vous connectez.">
        <SettingsRow label="Courriel" description="Un lien de confirmation est envoyé à la nouvelle adresse.">
          eric@example.com <Button variant="secondary" size="sm">Changer</Button>
        </SettingsRow>
        <SettingsRow label="Mot de passe" description="Modifié il y a 3 mois.">
          <Button variant="secondary" size="sm">Changer</Button>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection variant="flat" title="Abonnement" description="Votre forfait et vos factures.">
        <SettingsRow label="Forfait Solo" description="Renouvelé le 1er novembre.">
          <Button variant="secondary" size="sm" asChild><a href="https://billing.example.com/portal">Ouvrir le portail de facturation</a></Button>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection variant="flat" title="Stockage" description="L'espace utilisé par vos documents.">
        <SettingsRow label="Documents">
          <Meter className="w-56" label="Stockage" value={18} max={50} valueText="18 Go sur 50 Go" showLabel />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection variant="flat" title="Mes données" description="Ce que vous pouvez emporter ou effacer.">
        <SettingsRow label="Exporter" description="Une archive de tout ce que vous avez téléversé.">
          <Button variant="secondary" size="sm">Demander l'export</Button>
        </SettingsRow>
        <SettingsRow label="Supprimer mon compte" description="Vos documents et votre compte disparaissent, sans retour.">
          <ConfirmButton variant="danger" size="sm" confirmLabel="Supprimer pour de bon ?" onConfirm={() => {}}>Supprimer</ConfirmButton>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
