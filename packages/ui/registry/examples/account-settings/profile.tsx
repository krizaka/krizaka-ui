import { AccountProfileCard, AvatarPicker, ChoiceCards, LanguagePicker } from "@krizaka/ui/account-settings";
import { Field, Input } from "@krizaka/ui/field";
import { SettingsLayout, SettingsRow, SettingsSection, useSaveStatus } from "@krizaka/ui/settings-layout";
import * as React from "react";

const NAV = [
  { id: "profile", label: "Profil", href: "/app/settings/profil", current: true },
  { id: "security", label: "Sécurité", href: "/app/settings/securite" },
  { id: "billing", label: "Abonnement", href: "/app/settings/facturation" },
  { id: "storage", label: "Stockage", href: "/app/settings/stockage" },
  { id: "data", label: "Mes données", href: "/app/settings/donnees" },
];
const AVATARS = [1, 2, 3, 4, 5, 6].map((tone) => ({ id: `tone-${tone}`, label: `Teinte ${tone}`, defaultAvatar: { brand: "yomizaka", tone } as const }));
const LABELS = { save: "Enregistrer", saving: "Enregistrement…", saved: "Enregistré", error: "Impossible d'enregistrer. Réessayez.", undo: "Annuler", discard: "Rétablir" };

/** One section's draft: dirty against what is saved, saved with one call, undone to what it was. */
function useDraft<T>(saved: T) {
  const [draft, setDraft] = React.useState(saved);
  const [kept, setKept] = React.useState(saved);
  const [before, setBefore] = React.useState(saved);
  const status = useSaveStatus();
  return {
    draft,
    set: (patch: Partial<T>) => setDraft({ ...draft, ...patch }),
    save: {
      dirty: JSON.stringify(draft) !== JSON.stringify(kept),
      status: status.status,
      labels: LABELS,
      onDiscard: () => setDraft(kept),
      onSave: () => {
        setBefore(kept);
        setKept(draft);
        void status.track(async () => undefined);
      },
      onUndo: () => {
        setDraft(before);
        setKept(before);
        status.reset();
      },
    },
  };
}

// TEMPLATE — an account's profile page, the Orazaka way: one calm column of rows (label and help left, control right), a
// section per subject with its own save (dirty → enabled, saved → Undo), the role question as cards in a section of its own.
export default function AccountProfile() {
  const profile = useDraft({ name: "Éric Tremblay", avatar: "tone-2", language: "fr" });
  const role = useDraft({ side: "tenant" });
  return (
    <SettingsLayout variant="flat" className="w-full" title="Réglages" description="Votre profil et la façon dont l'application vous répond." nav={NAV} navLabel="Sections des réglages">
      <SettingsSection variant="flat" title="Profil" description="Ce que l'application sait de vous." save={profile.save}>
        <SettingsRow label={<AccountProfileCard compact name={profile.draft.name} email="eric@example.com" verified verifiedLabel="Adresse vérifiée" unverifiedLabel="Adresse non vérifiée" avatar={{ defaultAvatar: { brand: "yomizaka", tone: Number(profile.draft.avatar.slice(5)) } }} />} />
        <SettingsRow label="Nom" description="Affiché dans le menu du compte." htmlFor="profile-name">
          <Field.Root>
            <Input id="profile-name" value={profile.draft.name} onChange={(event) => profile.set({ name: event.target.value })} />
          </Field.Root>
        </SettingsRow>
        <SettingsRow label="Avatar" description="Une des images par défaut.">
          <AvatarPicker dense label="Avatar" options={AVATARS} value={profile.draft.avatar} onValueChange={(avatar) => profile.set({ avatar })} />
        </SettingsRow>
        <SettingsRow label="Langue" description="La langue de l'application et des courriels.">
          <LanguagePicker showLabel={false} label="Langue" value={profile.draft.language} onValueChange={(language) => profile.set({ language })} languages={[{ code: "fr", name: "Français" }, { code: "en", name: "English" }]} />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection variant="flat" title="De quel côté du bail êtes-vous ?" description="Cela change les vérifications proposées en premier, pas les règles." save={role.save}>
        <div className="py-4">
          <ChoiceCards
            label="De quel côté du bail êtes-vous ?"
            value={role.draft.side}
            onValueChange={(side) => role.set({ side })}
            options={[
              { id: "tenant", title: "Locataire", description: "Je vérifie mon bail avant de signer." },
              { id: "landlord", title: "Propriétaire", description: "Je vérifie mon modèle de bail." },
            ]}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
