#!/usr/bin/env python3
"""The score of a v3 film (no narrator: the music drives the cut). One original instrumental per film, made in one piece
by ACE-Step 1.5 XL turbo (MIT) on the Mac's Metal ($0 of GPU), from the treatment's `score`: its genre prompt (instruments,
mood, tempo — never an artist or a title) and its form (sections in bars: intro, build, drop, break, outro), given to the
model as structure tags. The edit then follows the music, not the reverse: `beats.py` measures where the beats and the
drops really are.

    <worker venv>/bin/python score.py <treatment.json> <out dir> [--seeds 3] [--first 0]

Writes <out>/score-s<seed>.wav (48 kHz stereo) and <out>/score-s<seed>.json (seed, seconds, prompt, form).
"""
import json
import sys
from pathlib import Path

REPO = "ACE-Step/acestep-v15-xl-turbo-diffusers"
REVISION = "200ba991ae448051e14b0183157e35c2d27c9fb0"  # pinned like the worker's models.yaml


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def form_seconds(score: dict) -> float:
    """The length of the form: bars × 4 beats at the tempo."""
    return sum(s["bars"] for s in score["form"]) * 4 * 60.0 / score["bpm"]


def structure(score: dict) -> str:
    """The form as ACE-Step's structure tags, instrumental (no words: a section tag and its feel)."""
    return "\n\n".join(f"[{s['section']}]\n[instrumental: {s['feel']}]" for s in score["form"])


def prompt(score: dict) -> str:
    return f"{score['prompt']}, {score['bpm']} BPM, instrumental, no vocals"


def main() -> None:
    import soundfile
    import torch
    from diffusers import AceStepPipeline

    treatment = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    score = treatment["score"]
    seconds = form_seconds(score) + score.get("tailSeconds", 6)
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    pipe = AceStepPipeline.from_pretrained(REPO, revision=REVISION, torch_dtype=torch.bfloat16 if device == "mps" else torch.float32).to(device)
    first = int(arg("first", "0"))
    for k in range(first, first + int(arg("seeds", "3"))):
        seed = treatment["seedBase"] + 700 + k
        wav = out / f"score-s{seed}.wav"
        if wav.exists():
            continue
        audio = pipe(prompt=prompt(score), lyrics=structure(score), audio_duration=seconds, num_inference_steps=8,
                     guidance_scale=7.0, generator=torch.Generator(device="cpu").manual_seed(seed)).audios
        soundfile.write(wav, audio[0].float().cpu().numpy().T, 48000)
        (out / f"score-s{seed}.json").write_text(json.dumps({"seed": seed, "seconds": seconds, "prompt": prompt(score),
                                                              "structure": structure(score)}, indent=1))
        print(wav, flush=True)


if __name__ == "__main__":
    main()
