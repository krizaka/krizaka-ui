#!/usr/bin/env python3
"""The 4K takes of « l'aube »: each chosen take through the Orazaka media worker's own upscaler (app/upscale.py: SeedVR2 3B,
Apache-2.0, to 2160p with a tiled VAE), on the GPU host.

    cd /workspace/worker && python upscale.py <takes dir> <out dir> <name.mp4> [<name.mp4> …]

Writes <out>/<name> (3840x2160) and <out>/<name>.json (the upscaler's facts: from, to, seconds).
"""
import json
import os
import shutil
import sys
from pathlib import Path

sys.path.insert(0, os.getcwd())
from app import upscale  # noqa: E402


def main() -> None:
    takes, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    env = {**os.environ, "SEEDVR2_HOME": "/workspace/up/seedvr2", "SEEDVR2_PYTHON": "/workspace/up/venv/bin/python",
           "MEDIA_MODELS_DIR": "/workspace/models", "SEEDVR2_BATCH_SIZE": os.environ.get("SEEDVR2_BATCH_SIZE", "21")}
    for name in sys.argv[3:]:
        target = out / name
        if target.exists():
            continue
        work = out / f".{name}"
        shutil.copy(takes / name, work)
        facts = upscale.upscale(str(work), "2160p", [str(out)], env=env)
        work.rename(target)
        (out / f"{name}.json").write_text(json.dumps(facts))
        print(name, json.dumps(facts), flush=True)


if __name__ == "__main__":
    main()
