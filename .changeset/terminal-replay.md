---
"@krizaka/ui": minor
---

`@krizaka/ui/terminal-replay` — `TerminalReplay`: a terminal session played back, each command typed at the prompt and
its output line by line, the screen following the last line. Rendered whole by the server (no JavaScript, reduced
motion and assistive technology read the full transcript), a fixed-height screen (no layout shift), starts when it
scrolls into view and waits off screen, play · pause · replay controls and an optional copy of the commands;
`autoPlay={false}` keeps it at rest. Web, beta.
