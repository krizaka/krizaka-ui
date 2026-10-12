import { LegalPage } from "@krizaka/ui/legal-page";

// TEMPLATE — a policy: the date in force, the short version in plain words, then the sections with their contents
// beside them (chips on a phone).
export default function LegalPagePrivacy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="Last updated: October 2026"
      summary="In short: we collect what you send us, keep it in Québec, never sell it, and delete it when you ask."
      tocLabel="On this page"
      sections={[
        { id: "collect", title: "What we collect", children: <p>Your email and your message, when you write to us.</p> },
        { id: "keep", title: "Where it is kept", children: <p>On servers in Québec, encrypted at rest.</p> },
        { id: "rights", title: "Your rights", children: <p>Ask for a copy or for deletion at any time; we answer within 30 days.</p> },
      ]}
    />
  );
}
