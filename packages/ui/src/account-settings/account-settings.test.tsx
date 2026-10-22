import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SAVED_VISIBLE_MS, SaveStatus, SettingsSection, useSaveStatus } from "../settings-layout";
import { axeViolations } from "../test/axe";
import { AccountProfileCard, AvatarPicker, ChoiceCards, LanguagePicker } from "./index";

afterEach(() => vi.useRealTimers());

describe("useSaveStatus", () => {
  it("goes saving → saved → idle, and says error without rejecting", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSaveStatus());
    let ok = false;
    await act(async () => {
      ok = await result.current.track(() => Promise.resolve());
    });
    expect(ok).toBe(true);
    expect(result.current.status).toBe(SaveStatus.Saved);
    act(() => void vi.advanceTimersByTime(SAVED_VISIBLE_MS));
    expect(result.current.status).toBe(SaveStatus.Idle);
    await act(async () => {
      ok = await result.current.track(() => Promise.reject(new Error("no")));
    });
    expect(ok).toBe(false);
    expect(result.current.status).toBe(SaveStatus.Error);
    act(() => result.current.reset());
    expect(result.current.status).toBe(SaveStatus.Idle);
  });
});

const labels = { save: "Enregistrer", saving: "Enregistrement…", saved: "Enregistré", error: "Échec", undo: "Annuler", discard: "Rétablir" };

describe("SettingsSection with a save", () => {
  it("disables the save until the section is dirty, saves on submit, and says the result in a live region", async () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <SettingsSection title="Profil" save={{ dirty: false, status: SaveStatus.Idle, onSave, labels }}>
        <input aria-label="Nom" />
      </SettingsSection>,
    );
    expect((screen.getByRole("button", { name: "Enregistrer" }) as HTMLButtonElement).disabled).toBe(true);
    rerender(
      <SettingsSection title="Profil" save={{ dirty: true, status: SaveStatus.Idle, onSave, labels }}>
        <input aria-label="Nom" />
      </SettingsSection>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    rerender(
      <SettingsSection title="Profil" save={{ dirty: false, status: SaveStatus.Saved, onSave, onUndo: vi.fn(), labels }}>
        <input aria-label="Nom" />
      </SettingsSection>,
    );
    expect(screen.getByRole("status").textContent).toContain("Enregistré");
    expect(screen.getByRole("button", { name: "Annuler" })).toBeTruthy();
  });

  it("says an error as an alert and keeps the save enabled to try again", () => {
    render(
      <SettingsSection title="Profil" save={{ dirty: true, status: SaveStatus.Error, onSave: vi.fn(), labels }}>
        <input aria-label="Nom" />
      </SettingsSection>,
    );
    expect(screen.getByRole("alert").textContent).toContain("Échec");
    expect((screen.getByRole("button", { name: "Enregistrer" }) as HTMLButtonElement).disabled).toBe(false);
  });
});

const avatars = [
  { id: "a", label: "Teinte 1", defaultAvatar: { brand: "yomizaka", tone: 1 } },
  { id: "b", label: "Teinte 2", defaultAvatar: { brand: "yomizaka", tone: 2 } },
  { id: "c", label: "Teinte 3", defaultAvatar: { brand: "yomizaka", tone: 3 } },
] as const;

describe("AvatarPicker", () => {
  it("is one named radio group: a tile chooses, the chosen one says so", async () => {
    const onValueChange = vi.fn();
    const { container } = render(<AvatarPicker label="Photo de profil" options={avatars} value="a" onValueChange={onValueChange} />);
    expect(screen.getByRole("radiogroup", { name: "Photo de profil" })).toBeTruthy();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]!.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(radios[1]!);
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("puts the upload action in the grid, after the pictures", () => {
    render(<AvatarPicker label="Photo" options={avatars} value="a" onValueChange={() => {}} upload={<button type="button">Téléverser</button>} />);
    expect(screen.getByRole("button", { name: "Téléverser" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });
});

describe("ChoiceCards", () => {
  it("is a radiogroup of cards named by their title and described by their line", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ChoiceCards
        label="De quel côté du bail êtes-vous ?"
        value="tenant"
        onValueChange={onValueChange}
        options={[
          { id: "tenant", title: "Locataire", description: "Je loue mon logement.", icon: <span aria-hidden>🏠</span> },
          { id: "landlord", title: "Propriétaire", description: "Je loue à quelqu'un." },
        ]}
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "De quel côté du bail êtes-vous ?" });
    expect(group).toBeTruthy();
    const landlord = screen.getByRole("radio", { name: /Propriétaire/ });
    expect(landlord.getAttribute("aria-describedby")).toBeTruthy();
    fireEvent.click(landlord);
    expect(onValueChange).toHaveBeenCalledWith("landlord");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("LanguagePicker", () => {
  it("names each language in its own language under a visible label and tells which is chosen", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <LanguagePicker label="Langue" value="fr" onValueChange={onValueChange} languages={[{ code: "fr", name: "Français" }, { code: "en", name: "English" }]} />,
    );
    expect(screen.getByRole("radiogroup", { name: "Langue" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Français" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("radio", { name: "English" }));
    expect(onValueChange).toHaveBeenCalledWith("en");
    expect(screen.getByRole("radio", { name: "English" }).getAttribute("lang")).toBe("en");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("AccountProfileCard", () => {
  it("shows the name, the e-mail with its verification and the member-since line, and the change action", async () => {
    const { container } = render(
      <AccountProfileCard
        name="Éric Tremblay"
        email="eric@example.com"
        verified
        verifiedLabel="Vérifié"
        unverifiedLabel="Non vérifié"
        memberSince="Membre depuis octobre 2026"
        avatar={{ defaultAvatar: { brand: "yomizaka", seed: "eric" } }}
        action={<button type="button">Changer la photo</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Éric Tremblay" })).toBeTruthy();
    expect(screen.getByText("eric@example.com")).toBeTruthy();
    expect(screen.getByText("Vérifié")).toBeTruthy();
    expect(screen.getByText("Membre depuis octobre 2026")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Changer la photo" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("says when the e-mail is not verified", () => {
    render(<AccountProfileCard name="É" email="e@x.co" verified={false} verifiedLabel="Vérifié" unverifiedLabel="Non vérifié" />);
    expect(screen.getByText("Non vérifié")).toBeTruthy();
  });
});
