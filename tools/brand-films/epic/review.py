#!/usr/bin/env python3
"""Contact sheets for the quality gate: every take of a shot, one row each, a frame every 8 (81 frames → 11 columns),
beside the keyframe the take started from. A person looks at each row (TREATMENT.md §5) and names the take to keep.

    python3 review.py <clips dir> <keyframes dir> <out dir> [--only <shot>-<aspect>,…]
"""
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image


def frames(video, every=8, width=256):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", str(video), "-vf", f"select='not(mod(n\\,{every}))',scale={width}:-2",
                          "-vsync", "vfr", "-f", "image2pipe", "-c:v", "png", "-"], capture_output=True, check=True).stdout
    imgs, i = [], 0
    sig = b"\x89PNG\r\n\x1a\n"
    parts = out.split(sig)[1:]
    from io import BytesIO
    for p in parts:
        imgs.append(Image.open(BytesIO(sig + p)).convert("RGB"))
    return imgs


def main():
    clips, kfs, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else None
    groups = defaultdict(list)
    for mp4 in sorted(clips.glob("*.mp4")):
        key = mp4.stem.rsplit("-", 1)[0]  # <shot>-<aspect>
        if not only or key in only:
            groups[key].append(mp4)
    for key, takes in groups.items():
        rows = [[Image.open(kfs / f"{key}.png").convert("RGB")] + frames(t) for t in takes]
        w, h = rows[0][1].size
        cols = 4
        per = -(-max(len(r) for r in rows) // cols)  # grid rows per take
        sheet = Image.new("RGB", (w * cols, h * per * len(rows) + 8 * len(rows)), (20, 20, 20))
        for r, row in enumerate(rows):
            top = r * (h * per + 8)
            for c, im in enumerate(row):
                sheet.paste(im.resize((w, h)), ((c % cols) * w, top + (c // cols) * h))
        sheet.save(out / f"{key}.jpg", quality=82)
        print(out / f"{key}.jpg", [t.stem[-1] for t in takes])


if __name__ == "__main__":
    main()
