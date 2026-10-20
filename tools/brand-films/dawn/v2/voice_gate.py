#!/usr/bin/env python3
"""The voice gate of « l'aube » v2 (ADR-080 addendum v2.3): every narrator take measured, the « MOS-like » score the
pack can compute without an ear — intelligibility (Whisper large-v3-turbo, WER), pitch movement (F0 range and motion in
semitones: a flat « GPS » voice moves little), pauses and speaking rate — beside v1's narrator for the same purpose.
A person's listen of the blind A/B decides the rest.

    <eval venv>/bin/python voice_gate.py <treatment.json> <voice dir> [<v1 voice dir>] > voice-gate.json
    <eval venv>/bin/python voice_gate.py <treatment.json> <voice dir> --pick      the best take of each line becomes the line

A take (`<language>-<id>-s<seed>.wav`, voice.py --suffix) is picked by: every word heard (lowest WER), then the most pitch
movement; the line's first take is kept as `-s7.wav`. The voice report is updated with the picked take's length.
"""
import shutil
import json
import re
import sys
from pathlib import Path

import jiwer
import librosa
import numpy as np
import torch
from transformers import pipeline

ASR = "openai/whisper-large-v3-turbo"
#: A take passes when every word is heard and its pitch moves like a storyteller's (v1's Kokoro moved 8.6–11 st).
MAX_WER = 0.1
MIN_F0_RANGE = 11.5


def words(s: str) -> list[str]:
    return re.sub(r"[^\w\s']", " ", s.lower().replace("’", "'")).split()


def measure(asr, path: Path, text: str, language: str) -> dict:
    y, sr = librosa.load(str(path), sr=16000)
    heard = asr({"raw": y, "sampling_rate": sr}, generate_kwargs={"language": "english" if language == "en" else "french"})["text"]
    f0, voiced, _ = librosa.pyin(y, fmin=70, fmax=500, sr=sr, frame_length=1024)
    st = 12 * np.log2(f0[voiced] / np.nanmedian(f0[voiced])) if voiced.any() else np.array([0.0])
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=256)[0]
    seconds = len(y) / sr
    wer = jiwer.wer(" ".join(words(text)), " ".join(words(heard)))
    f0_range = float(np.percentile(st, 95) - np.percentile(st, 5))
    return {"seconds": round(seconds, 2), "wer": round(wer, 3), "f0RangeSt": round(f0_range, 2),
            "f0MotionSt": round(float(np.nanmean(np.abs(np.diff(st)))), 3) if len(st) > 1 else 0.0,
            "pauseRatio": round(float((rms < 0.1 * np.median(rms[rms > 0])).mean()), 3),
            "wordsPerSecond": round(len(words(text)) / seconds, 2), "heard": heard.strip(),
            "pass": bool(wer <= MAX_WER and f0_range >= MIN_F0_RANGE)}


def pick(asr, treatment: dict, voice: Path) -> list[dict]:
    report_file = voice / "voice-report.json"
    report = json.loads(report_file.read_text())
    chosen = []
    for line in treatment["lines"]:
        for language in ("en", "fr"):
            main_take = voice / f"{language}-{line['id']}.wav"
            first = voice / f"{language}-{line['id']}-s7.wav"
            if main_take.exists() and not first.exists():
                shutil.copy(main_take, first)
            takes = sorted(voice.glob(f"{language}-{line['id']}-s*.wav"))
            if not takes:
                continue
            scored = [(t, measure(asr, t, line[language], language)) for t in takes]
            best, facts = min(scored, key=lambda x: (x[1]["wer"], -x[1]["f0RangeSt"]))
            shutil.copy(best, main_take)
            report = [r for r in report if not (r["id"] == line["id"] and r["language"] == language)]
            report.append({"id": line["id"], "language": language, "text": line[language], "seconds": facts["seconds"], "take": best.name})
            chosen.append({"id": line["id"], "language": language, "take": best.name, "of": len(takes), **facts})
    report_file.write_text(json.dumps(report, indent=1, ensure_ascii=False))
    return chosen


def main() -> None:
    treatment = json.loads(Path(sys.argv[1]).read_text())
    voice = Path(sys.argv[2])
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    asr = pipeline("automatic-speech-recognition", model=ASR, device=device, torch_dtype=torch.float16)
    if "--pick" in sys.argv:
        print(json.dumps(pick(asr, treatment, voice), indent=1, ensure_ascii=False))
        return
    out = {"v2": [], "v1": []}
    for line in treatment["lines"]:
        for language in ("en", "fr"):
            path = voice / f"{language}-{line['id']}.wav"
            if path.exists():
                out["v2"].append({"id": line["id"], "language": language, **measure(asr, path, line[language], language)})
    if len(sys.argv) > 3:  # v1's narrator: <language>-<k>.wav and its report
        v1 = Path(sys.argv[3])
        for r in json.loads((v1 / "voice-report.json").read_text()):
            path = v1 / f"{r['language']}-{r['k']:02d}.wav"
            out["v1"].append({"k": r["k"], "language": r["language"], **measure(asr, path, r["text"], r["language"])})
    for side in ("v1", "v2"):
        rows = out[side]
        if rows:
            out[f"{side}Summary"] = {"takes": len(rows), "passing": sum(r["pass"] for r in rows),
                                     "medianF0RangeSt": round(float(np.median([r["f0RangeSt"] for r in rows])), 2),
                                     "meanWer": round(float(np.mean([r["wer"] for r in rows])), 3)}
    print(json.dumps(out, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
