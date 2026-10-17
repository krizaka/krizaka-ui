#!/usr/bin/env python3
"""Silent cinematic shots at full quality (run on the GPU pod): Wan 2.2 I2V A14B through diffusers, 40 steps, real
classifier-free guidance and a negative prompt — not the 4-step distill of v1 (its motion was stiff).

    python i2v40.py <jobs.json> <out dir> --weights <Wan2.2-I2V-A14B-Diffusers dir> [--steps 40]

jobs.json: [{"id", "image", "prompt", "seed", "width", "height"}]. Writes <out>/<id>.mp4 (16 fps, 81 frames) and
<out>/<id>.json (seconds, steps, seed).
"""
import json
import sys
import time
from pathlib import Path

import torch
from diffusers import WanImageToVideoPipeline
from diffusers.utils import export_to_video, load_image

NEGATIVE = ("cuts, scene change, text, letters, watermark, logo, subtitles, extra limbs, extra wings, extra heads, "
            "duplicated character, melted, morphing, deformed beak, broken neck, realistic real-world bird species, human, "
            "person, hands, flicker, jitter, static frozen frame, low detail, blurry character, oversaturated")


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def main():
    jobs = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    steps = int(arg("steps", "40"))
    pipe = WanImageToVideoPipeline.from_pretrained(arg("weights"), torch_dtype=torch.bfloat16)
    pipe.enable_model_cpu_offload()
    for job in jobs:
        if (out / f"{job['id']}.mp4").exists():
            continue
        t0 = time.time()
        frames = pipe(image=load_image(job["image"]).resize((job["width"], job["height"])), prompt=job["prompt"],
                      negative_prompt=NEGATIVE, width=job["width"], height=job["height"], num_frames=81,
                      num_inference_steps=steps, guidance_scale=3.5, guidance_scale_2=3.5,
                      generator=torch.Generator("cpu").manual_seed(job["seed"])).frames[0]
        export_to_video(frames, str(out / f"{job['id']}.mp4"), fps=16)
        (out / f"{job['id']}.json").write_text(json.dumps({**job, "steps": steps, "seconds": round(time.time() - t0)}))
        print(job["id"], round(time.time() - t0), "s", flush=True)


if __name__ == "__main__":
    main()
