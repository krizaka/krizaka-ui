#!/usr/bin/env python3
"""The sung chorus (run on the GPU pod, in the worker's venv): ACE-Step 1.5 (MIT) with lyrics, EN and FR, genre
prompts only (no artist, no song). The line is the film's own: « Chaque oiseau porte une promesse, et la famille
s'agrandit. » / "Each bird carries a promise, and the family keeps growing."

    python chorus.py <out dir> [--takes 3] [--seconds 24]
"""
import sys
from pathlib import Path

import soundfile as sf
import torch

LYRICS = {
    "en": "[verse]\nEach bird carries a promise\nEach bird carries a promise\n[chorus]\nAnd the family keeps growing\nAnd the family keeps growing",
    "fr": "[verse]\nChaque oiseau porte une promesse\nChaque oiseau porte une promesse\n[chorus]\nEt la famille s'agrandit\nEt la famille s'agrandit",
}
PROMPT = ("joyful uplifting cinematic pop anthem, a bright choir of playful cartoon voices singing together in unison, "
          "warm strings, piano, light percussion, handclaps, golden hour, feel-good finale, 96 bpm, clear vocals")


def main():
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    takes = int(sys.argv[sys.argv.index("--takes") + 1]) if "--takes" in sys.argv else 3
    seconds = float(sys.argv[sys.argv.index("--seconds") + 1]) if "--seconds" in sys.argv else 24
    from diffusers import AceStepPipeline
    pipe = AceStepPipeline.from_pretrained("ACE-Step/acestep-v15-xl-turbo-diffusers", torch_dtype=torch.bfloat16).to("cuda")
    for lang, lyrics in LYRICS.items():
        for k in range(takes):
            g = torch.Generator(device="cpu").manual_seed(20261020 + 100 * k)
            audio = pipe(prompt=PROMPT, lyrics=lyrics, audio_duration=seconds, num_inference_steps=8,
                         guidance_scale=7.0, generator=g).audios[0]
            sf.write(out / f"chorus-{lang}-{k}.wav", audio.float().cpu().numpy().T, 48000)  # (samples, channels), as the worker
            print("chorus", lang, k, flush=True)


if __name__ == "__main__":
    main()
