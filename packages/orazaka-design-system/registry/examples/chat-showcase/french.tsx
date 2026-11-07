import { ChatShowcase } from "@krizaka/orazaka-design-system";

// The same mockup in French: every word is a prop, translated by the app.
export default function French() {
  return (
    <ChatShowcase
      labels={{
        agent: "Orazaka · Service juridique",
        status: "Sur site · en ligne",
        model: "mistral-small",
        routed: "Répondu en local",
        privacy: "0 octet n'a quitté votre réseau",
        placeholder: "Posez une question sur vos documents…",
      }}
      question="Camille ici — quels contrats contiennent une clause de non-concurrence ?"
      answer="Deux contrats : celui de Hélène Morel (12 mois, Île-de-France) et celui de Bastien Roy (6 mois, sans zone). Aucun autre n'en contient."
      pipeline={["Données masquées", "Politique vérifiée", "Routé en local"]}
    />
  );
}
