import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { Field, Input, Textarea } from "../field/field";
import { AlertDialog } from "./alert-dialog";
import { Dialog, Sheet } from "./dialog";

/**
 * `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close` on Radix Dialog: focus trap, scroll lock,
 * Escape, outside click and focus return come from Radix. `placement` center · bottom · right, `size` sm · md · lg,
 * `closeLabel` required. `Sheet` = `Dialog.Content placement="bottom"`. Opened at load here (`defaultOpen`): the
 * screenshot covers the viewport, where the portal renders.
 */
const meta = {
  title: "Primitives/Dialog",
  component: Dialog.Content,
  args: { closeLabel: "Close" },
  parameters: { capture: "viewport" },
} satisfies Meta<typeof Dialog.Content>;
export default meta;

type Story = StoryObj<typeof meta>;

const Example: Story["render"] = (args) => (
  <Dialog.Root defaultOpen>
    <Dialog.Trigger asChild>
      <Button>Open</Button>
    </Dialog.Trigger>
    <Dialog.Content {...args}>
      <Dialog.Header>
        <Dialog.Title>Invite a collaborator</Dialog.Title>
        <Dialog.Description>They get access to the drafts of this channel.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <Field.Root>
          <Field.Label htmlFor="invite-email">Email</Field.Label>
          <Input id="invite-email" type="email" placeholder="name@example.com" />
        </Field.Root>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="ghost">Cancel</Button>
        </Dialog.Close>
        <Button variant="primary">Send the invitation</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);

/** Centred, `size="md"`. */
export const Center: Story = { render: Example };

/** `placement="bottom"`: a sheet on a phone, centred from `sm` up. */
export const Bottom: Story = { render: Example, args: { placement: "bottom" } };

/** `placement="right"`: a side panel, full height. */
export const Right: Story = { render: Example, args: { placement: "right" } };

/** A form in a `Sheet`, `size="lg"`. */
export const SheetForm: Story = {
  render: (args) => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <Button>Edit</Button>
      </Dialog.Trigger>
      <Sheet closeLabel={args.closeLabel ?? "Close"} size="lg">
        <Dialog.Header>
          <Dialog.Title>Edit the video</Dialog.Title>
          <Dialog.Description>The title and the description are public.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-4">
          <Field.Root>
            <Field.Label htmlFor="video-title">Title</Field.Label>
            <Input id="video-title" defaultValue="Night ride across the city" />
          </Field.Root>
          <Field.Root>
            <Field.Label htmlFor="video-description">Description</Field.Label>
            <Textarea id="video-description" defaultValue="Ten minutes of neon, rain and empty avenues." />
          </Field.Root>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Save</Button>
        </Dialog.Footer>
      </Sheet>
    </Dialog.Root>
  ),
};

/**
 * `AlertDialog`, `tone="danger"`: `confirmLabel`, `cancelLabel`, an async `onConfirm` (the button loads until it
 * settles; the dialog closes when it resolves, stays open when it rejects).
 */
export const AlertDestructive: Story = {
  render: () => (
    <AlertDialog
      defaultOpen
      trigger={<Button variant="danger">Delete the video</Button>}
      title="Delete this video?"
      description="Its views, comments and earnings history go with it. This cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Keep it"
      tone="danger"
      onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
    />
  ),
};

/**
 * A gate the user must answer (age, terms): `hideClose` and `dismissible={false}` — no close button, Escape and the
 * overlay do nothing; it closes through its own actions.
 */
export const Gate: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Content hideClose dismissible={false} size="sm">
        <Dialog.Header className="pr-5">
          <Dialog.Title>Are you 18 or older?</Dialog.Title>
          <Dialog.Description>This channel shows content for adults only.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="ghost">Leave</Button>
          <Dialog.Close asChild>
            <Button variant="primary">I am 18 or older</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};
