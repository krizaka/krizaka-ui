#!/usr/bin/env python3
"""Makes the takes of « l'aube » on the GPU host with the Orazaka media worker's own generator (`generate_wan_frames`):
the jobs are `orazaka cinema jobs` (the planner's pending shots), each one a model, a prompt, a seed, a size and where it
starts — its keyframe, or the last frame of the take of the shot before it (tail-frame chaining).

    cd /workspace/worker && python run_jobs.py <jobs.json> <keyframes> <takes> [--only 01-…] [--models wan2.2-i2v-a14b-hq] [--wait]

Writes <takes>/<name>.mp4 (the model's own rate, x264 crf 12) and <takes>/<name>.json (model, steps, seed, seconds on the
card). A take already made is never made again: a reshoot is a new attempt, so a new name.
"""
import glob
import json
import os
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image

sys.path.insert(0, os.getcwd())
from app import video_models  # noqa: E402
from app.wan_generator import generate_wan_frames  # noqa: E402

#: The negative of the full-step runs (guidance 3.5): the distilled ones ignore it (PROMPT-KIT §5).
NEGATIVE = ("cuts, scene change, text, letters, watermark, logo, subtitles, extra limbs, extra wings, extra heads, extra legs, "
            "duplicated character, melted, morphing, deformed beak, broken neck, realistic real-world bird species, human, person, "
            "hands, fingers, flicker, jitter, static frozen frame, low detail, blurry character, oversaturated, cartoon 2d flat")


def last_frame(takes: Path, prefix: str, at: float | None = None) -> Image.Image:
    """The last frame of the newest take of a shot (`<id>-…-t<n>.mp4`), or its frame at `at` s: where a chained shot starts."""
    made = sorted(glob.glob(str(takes / f"{prefix}-*.mp4")), key=os.path.getmtime)
    chosen = takes / "chosen.json"
    if chosen.exists():  # a person's pick wins over the newest
        picks = json.loads(chosen.read_text())
        made = [str(takes / picks[prefix])] if prefix in picks else made
    if not made:
        raise SystemExit(f"no take of shot {prefix} to chain from")
    seek = ["-ss", f"{at:.3f}"] if at is not None else ["-sseof", "-0.1"]
    out = subprocess.run(["ffmpeg", "-v", "error", *seek, "-i", made[-1], "-update", "1", "-frames:v", "1",
                          "-f", "image2pipe", "-c:v", "png", "-"], capture_output=True, check=True).stdout
    from io import BytesIO
    return Image.open(BytesIO(out)).convert("RGB")


def encode(frames, fps: int, path: Path) -> None:
    w, h = frames[0].size
    part = path.with_name(path.name + ".part")  # renamed once whole: a watcher never sees half a take
    proc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(fps),
                             "-i", "-", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", "-f", "mp4", str(part)],
                            stdin=subprocess.PIPE)
    for frame in frames:
        proc.stdin.write(frame.convert("RGB").tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit(f"ffmpeg failed on {path}")
    part.rename(path)


def use_sage() -> None:
    """Routes PyTorch's attention through SageAttention (BSD-3; 8-bit QK, near-lossless, the usual Wan speed-up on Hopper)
    for the unmasked bf16/fp16 calls it supports; every other call keeps PyTorch's own kernel."""
    import torch
    import torch.nn.functional as F
    from sageattention import sageattn

    original = F.scaled_dot_product_attention

    def attention(*args, **kw):
        q, k, v = (list(args) + [kw.pop(n, None) for n in ("query", "key", "value")][len(args):])[:3]
        attn_mask, dropout_p = kw.pop("attn_mask", None), kw.pop("dropout_p", 0.0)
        is_causal, scale = kw.pop("is_causal", False), kw.pop("scale", None)
        if (attn_mask is None and dropout_p == 0.0 and not kw.get("enable_gqa") and q.dtype in (torch.bfloat16, torch.float16)
                and q.dim() == 4 and q.shape[-1] in (64, 96, 128) and q.shape[1] == k.shape[1] == v.shape[1]):
            return sageattn(q, k, v, tensor_layout="HND", is_causal=is_causal, sm_scale=scale)
        return original(q, k, v, attn_mask=attn_mask, dropout_p=dropout_p, is_causal=is_causal, scale=scale, **kw)

    F.scaled_dot_product_attention = attention
    torch.nn.functional.scaled_dot_product_attention = attention
    print("[sage] attention through SageAttention", flush=True)


def main() -> None:
    if "--sage" in sys.argv:
        use_sage()
    jobs_file = Path(sys.argv[1])
    jobs = json.loads(jobs_file.read_text())
    keyframes, takes = Path(sys.argv[2]), Path(sys.argv[3])
    takes.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    models = set(sys.argv[sys.argv.index("--models") + 1].split(",")) if "--models" in sys.argv else None
    wait = "--wait" in sys.argv  # keep the model loaded and take each job as soon as where it starts exists
    pending = [j for j in jobs if (not only or j["name"] in only) and (not models or j["model"] in models)]
    idle_since = time.time()
    while pending:
        if wait:  # the jobs file may change while the model stays loaded (a reshoot, a shorter shot): read it again
            fresh = json.loads(jobs_file.read_text())
            pending = [j for j in fresh if (not only or j["name"] in only) and (not models or j["model"] in models)
                       and not (takes / f"{j['name']}.mp4").exists()]
            if not pending:
                break
        ready = next((j for j in pending if startable(j, keyframes, takes)), None)
        if ready is None:
            if not wait or time.time() - idle_since > 3 * 3600:
                print("waiting jobs left:", [j["name"] for j in pending], flush=True)
                return
            time.sleep(20)
            continue
        pending.remove(ready)
        make(ready, keyframes, takes)
        idle_since = time.time()


def startable(job: dict, keyframes: Path, takes: Path) -> bool:
    start = job["start"]
    if "keyframe" in start:
        return (keyframes / f"{start['keyframe']:02d}.png").exists()
    return bool(glob.glob(str(takes / f"{start['lastFrameOf']:02d}-*.mp4")))


def make(job: dict, keyframes: Path, takes: Path) -> None:
    out = takes / f"{job['name']}.mp4"
    if out.exists():
        return
    model = video_models.find(job["model"])
    start = job["start"]
    if "keyframe" in start:
        image = Image.open(keyframes / f"{start['keyframe']:02d}.png").convert("RGB")
    else:
        image = last_frame(takes, f"{start['lastFrameOf']:02d}", start.get("at"))
    started = time.time()
    frames = generate_wan_frames(job["model"], job["prompt"], job["width"], job["height"], job["frames"], model.steps,
                                 job["seed"], negative_prompt=NEGATIVE if model.guidance > 1 else None, image=image)
    seconds = round(time.time() - started)
    encode(frames, job["fps"], out)
    (takes / f"{job['name']}.json").write_text(json.dumps({**job, "steps": model.steps, "seconds": seconds}))
    print(f"{job['name']} {job['model']} {model.steps} steps {seconds}s", flush=True)


if __name__ == "__main__":
    main()
