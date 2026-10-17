#!/usr/bin/env python3
"""Keyframes of the epic: each shot's canvas (compose.py: the code-rendered birds on the set's colours) re-lit by
FLUX.2 [klein] 4B on the cinema pod's sd-server (stable-diffusion.cpp), reached through an ssh tunnel on localhost:8086.

    python3 keyframes.py <shots.json> <canvas dir> <out dir> [--mode img2img|ref] [--strength 0.45] [--seeds 3]
                         [--only id,id] [--url http://127.0.0.1:8086]

img2img (default): the canvas is the init image, `strength` ≤ 0.5 keeps silhouettes, colours and the falcon's visor.
ref: the canvas is a reference image of an edit (FLUX.2's in-context editing), the composition follows the prompt.
Writes <out>/<id>-<aspect>-<mode>-s<seed>.png. Nothing is accepted here: a person checks each against the code render.
"""
import base64
import json
import sys
import time
import urllib.request
from pathlib import Path


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as res:
        return json.loads(res.read() or b"{}")


def generate(base, prompt, canvas, size, seed, mode, strength):
    data = "data:image/png;base64," + base64.b64encode(canvas.read_bytes()).decode()
    body = {"prompt": prompt, "negative_prompt": "", "width": size[0], "height": size[1], "seed": seed,
            "batch_count": 1, "sample_params": {"sample_steps": 4, "guidance": {"txt_cfg": 1.0}}, "output_format": "png"}
    if mode == "ref":
        body |= {"ref_images": [data], "ref_image_args": "resize_before_vae=false", "init_image": None}
    else:
        body |= {"init_image": data, "strength": strength}
    job = call(f"{base}/sdcpp/v1/img_gen", body)
    for _ in range(600):
        state = call(f"{base}/sdcpp/v1/jobs/{job['id']}")
        if state.get("status") in ("completed", "succeeded", "done"):
            images = state.get("result", {}).get("images") or state.get("images") or []
            first = images[0]
            return base64.b64decode((first.get("b64_json") or first.get("data") or first) if isinstance(first, dict) else first)
        if state.get("status") in ("failed", "cancelled", "error"):
            raise RuntimeError(f"img_gen {job['id']}: {state}")
        time.sleep(1)
    raise TimeoutError(job["id"])


def main():
    plan = json.loads(Path(sys.argv[1]).read_text())
    canvases, out = Path(sys.argv[2]), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    base = arg("url", "http://127.0.0.1:8086")
    mode, strength, seeds = arg("mode", "ref"), float(arg("strength", "0.45")), int(arg("seeds", "3"))
    only = arg("only", "").split(",") if arg("only") else None
    for i, shot in enumerate(plan["shots"]):
        if only and shot["id"] not in only:
            continue
        looks = []
        for place in sorted(shot["birds"], key=lambda b: b["x"]):
            look = plan["birdLooks"][place["bird"]]
            if look not in looks:
                looks.append(look)
        cast = "Characters, from left to right: " + "; ".join(looks) + "."
        words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
        count = f"Exactly {words[len(shot['birds'])]} character{'s' if len(shot['birds']) > 1 else ''} in the whole frame, each one appearing only once; no other animals, no people, no faces in the background."
        prompt = f"{shot['keyframe']} {cast} {count} {plan['keyframeKeep']}"
        for aspect, size in [("16x9", (1280, 720))] + ([("9x16", (720, 1280))] if shot.get("vertical") else []):
            for k in range(seeds):
                seed = plan["seedBase"] + int(shot["id"][:2]) + 100 * k
                path = out / f"{shot['id']}-{aspect}-{mode}-s{seed}.png"
                if path.exists():
                    continue
                t0 = time.time()
                path.write_bytes(generate(base, prompt, canvases / f"{shot['id']}-{aspect}.png", size, seed, mode, strength))
                print(f"{path.name} {time.time() - t0:.0f} s", flush=True)


if __name__ == "__main__":
    main()
