import { TerminalReplay } from "@krizaka/ui/terminal-replay";

// A real session played back: each command typed at the prompt, then its output, line by line.
export default function TerminalReplaySession() {
  return (
    <TerminalReplay
      label="Terminal session: create, install, start"
      title="~/projects — zsh"
      playLabel="Play"
      pauseLabel="Pause"
      replayLabel="Replay"
      copyLabel="Copy commands"
      copiedLabel="Copied"
      rows={12}
      steps={[
        { command: "mkdir shop && cd shop", output: [] },
        {
          command: "npm install @krizaka/ui",
          output: [{ text: "added 12 packages in 2s", tone: "success" }, { text: "found 0 vulnerabilities", tone: "muted" }],
        },
        {
          command: "npm run dev",
          output: [{ text: "▲ Next.js 16", tone: "accent" }, "- Local: http://localhost:3000", { text: "✓ Ready in 1.4s", tone: "success" }],
        },
      ]}
    />
  );
}
