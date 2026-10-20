#!/usr/bin/env python3
"""The score of « l'aube »: ACE-Step 1.5 XL turbo (MIT) through the Orazaka media worker's own `generate_music`, on the
Mac's Metal ($0 of GPU), a few seeds to choose from; then its beat grid, so the cut lands on the music.

    <worker venv>/bin/python score.py <worker dir> <treatment.json> <out dir> [--seeds 3] [--seconds 72]

Writes <out>/score-s<seed>.wav and <out>/score-s<seed>.beats.json (onset-strength beats: times in seconds, the tempo).
The prompt is the treatment's `music` line: genre, instruments and tempo only, never an artist or a title.
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def beats(wav: Path, bpm_hint: float) -> dict:
    """Beat times from the onset envelope, phase-locked to the treatment's tempo (pure numpy: no extra dependency)."""
    audio, rate = soundfile.read(str(wav))
    mono = audio.mean(1) if audio.ndim > 1 else audio
    hop = 512
    frames = len(mono) // hop
    energy = np.array([np.sqrt(np.mean(mono[i * hop:(i + 1) * hop] ** 2)) for i in range(frames)])
    onset = np.maximum(0, np.diff(energy, prepend=energy[0]))
    period = 60.0 / bpm_hint * rate / hop
    # The phase whose comb of beats collects the most onset energy.
    best, phase = -1.0, 0.0
    for p in np.linspace(0, period, 64, endpoint=False):
        idx = np.arange(p, frames, period).astype(int)
        score = onset[idx].sum()
        if score > best:
            best, phase = score, p
    times = [round(float(i * hop / rate), 3) for i in np.arange(phase, frames, period)]
    return {"bpm": bpm_hint, "beats": times, "seconds": round(len(mono) / rate, 3)}


def main() -> None:
    worker, plan, out = Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text()), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(worker))
    from app import sound_generators  # noqa: PLC0415

    model = sound_generators.resolve("music", "acestep-v15-xl-turbo")
    seconds = float(arg("seconds", "72"))
    bpm = float(arg("bpm", "90"))
    for k in range(int(arg("seeds", "3"))):
        seed = plan["seedBase"] + 900 + k
        wav = out / f"score-s{seed}.wav"
        if not wav.exists():
            facts = sound_generators.generate_music(model, plan["music"], seconds, str(wav), seed=seed)
            print(json.dumps(facts), flush=True)
        (out / f"score-s{seed}.beats.json").write_text(json.dumps(beats(wav, bpm)))


if __name__ == "__main__":
    main()
