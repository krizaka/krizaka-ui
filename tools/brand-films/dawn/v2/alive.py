#!/usr/bin/env python3
"""« Alive » measured (orazaka#289, gate): how much a take's character moves, where the character is.

The v1 birds « moved but were not alive »: a head turned, nothing else. A take's motion is measured on its frames
(160×90 grey, consecutive differences) inside the box where the shot puts its birds (the treatment's `birds`: x, y, h)
and outside it: **subject motion** (mean change inside the box), **activity** (the share of frames where the subject
clearly moves) and **variety** (how much the motion changes over the take: a performance has beats, a sway does not).
A take passes « alive » when all three clear the thresholds below — calibrated on v1's takes — and a person reads its
review sheet against the shot's purpose and action (« on-topic »).

    python3 alive.py <treatment.json> <takes dir> <take.mp4> [<take.mp4> …]   → one JSON line per take
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

W, H = 160, 90
#: A pass: the subject moves on at least a third of the frames, by more than the noise of a still bird, with beats.
MIN_SUBJECT = 2.0
MIN_ACTIVITY = 0.33
MIN_VARIETY = 0.5


def frames(path: Path) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


def box(birds: list[dict]) -> tuple[int, int, int, int]:
    """The union of the birds' boxes on the 160×90 grid (each bird ~0.8 of its height wide), padded."""
    xs0, ys0, xs1, ys1 = [], [], [], []
    for b in birds:
        half = b["h"] * 0.45 * H / W * 16 / 9 / 2 * 1.6
        xs0.append(b["x"] - half), xs1.append(b["x"] + half), ys0.append(b["y"] - b["h"] * 1.1), ys1.append(b["y"] + 0.03)
    clamp = lambda v, n: int(min(max(v, 0), 1) * n)  # noqa: E731
    return clamp(min(xs0), W), clamp(min(ys0), H), max(clamp(max(xs1), W), clamp(min(xs0), W) + 4), max(clamp(max(ys1), H), clamp(min(ys0), H) + 4)


def measure(path: Path, birds: list[dict]) -> dict:
    f = frames(path)
    diff = np.abs(np.diff(f, axis=0))
    x0, y0, x1, y1 = box(birds) if birds else (0, 0, W, H)
    inside = diff[:, y0:y1, x0:x1].mean(axis=(1, 2))
    mask = np.ones((H, W), bool)
    mask[y0:y1, x0:x1] = False
    outside = diff[:, mask].mean(axis=1) if mask.any() else np.zeros_like(inside)
    subject = float(inside.mean())
    activity = float((inside > max(1.5, 1.5 * float(np.median(outside)))).mean())
    # Variety: the motion's own variation over the take (coefficient of variation of a 6-frame moving average).
    smooth = np.convolve(inside, np.ones(6) / 6, mode="valid") if len(inside) > 6 else inside
    variety = float(smooth.std() / (smooth.mean() + 1e-6))
    alive = subject >= MIN_SUBJECT and activity >= MIN_ACTIVITY and variety >= MIN_VARIETY
    return {"take": path.name, "frames": int(len(f)), "subject": round(subject, 2), "background": round(float(outside.mean()), 2),
            "activity": round(activity, 2), "variety": round(variety, 2), "alive": bool(alive)}


def main() -> None:
    treatment = json.loads(Path(sys.argv[1]).read_text())
    takes = Path(sys.argv[2])
    by_slug = {s["slug"]: s for s in treatment["shots"]}
    for name in sys.argv[3:]:
        slug = name.split("-", 1)[1].rsplit("-t", 1)[0]
        shot = by_slug.get(slug, {})
        print(json.dumps({**measure(takes / name, shot.get("birds", [])), "shot": shot.get("id")}), flush=True)


if __name__ == "__main__":
    main()
