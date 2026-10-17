import { StepShowcase } from "@krizaka/ui/step-showcase";

const still = (n: number) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#1b1f2a"/><text x="80" y="58" fill="#8a93a6" font-size="22" text-anchor="middle">${n}</text></svg>`)}`;

// A macOS window: the control panel, the local stack starting, the workspace, a run.
export default function StepShowcaseDesktop() {
  return (
    <StepShowcase
      label="Orazaka on your Mac"
      device="desktop"
      deviceTitle="Orazaka"
      steps={[
        { id: "panel", title: "The control panel", description: "Connected to your workspace, or local.", poster: still(1), alt: "The control panel", duration: 4000 },
        { id: "start", title: "Start the local stack", description: "Each service turns green.", poster: still(2), alt: "Services starting", duration: 4000 },
        { id: "open", title: "Open the workspace", description: "The same app, on your Mac.", poster: still(3), alt: "The workspace", duration: 4000 },
      ]}
    />
  );
}
