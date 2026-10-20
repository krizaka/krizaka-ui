#!/usr/bin/env python3
"""The narrator of « l'aube »: the film's exact lines (the treatment's titles, then its cues in the order the edit shows
them), spoken by Kokoro-82M (Apache-2.0; its own synthetic voices, no real person's) — af_heart in English, ff_siwis in
French. On the Mac's CPU: $0 of GPU.

    <worker venv>/bin/python voice.py <treatment.json> <edl.json> <out dir>

Writes <out>/<language>-<k>.wav, k in the order finish.py draws the texts, and <out>/voice-report.json.
"""
import json
import sys
import time
from pathlib import Path

import numpy as np
import soundfile

VOICES = {"en": ("a", "af_heart", 0.92), "fr": ("f", "ff_siwis", 0.9)}
REPO = "hexgrad/Kokoro-82M"


def lines(treatment: dict, edl: dict, language: str) -> list[str]:
    said = [t[language] for t in treatment.get("titles", [])]
    seen = []
    for shot in edl["shots"]:
        cue = shot.get("caption")
        if cue and cue not in seen:
            seen.append(cue)
    return said + [treatment["cues"][c][language] for c in seen]


def main() -> None:
    from kokoro import KPipeline

    treatment = json.loads(Path(sys.argv[1]).read_text())
    edl = json.loads(Path(sys.argv[2]).read_text())
    out = Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    report = []
    for language, (code, voice, speed) in VOICES.items():
        pipe = KPipeline(lang_code=code, repo_id=REPO)
        for k, text in enumerate(lines(treatment, edl, language)):
            started = time.time()
            chunks = [np.asarray(audio) for _, _, audio in pipe(text, voice=voice, speed=speed)]
            wave = np.concatenate(chunks)
            soundfile.write(out / f"{language}-{k:02d}.wav", wave, 24000, subtype="PCM_16")
            report.append({"language": language, "k": k, "text": text, "voice": voice, "seconds": round(len(wave) / 24000, 2),
                           "made": round(time.time() - started, 2)})
            print(language, k, text, report[-1]["seconds"], flush=True)
    (out / "voice-report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
