#!/usr/bin/env python3
"""The score's arrangement, made on the beat grid (no narrator: the music drives the cut). Measured on « le courant »:
ACE-Step keeps one energy from start to end whatever form it is asked (its bars stay within ±2 dB), so the drops, the
breaks and the silences are not left to the model. It makes the groove; this arranges it like a producer would, with
filters, cuts and hits placed exactly on the grid the edit uses:

- the take's real tempo is measured (onset autocorrelation, refined to 0.01 BPM) and the take is stretched to the film's
  tempo (Rubber Band, crisp transients), then its first downbeat is found;
- **intro** — the groove low-passed (the sub and the kick through a wall), slowly opening;
- **build** — a high-pass that opens down, a noise riser, a snare roll that doubles, and one beat of silence before the drop;
- **drop** — the groove in full, a sub impact on the first downbeat;
- **break** — the treatment's silence first (« silence as a weapon »), then the groove under water with a heartbeat kick;
- **outro** — the filter closes, a last impact rings out.

    <venv with numpy, scipy, soundfile>/bin/python arrange.py <treatment.json> <score.wav> <out dir> [--from-bar 2]

Writes <out>/score.wav (48 kHz stereo, peak -1 dBFS before the master) and <out>/grid.json (bpm, the beat times, every
section's start, the drops): what edit.py cuts to. Pure helpers are tested in v3.test.mjs.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

SR = 48000


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def sections(form: list[dict], bpm: float, start: float = 0.0) -> list[dict]:
    """Each section's start and end in seconds on the grid (pure)."""
    bar = 4 * 60.0 / bpm
    out, t = [], start
    for i, f in enumerate(form):
        out.append({"index": i, "section": f["section"], "start": round(t, 4), "end": round(t + f["bars"] * bar, 4), "bars": f["bars"]})
        t += f["bars"] * bar
    return out


def tempo_of(onset: np.ndarray, hop_seconds: float, around: float) -> float:
    """The tempo whose beat period best matches the onset envelope's autocorrelation, within ±12 % of `around` (pure)."""
    x = onset - onset.mean()
    ac = np.correlate(x, x, "full")[len(x) - 1:]
    best, value = around, -np.inf
    for bpm in np.arange(around * 0.88, around * 1.12, 0.01):
        lag = 60.0 / bpm / hop_seconds
        score = 0.0
        for k in (1, 2, 4):  # the beat, the half bar, the bar
            i = lag * k
            lo = int(i)
            if lo + 1 < len(ac):
                score += ac[lo] + (ac[lo + 1] - ac[lo]) * (i - lo)
        if score > value:
            best, value = float(bpm), score
    return round(best, 2)


def beat_phase(flux: np.ndarray, period: float) -> int:
    """The frame offset (0 … period) whose beat grid, laid at the exact (fractional) period, collects the most onset
    energy (pure: rounding the period would drift a frame every few beats and land the grid between the beats)."""
    best, value = 0, -1.0
    for p in range(int(np.ceil(period))):
        idx = np.round(p + np.arange(0, (len(flux) - p) / period) * period).astype(int)
        idx = idx[idx < len(flux)]
        v = float(flux[idx].sum())
        if v > value:
            best, value = p, v
    return best


def onset_flux(mono: np.ndarray, hop: int) -> np.ndarray:
    """The onset strength every `hop` samples (librosa's mel spectral flux, the same measure its beat tracker uses)."""
    import librosa  # noqa: PLC0415
    if len(mono) < 4096:
        return np.zeros(1)
    y = librosa.resample(mono.astype("float32"), orig_sr=SR, target_sr=24000)
    return librosa.onset.onset_strength(y=y, sr=24000, hop_length=hop // 2, center=True)


def local_shift(audio: np.ndarray, start: float, seconds: float, beat: float) -> int:
    """Samples to shift a section's slice so its onsets land on the grid (within ±half a beat), measured on the slice."""
    hop = int(0.005 * SR)
    a = int(start * SR)
    span = int(seconds * SR)
    best, value = 0, -1.0
    lo = max(0, a - int(beat * SR))
    flux = onset_flux(audio[lo: a + span + int(beat * SR)].mean(1), hop)
    period = beat / 0.005
    base = (a - lo) // hop
    for d in range(-int(period / 2), int(period / 2) + 1):
        idx = np.round(base + d + np.arange(0, seconds / beat) * period).astype(int)
        idx = idx[(idx >= 0) & (idx < len(flux))]
        v = float(flux[idx].sum())
        if v > value:
            best, value = d, v
    return best * hop


def best_window(audio: np.ndarray, seconds: float, bar: float, beat: float, used: list[float]) -> float:
    """The start (on a bar) of the stretch of `seconds` with the strongest on-grid beats × loudness, not one already used."""
    best, value = 0.0, -1.0
    total = len(audio) / SR
    k = 0
    while k * bar + seconds <= total - 1:
        start = k * bar
        if not any(abs(start - u) < seconds / 2 for u in used):
            seg = audio[int(start * SR): int((start + seconds) * SR)].mean(1)
            hop = int(0.005 * SR)
            env = np.abs(seg[: len(seg) // hop * hop]).reshape(-1, hop).mean(1)
            flux = np.maximum(0, np.diff(env, prepend=env[0]))
            period = beat / 0.005
            on = max(float(flux[np.round(p + np.arange(0, seconds / beat - 1) * period).astype(int)].mean()) for p in range(int(period)))
            v = on / (flux.mean() + 1e-9) * np.sqrt(np.mean(seg ** 2))
            if v > value:
                best, value = start, v
        k += 1
    return best


def butter(kind: str, cutoff: float, order: int = 4):
    from scipy.signal import butter as _b  # noqa: PLC0415
    return _b(order, min(max(cutoff, 20.0), SR / 2 - 100) / (SR / 2), btype=kind, output="sos")


def sweep(x: np.ndarray, kind: str, start_hz: float, end_hz: float, block: int = 2048) -> np.ndarray:
    """A filter whose cutoff glides from start to end (exponentially), block by block with its state carried (pure)."""
    from scipy.signal import sosfilt, sosfilt_zi  # noqa: PLC0415
    out = np.zeros_like(x)
    n = x.shape[0]
    zi = None
    for a in range(0, n, block):
        t = a / max(1, n - 1)
        hz = start_hz * (end_hz / start_hz) ** t
        sos = butter(kind, hz, 2)
        if zi is None:
            zi = sosfilt_zi(sos)[:, :, None] * x[a][None, None, :]
        y, zi = sosfilt(sos, x[a:a + block], axis=0, zi=zi)
        out[a:a + block] = y
    return out


def impact(seconds: float = 1.6, seed: int = 0) -> np.ndarray:
    """A sub drop and a noise crack: the hit that marks a drop (stereo, pure)."""
    rng = np.random.default_rng(seed)
    t = np.arange(int(seconds * SR)) / SR
    f = 55 * np.exp(-t * 1.2) + 30
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crack = rng.normal(0, 1, len(t)) * np.exp(-t * 18)
    m = 0.9 * sub + 0.25 * crack
    return np.stack([m, m], 1)


def riser(seconds: float, seed: int = 1) -> np.ndarray:
    """Filtered noise climbing in pitch and level over `seconds` (stereo, pure)."""
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    noise = rng.normal(0, 1, (n, 2))
    up = sweep(noise, "highpass", 200, 6000)
    return up * np.linspace(0, 1, n)[:, None] ** 2 * 0.35


def roll(seconds: float, bpm: float, seed: int = 2) -> np.ndarray:
    """A snare roll that doubles each bar: 8ths, 16ths, 32nds (stereo, pure)."""
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    out = np.zeros((n, 2))
    beat = 60.0 / bpm
    hit = rng.normal(0, 1, int(0.06 * SR)) * np.exp(-np.arange(int(0.06 * SR)) / SR * 60)
    t, k = 0.0, 0
    while t < seconds:
        step = beat / (2 ** (1 + int(3 * t / seconds)))
        a = int(t * SR)
        seg = hit[: max(0, min(len(hit), n - a))] * (0.15 + 0.5 * t / seconds)
        out[a:a + len(seg)] += seg[:, None]
        t += step
        k += 1
    return out


def heartbeat(seconds: float, bpm: float) -> np.ndarray:
    """A soft low kick on beats 1 and 3 (stereo, pure)."""
    n = int(seconds * SR)
    out = np.zeros((n, 2))
    beat = 60.0 / bpm
    t = np.arange(int(0.25 * SR)) / SR
    kick = np.sin(2 * np.pi * (45 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 14) * 0.6
    b = 0.0
    while b < seconds:
        a = int(b * SR)
        seg = kick[: max(0, min(len(kick), n - a))]
        out[a:a + len(seg)] += seg[:, None]
        b += 2 * beat
    return out


def fade(x: np.ndarray, seconds_in: float = 0.004, seconds_out: float = 0.004) -> np.ndarray:
    y = x.copy()
    a, b = int(seconds_in * SR), int(seconds_out * SR)
    if a:
        y[:a] *= np.linspace(0, 1, a)[:, None]
    if b:
        y[-b:] *= np.linspace(1, 0, b)[:, None]
    return y


def main() -> None:
    import soundfile  # noqa: PLC0415
    from scipy.signal import sosfilt  # noqa: PLC0415

    t = json.loads(Path(sys.argv[1]).read_text())
    src, out = Path(sys.argv[2]), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    score = t["score"]
    bpm = float(score["bpm"])
    # 1. the take's tempo, then stretched to the film's.
    import librosa  # noqa: PLC0415
    y22, sr22 = librosa.load(str(src), sr=22050, mono=True)
    hop = 256
    onset = librosa.onset.onset_strength(y=y22, sr=sr22, hop_length=hop)
    measured = tempo_of(onset, hop / sr22, bpm) if "--tempo" not in sys.argv else float(arg("tempo"))
    if abs(measured * 2 - bpm) < abs(measured - bpm):
        measured *= 2
    with tempfile.TemporaryDirectory() as tmp:
        stretched = Path(tmp) / "s.wav"
        subprocess.run(["rubberband", "-q", "--crisp", "6", "-T", f"{bpm / measured:.6f}", str(src), str(stretched)], check=True)
        audio, sr = soundfile.read(str(stretched), always_2d=True)
    if sr != SR:
        raise SystemExit(f"rubberband wrote {sr} Hz")
    # 2. the first downbeat of the stretched take: the strongest beat phase over the loud part.
    mono = audio.mean(1)
    beat = 60.0 / bpm
    env = np.abs(mono)
    hop48 = int(0.005 * SR)
    frames = env[: len(env) // hop48 * hop48].reshape(-1, hop48).mean(1)
    flux = np.maximum(0, np.diff(frames, prepend=frames[0]))
    period = beat / 0.005
    first = beat_phase(flux, period) * 0.005
    bar = 4 * beat
    from_bar = int(arg("from-bar", "2"))
    origin = first + from_bar * bar
    total_bars = sum(f["bars"] for f in score["form"])
    need = int(total_bars * bar * SR) + int(4 * SR)
    groove = audio[int(origin * SR):]
    while len(groove) < need:  # a short take loops on whole bars
        whole = int((len(audio) - origin * SR) // (bar * SR) * bar * SR)
        groove = np.concatenate([groove, audio[int(origin * SR): int(origin * SR) + whole]])
    groove = groove[:need]
    mix = np.zeros((need, 2))
    grid = sections(score["form"], bpm)
    silences = {(s["section"], s.get("atBeat", 0)): s["beats"] for s in score.get("silence", [])}
    drops, drops_src = [], []
    for s in grid:
        a, b = int(s["start"] * SR), int(s["end"] * SR)
        # AI music drifts: each section is re-phased on its own beats (a shift of at most half a beat at a section change).
        src_start = s["start"]
        if s["section"] == "drop":  # a drop takes the take's most driving stretch (strong beats on the grid, loud)
            src_start = best_window(groove, s["end"] - s["start"], bar, beat, used=drops_src)
            drops_src.append(src_start)
        shift = local_shift(groove, src_start, s["end"] - s["start"], beat) if s["section"] != "intro" else 0
        a2 = max(0, int(src_start * SR) + shift)
        part = groove[a2:a2 + (b - a)].copy()
        if len(part) < b - a:
            part = np.concatenate([part, np.zeros((b - a - len(part), 2))])
        kind = s["section"]
        if kind == "intro":
            part = sweep(part, "lowpass", 180, 900) * 0.45
        elif kind == "build":
            part = sweep(part, "highpass", 1200, 60) * 0.8
            part += riser(len(part) / SR)[: len(part)]
            part += roll(len(part) / SR, bpm)[: len(part)]
            gap = int(beat * SR)
            part[-gap:] *= np.linspace(1, 0, gap)[:, None] ** 4  # one beat of near silence before the drop
        elif kind == "drop":
            hit = impact(seed=s["index"])
            part[: len(hit)] += hit[: len(part)] * 0.8
            if any(d for d in drops):
                part *= 1.12  # the second drop a little bigger
            drops.append(s["start"])
        elif kind == "break":
            part = sosfilt(butter("lowpass", 320), part, axis=0) * 0.32
            part += heartbeat(len(part) / SR, bpm)[: len(part)]
        elif kind == "outro":
            part = sweep(part, "lowpass", 6000, 220) * np.linspace(1, 0, len(part))[:, None] ** 1.5
            ring = impact(3.0, seed=99) * 0.6
            part[: len(ring)] += ring[: len(part)]
        for (sec, at), beats in silences.items():
            if sec == kind:
                z0, z1 = int(at * beat * SR), int((at + beats) * beat * SR)
                part[z0:z1] *= 0.0
        mix[a:b] += fade(part)
    end = int(grid[-1]["end"] * SR) + int(score.get("tailSeconds", 3) * SR)
    mix = mix[:end]
    tail = int(2.5 * SR)
    mix[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 2
    mix *= 10 ** (-1 / 20) / max(1e-9, np.abs(mix).max())
    soundfile.write(str(out / "score.wav"), mix.astype("float32"), SR)
    beats_at = [round(i * beat, 4) for i in range(int(grid[-1]["end"] / beat) + 1)]
    (out / "grid.json").write_text(json.dumps({"bpm": bpm, "measured": measured, "source": src.name, "sections": grid, "drops": drops,
                                               "beats": beats_at}, indent=1))
    print(out / "score.wav", "measured", measured, "→", bpm, "drops at", drops, flush=True)


if __name__ == "__main__":
    main()
