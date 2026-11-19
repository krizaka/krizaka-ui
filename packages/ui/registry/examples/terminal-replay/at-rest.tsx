import { TerminalReplay } from "@krizaka/ui/terminal-replay";

// At rest: the whole session is there to read; it plays only when the reader presses play.
export default function TerminalReplayAtRest() {
  return (
    <TerminalReplay
      autoPlay={false}
      label="Terminal session: check the tools"
      title="~/projects — zsh"
      playLabel="Play"
      pauseLabel="Pause"
      replayLabel="Replay"
      rows={7}
      steps={[
        {
          command: "node --version && git --version",
          output: ["v22.12.0", "git version 2.47.1"],
        },
        {
          command: "docker compose version",
          output: [{ text: "Docker Compose version v2.31.0", tone: "success" }],
        },
      ]}
    />
  );
}
