import { StepShowcase } from "@krizaka/ui/step-showcase";

const still = (n: number) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 195"><rect width="90" height="195" fill="#1b1f2a"/><text x="45" y="100" fill="#8a93a6" font-size="28" text-anchor="middle">${n}</text></svg>`)}`;

// The real app, step by step: one phone, the steps beside it, each recording then the next (here, stills of 4 s).
export default function StepShowcasePhone() {
  return (
    <StepShowcase
      label="Orazaka in your pocket"
      device="phone"
      steps={[
        { id: "sign-in", title: "Sign in", description: "Your workspace, on your phone.", poster: still(1), alt: "The sign-in screen", duration: 4000 },
        { id: "image", title: "Make an image", description: "A Studio, a prompt, the result.", poster: still(2), alt: "A Studio run", duration: 4000 },
        { id: "ask", title: "Ask the model", description: "Answers from your own models.", poster: still(3), alt: "The chat", duration: 4000 },
        { id: "jobs", title: "Follow your jobs", description: "Every run, its state and its result.", poster: still(4), alt: "The jobs list", duration: 4000 },
      ]}
    />
  );
}
