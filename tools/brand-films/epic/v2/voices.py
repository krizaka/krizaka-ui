#!/usr/bin/env python3
"""The birds' voices (run on the GPU pod, in its own venv): each bird's timbre seed is a Kokoro-82M voice (Apache-2.0)
saying a neutral sentence; Chatterbox multilingual (MIT) then speaks the bird's line from that seed in EN and FR, so a
bird keeps one voice in both languages. A light per-bird pitch shift (ffmpeg, later in the mix) makes it a character.

    python voices.py <out dir> [--takes 3]

Writes <out>/seed-<bird>.wav and <out>/<bird>-<lang>-<take>.wav (24 kHz mono). No voice imitates a real person.
"""
import sys
from pathlib import Path

import soundfile as sf
import torch

LINES = {  # the film's own lines (FILM.cues), word for word
    "falcon": {"en": "The falcon keeps watch: security comes first.", "fr": "Le faucon veille : la sécurité d'abord."},
    "owl": {"en": "The owl reads every page and knows every face.", "fr": "Le hibou lit chaque page et reconnaît chaque visage."},
    "flamingo": {"en": "The flamingo answers, and the payment follows.", "fr": "Le flamant répond, et le paiement suit."},
    "duck": {"en": "The duck builds, line by line, in the open.", "fr": "Le canard construit, ligne après ligne, en open source."},
    "pigeon": {"en": "The pigeon delivers, every time.", "fr": "Le pigeon livre, à chaque fois."},
}
SEEDS = {"falcon": "bm_george", "owl": "bf_emma", "flamingo": "af_bella", "duck": "am_puck", "pigeon": "am_eric"}
# Expressiveness per bird (Chatterbox `exaggeration`, `cfg_weight`): the falcon deadpan, the duck lively.
STYLE = {"falcon": (0.35, 0.6), "owl": (0.45, 0.5), "flamingo": (0.55, 0.5), "duck": (0.75, 0.4), "pigeon": (0.7, 0.4)}
SEED_TEXT = "Every morning I check the sky, the wind and the road, and then I get to work with the whole family."


def main():
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    takes = int(sys.argv[sys.argv.index("--takes") + 1]) if "--takes" in sys.argv else 3
    from kokoro import KPipeline
    kp = KPipeline(lang_code="a")
    kb = KPipeline(lang_code="b")
    for bird, voice in SEEDS.items():
        pipe = kb if voice.startswith("b") else kp
        audio = torch.cat([torch.as_tensor(a) for _, _, a in pipe(SEED_TEXT, voice=voice)])
        sf.write(out / f"seed-{bird}.wav", audio.numpy(), 24000)
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    tts = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
    for bird, lines in LINES.items():
        ex, cfg = STYLE[bird]
        for lang, text in lines.items():
            for k in range(takes):
                torch.manual_seed(20261017 + 100 * k)
                wav = tts.generate(text, language_id=lang, audio_prompt_path=str(out / f"seed-{bird}.wav"), exaggeration=ex, cfg_weight=cfg)
                sf.write(out / f"{bird}-{lang}-{k}.wav", wav.squeeze(0).cpu().numpy(), tts.sr)
                print(bird, lang, k, flush=True)


if __name__ == "__main__":
    main()
