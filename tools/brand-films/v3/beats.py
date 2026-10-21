#!/usr/bin/env python3
"""Where the music really is: the beat grid and the shape of each candidate score, so the cut lands on the beat and on
the drops (no narrator: the music drives the edit). ACE-Step is asked a form (intro, build, drop, break, drop, outro);
this measures whether a take of it follows that form, and picks the best.

    <venv with librosa>/bin/python beats.py <treatment.json> <score dir> [--pick]

For each score-s<seed>.wav: the measured tempo, the first downbeat (the bar grid is laid from it), the loudness of
every bar (dB), the correlation of that energy with the form's expected shape (intro low … drop high … break low …),
and the energy contrast of each drop over the section before it. Writes <score dir>/beats.json; --pick prints the best.
"""
import json
import sys
from pathlib import Path

import numpy as np

#: The energy a section is expected to have, 0 (quiet) … 1 (full): the shape a good take follows.
SHAPE = {"intro": 0.2, "build": 0.55, "drop": 1.0, "break": 0.15, "outro": 0.3}


def expected(form: list[dict]) -> np.ndarray:
    """The form's expected energy, one value per bar (pure)."""
    return np.concatenate([np.full(f["bars"], SHAPE.get(f["section"], 0.5)) for f in form])


def bar_energy(y: np.ndarray, sr: int, start: float, bar: float, bars: int) -> np.ndarray:
    """RMS loudness of each bar from `start`, in dB (pure)."""
    out = []
    for k in range(bars):
        a, b = int((start + k * bar) * sr), int((start + (k + 1) * bar) * sr)
        seg = y[a:b] if b <= len(y) else y[a:]
        out.append(20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) if len(seg) else -90.0)
    return np.array(out)


def shape_score(energy: np.ndarray, want: np.ndarray) -> float:
    """How well the bars' loudness follows the form (Pearson correlation, -1 … 1) (pure)."""
    n = min(len(energy), len(want))
    e, w = energy[:n], want[:n]
    if np.std(e) < 1e-6:
        return 0.0
    return float(np.corrcoef(e, w)[0, 1])


def drop_contrast(energy: np.ndarray, form: list[dict]) -> list[float]:
    """For each drop, its mean loudness over the section before it, in dB (a drop that does not drop is ~0) (pure)."""
    out, at = [], 0
    for i, f in enumerate(form):
        if f["section"] == "drop" and i > 0:
            before = energy[at - form[i - 1]["bars"]:at]
            here = energy[at:at + f["bars"]]
            if len(before) and len(here):
                out.append(round(float(np.mean(here) - np.mean(before)), 2))
        at += f["bars"]
    return out


def main() -> None:
    import librosa  # noqa: PLC0415

    t = json.loads(Path(sys.argv[1]).read_text())
    folder = Path(sys.argv[2])
    score = t["score"]
    bars = sum(f["bars"] for f in score["form"])
    want = expected(score["form"])
    report = []
    for wav in sorted(folder.glob("score-s*.wav")):
        y, sr = librosa.load(str(wav), sr=22050, mono=True)
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr, start_bpm=score["bpm"], units="time", tightness=400)
        tempo = float(np.atleast_1d(tempo)[0])
        # The take's own tempo can be off by a little: the grid uses the asked tempo, phased on the measured beats.
        beat = 60.0 / score["bpm"]
        first = float(beats[0]) if len(beats) else 0.0
        phase = float(np.median(((np.array(beats) - first) % beat))) if len(beats) else 0.0
        start = first + (phase if phase < beat / 2 else phase - beat)
        energy = bar_energy(y, sr, start, 4 * beat, bars)
        peak = float(np.max(np.abs(librosa.load(str(wav), sr=None, mono=False)[0])))
        report.append({"file": wav.name, "tempo": round(tempo, 1), "start": round(start, 3), "shape": round(shape_score(energy, want), 3),
                       "drops": drop_contrast(energy, score["form"]), "bars": [round(float(e), 1) for e in energy], "peak": round(peak, 3)})
        print(report[-1]["file"], report[-1]["tempo"], report[-1]["shape"], report[-1]["drops"], flush=True)
    good = [r for r in report if abs(r["tempo"] - score["bpm"]) < 3 or abs(r["tempo"] * 2 - score["bpm"]) < 3 or abs(r["tempo"] / 2 - score["bpm"]) < 3]
    best = max(good or report, key=lambda r: r["shape"] + 0.05 * sum(r["drops"]))
    (folder / "beats.json").write_text(json.dumps({"bpm": score["bpm"], "best": best["file"], "takes": report}, indent=1))
    if "--pick" in sys.argv:
        print("best:", best["file"])


if __name__ == "__main__":
    main()
