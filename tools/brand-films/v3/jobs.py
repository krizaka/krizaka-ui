#!/usr/bin/env python3
"""The GPU jobs of a v3 film: one take per shot from its final keyframe (keyframes/final/<id>.png), in the format the
pod's run_jobs.py reads (dawn/pod/run_jobs.py): name, model, prompt, size, frames, fps, seed, where it starts.

    python3 jobs.py <treatment.json> <out jobs.json> [--only 3,7] [--attempt 1]

The prompt is the shot's directed motion, the film's keep line (design, light, contact) and the child-safety rule; the
frames are the shot's screen time at its speed plus a handle (4k+1, at least 33, at 16 fps). A reshoot is a new
attempt (a new name and seed): a take already made is never made again.
"""
import json
import sys
from pathlib import Path

NO_CHILDREN = "No children, no child-like figures, no dolls or toys."
SIZE = {"16:9": (1280, 720), "9:16": (720, 1280)}


def job(shot: dict, plan: dict, attempt: int = 0) -> dict:
    """One shot's take as a pod job (pure)."""
    w, h = SIZE[plan.get("aspect", "16:9")]
    model = shot.get("model", "wan2.2-i2v-a14b-hq")
    if model.startswith("ltx"):  # LTX-Video wants both sides divisible by 32 (720 is not): 704, cropped back in the edit
        w, h = (w // 32) * 32, (h // 32) * 32
    keep = plan["keep"] if shot["characters"] else "One single continuous shot. Plain unbranded surfaces, no lettering."
    return {
        "name": f"{shot['id']:02d}-{shot['slug']}-t{attempt}",
        "shot": shot["id"],
        "model": model,
        "prompt": f"{shot['motion']} {keep} {NO_CHILDREN}",
        "width": w,
        "height": h,
        "frames": shot["frames"],
        "fps": 16,
        "seed": plan["seedBase"] + 500 + shot["id"] + 1000 * attempt,
        "start": {"keyframe": shot["id"]},
    }


def main() -> None:
    plan = json.loads(Path(sys.argv[1]).read_text())
    only = {int(x) for x in sys.argv[sys.argv.index("--only") + 1].split(",") if x.strip()} if "--only" in sys.argv else None
    attempt = int(sys.argv[sys.argv.index("--attempt") + 1]) if "--attempt" in sys.argv else 0
    jobs = [job(s, plan, attempt) for s in plan["shots"] if not only or s["id"] in only]
    Path(sys.argv[2]).write_text(json.dumps(jobs, indent=1))
    print(len(jobs), "jobs,", sum(j["frames"] for j in jobs), "frames")


if __name__ == "__main__":
    main()
