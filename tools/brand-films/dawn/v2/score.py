#!/usr/bin/env python3
"""The score of « l'aube » v2: one cue per entry of the music map (a beat of the story, or a place of the journey with its genre), each from its own prompt
(the treatment's `music.cues`: instruments, mood, tempo — never an artist or a title), made by ACE-Step 1.5 XL turbo (MIT)
through the Orazaka media worker's `generate_music`, on the Mac's Metal ($0 of GPU). The mix (`app/mixer.py`) lays them on
the timeline at the level each cue's intensity asks, crossfaded, and ducks them under the narrator.

    <worker venv>/bin/python score.py <worker> <treatment.json> <timeline.json> <out dir> [--seeds 2]

Writes <out>/<beat>-s<seed>.wav (each cue as long as its beat plus the crossfade; ACE-Step's shortest piece is 10 s).
"""
import json
import sys
from pathlib import Path

CROSSFADE = 1.5
TAIL = 8.0


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def main() -> None:
    worker, treatment = Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text())
    timeline, out = json.loads(Path(sys.argv[3]).read_text()), Path(sys.argv[4])
    out.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(worker))
    from app import sound_generators  # noqa: PLC0415

    model = sound_generators.resolve("music", "acestep-v15-xl-turbo")
    # One cue per entry of the music map, in order: by beat (« hook ») or by place (« 2-hip-hop »), its own prompt.
    only = set(arg("only").split(",")) if arg("only") else None
    for k, (cue, span) in enumerate(zip(treatment["music"]["cues"], timeline["music"], strict=True)):
        name = span["id"]
        if only and name not in only:
            continue
        # ACE-Step lets a piece die away over its last ~5 s: asked longer than the span, the cue is trimmed by the mix.
        seconds = max(10.0, span["end"] - span["start"] + CROSSFADE + TAIL)
        for s in range(int(arg("seeds", "2"))):
            seed = treatment["seedBase"] + 900 + 10 * k + s
            wav = out / f"{name}-s{seed}.wav"
            if not wav.exists():
                facts = sound_generators.generate_music(model, cue["prompt"], seconds, str(wav), seed=seed)
                print(name, json.dumps(facts), flush=True)


if __name__ == "__main__":
    main()
