import { memoryBus } from "@krizaka/realtime";
import { type QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";

import { createQueryClient } from "../src/client";
import { KrizakaQueryProvider, useLiveInvalidation } from "../src/react";

function Count({ load }: { load: () => Promise<number> }) {
  const { data } = useQuery({ queryKey: ["count"], queryFn: load, staleTime: Infinity });
  return <p>count {data ?? "…"}</p>;
}

function Probe({ onClient }: { onClient: (client: QueryClient) => void }) {
  const client = useQueryClient();
  useEffect(() => onClient(client), [client, onClient]);
  return null;
}

describe("KrizakaQueryProvider", () => {
  it("creates one client per mount with the Krizaka defaults", () => {
    const seen: QueryClient[] = [];
    const onClient = (client: QueryClient) => void seen.push(client);
    const { rerender } = render(
      <KrizakaQueryProvider staleTime={5}>
        <Probe onClient={onClient} />
      </KrizakaQueryProvider>,
    );
    rerender(
      <KrizakaQueryProvider staleTime={5}>
        <Probe onClient={onClient} />
      </KrizakaQueryProvider>,
    );
    expect(new Set(seen).size).toBe(1);
    expect(seen[0]!.getDefaultOptions().queries!.staleTime).toBe(5);
  });

  it("uses the client it is given", () => {
    const client = createQueryClient();
    const onClient = vi.fn();
    render(
      <KrizakaQueryProvider client={client}>
        <Probe onClient={onClient} />
      </KrizakaQueryProvider>,
    );
    expect(onClient).toHaveBeenCalledWith(client);
  });
});

describe("useLiveInvalidation", () => {
  it("refetches on an event while mounted, reads the latest rules, stops when disabled or unmounted", async () => {
    const bus = memoryBus();
    let n = 0;
    const load = async () => ++n;
    function Live() {
      const [enabled, setEnabled] = useState(true);
      const [rule, setRule] = useState("count.changed");
      useLiveInvalidation(bus, { [rule]: [["count"]] }, { enabled });
      return (
        <>
          <button onClick={() => setRule("count.bumped")}>rule</button>
          <button onClick={() => setEnabled(false)}>off</button>
          <Count load={load} />
        </>
      );
    }
    const { unmount } = render(
      <KrizakaQueryProvider>
        <Live />
      </KrizakaQueryProvider>,
    );
    await screen.findByText("count 1");
    await act(() => bus.publish("message", { type: "count.changed", id: 1 }));
    await screen.findByText("count 2");

    fireEvent.click(screen.getByText("rule")); // no re-subscription: the next event reads the new rules
    await act(() => bus.publish("message", { type: "count.changed", id: 2 }));
    await act(() => bus.publish("message", { type: "count.bumped", id: 3 }));
    await screen.findByText("count 3");

    fireEvent.click(screen.getByText("off"));
    await act(() => bus.publish("message", { type: "count.bumped", id: 4 }));
    expect(n).toBe(3);
    unmount();
  });

  it("does nothing without a source", () => {
    function Live() {
      useLiveInvalidation(null, {});
      return <p>idle</p>;
    }
    render(
      <KrizakaQueryProvider>
        <Live />
      </KrizakaQueryProvider>,
    );
    expect(screen.getByText("idle")).toBeTruthy();
  });
});
