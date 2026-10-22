import { AccountProfileCard, AvatarPicker, ChoiceCards, LanguagePicker } from "@krizaka/ui/account-settings";
import { Button } from "@krizaka/ui/button";
import { Field, Input } from "@krizaka/ui/field";
import { SettingsLayout, SettingsSection, useSaveStatus } from "@krizaka/ui/settings-layout";
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
const SAVED = { name: "Éric Tremblay", avatar: "tone-2", language: "fr", side: "tenant" };

// TEMPLATE — an account's profile page: its identity, then one section with one save (dirty → enabled, saved → Undo).
export default function AccountProfile() {
  const [draft, setDraft] = React.useState(SAVED);
  const [saved, setSaved] = React.useState(SAVED);
  const status = useSaveStatus();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  return (
    <SettingsLayout className="w-full" title="Réglages" description="Votre profil, votre langue et la façon dont l'application vous répond." nav={NAV} navLabel="Sections des réglages">
      <SettingsSection
        title="Profil"
        description="Ce que l'application sait de vous."
        save={{
          dirty,
          status: status.status,
          labels: LABELS,
          onDiscard: () => setDraft(saved),
          onUndo: () => {
            setDraft(SAVED);
            setSaved(SAVED);
            status.reset();
          },
          onSave: () => void status.track(async () => setSaved(draft)),
        }}
      >
        <AccountProfileCard name={draft.name} email="eric@example.com" verified verifiedLabel="Vérifié" unverifiedLabel="Non vérifié" memberSince="Membre depuis octobre 2026" avatar={{ defaultAvatar: { brand: "yomizaka", tone: Number(draft.avatar.slice(5)) } }} />
        <Field.Root>
          <Field.Label htmlFor="profile-name">Nom</Field.Label>
          <Input id="profile-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        </Field.Root>
        <AvatarPicker label="Photo de profil" showLabel options={AVATARS} value={draft.avatar} onValueChange={(avatar) => setDraft({ ...draft, avatar })} upload={<Button variant="secondary" size="sm">Téléverser</Button>} />
        <LanguagePicker label="Langue" value={draft.language} onValueChange={(language) => setDraft({ ...draft, language })} languages={[{ code: "fr", name: "Français" }, { code: "en", name: "English" }]} />
        <ChoiceCards
          showLabel
          label="De quel côté du bail êtes-vous ?"
          value={draft.side}
          onValueChange={(side) => setDraft({ ...draft, side })}
          options={[
            { id: "tenant", title: "Locataire", description: "Je loue mon logement." },
            { id: "landlord", title: "Propriétaire", description: "Je loue à quelqu'un." },
          ]}
        />
      </SettingsSection>
    </SettingsLayout>
  );
}
