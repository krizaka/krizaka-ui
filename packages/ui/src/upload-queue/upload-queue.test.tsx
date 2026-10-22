import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { axeViolations } from "../test/axe";
import { isWorking, progressOf, QueueStatus, tally } from "./model";
import { TaskTray, UploadQueue } from "./upload-queue";

const items = [
  { id: "a", name: "bail.pdf", status: QueueStatus.Checking, statusText: "Vérification des règles…", progress: 0.6 },
  { id: "b", name: "annexe.pdf", status: QueueStatus.Queued, statusText: "En attente" },
  { id: "c", name: "preuve.pdf", status: QueueStatus.Done, statusText: "Terminé", result: <span>3 constats</span>, trailing: <button type="button">Conserver</button> },
  { id: "d", name: "scan.pdf", status: QueueStatus.Failed, statusText: "Illisible" },
] as const;

describe("model", () => {
  it("works only while reading or checking", () => {
    expect(Object.values(QueueStatus).filter(isWorking)).toEqual(["reading", "checking"]);
  });
  it("tallies the queue and clamps the progress", () => {
    expect(tally(items)).toEqual({ total: 4, working: 1, queued: 1, done: 1, failed: 1 });
    expect([progressOf(-1), progressOf(0.4), progressOf(7), progressOf(undefined), progressOf(Number.NaN)]).toEqual([0, 0.4, 1, undefined, undefined]);
  });
});

describe("UploadQueue", () => {
  it("lists every file with its state in words, live progress on the working one only, and the row's chip and action", async () => {
    const { container } = render(<UploadQueue label="Vérifications en cours" items={items} />);
    expect(screen.getByRole("list", { name: "Vérifications en cours" })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Vérification des règles…")).toBeTruthy();
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(1);
    expect(bars[0]!.getAttribute("aria-valuenow")).toBe("60");
    expect(container.querySelectorAll("[data-working]")).toHaveLength(1);
    expect(screen.getByText("3 constats")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Conserver" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("announces changes politely", () => {
    render(<UploadQueue label="File" items={items} />);
    expect(screen.getByRole("list", { name: "File" }).closest("[aria-live]")?.getAttribute("aria-live")).toBe("polite");
  });
});

describe("TaskTray", () => {
  it("says the tally in its header and folds its list away", () => {
    render(
      <TaskTray title="Vérifications" summary="1 en cours · 1 terminée" toggleLabel="Réduire" openLabel="Afficher">
        <UploadQueue label="File" items={items} />
      </TaskTray>,
    );
    expect(screen.getByText("1 en cours · 1 terminée")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Réduire" }));
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Afficher" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });
});
