import { render } from "@testing-library/react";

import { KrizakaDevtools } from "../src/devtools";
import { KrizakaQueryProvider } from "../src/react";

describe("KrizakaDevtools", () => {
  it("mounts beside the provider", () => {
    const { container } = render(
      <KrizakaQueryProvider>
        <KrizakaDevtools />
      </KrizakaQueryProvider>,
    );
    expect(container).toBeTruthy();
  });
});
