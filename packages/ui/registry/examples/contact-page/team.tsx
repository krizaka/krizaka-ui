import { Button } from "@krizaka/ui/button";
import { ContactPage } from "@krizaka/ui/contact-page";
import { Field, Input, Textarea } from "@krizaka/ui/field";
import { LinkCard } from "@krizaka/ui/link-card";
import { Mascot } from "@krizaka/ui/mascots";

// TEMPLATE — reaching the team: the public channels as cards beside the private form, then what happens after sending.
// On a phone the form comes after the channels, its fields at full width.
export default function ContactPageTeam() {
  return (
    <ContactPage
      eyebrow="Contact"
      title="Talk to the people who build it"
      lead="A person answers within two working days, in English or in French."
      aside={<Mascot bird="flamingo" mood="welcome" size={112} />}
      channels={
        <>
          <LinkCard href="https://github.com/orgs/krizaka/discussions" title="Discussions" description="Questions and ideas, in public." titleAs="span" />
          <LinkCard href="https://github.com/krizaka" title="Report a problem" description="An issue on the repository." titleAs="span" />
        </>
      }
      form={
        <form className="flex flex-col gap-4">
          <Field.Root>
            <Field.Label htmlFor="contact-email">Email</Field.Label>
            <Input id="contact-email" type="email" autoComplete="email" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor="contact-message">Message</Field.Label>
            <Textarea id="contact-message" rows={4} />
          </Field.Root>
          <Button type="submit" variant="primary" size="lg">Send</Button>
        </form>
      }
      next={{ title: "What happens next", steps: [{ title: "We read it", text: "The same day, on working days." }, { title: "We answer", text: "Within two working days." }] }}
    />
  );
}
