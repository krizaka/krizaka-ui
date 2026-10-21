#!/usr/bin/env python3
"""The end card of a v3 film: the brand's mark (Bunny brand/<brand>/mark-dark-1024.png, rendered from @krizaka/ui by
tools/export-brand.mjs — never drawn here) lands on the last hit of the score, its glow breathes once, the wordmark
follows. Four seconds, any size.

    python3 endcard.py <mark.png> <Wordmark> <out.mp4> [--size 1920x1080] [--fps 24] [--bg #0d0f14] [--glow #3b82f6]
                       [--font <PlusJakartaSans-SemiBold.ttf>]
"""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SECONDS = 4.0


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def ease_out(t: float) -> float:
    t = min(1.0, max(0.0, t))
    return 1 - (1 - t) ** 3


def main() -> None:
    mark, word, out = Image.open(sys.argv[1]).convert("RGBA"), sys.argv[2], sys.argv[3]
    w, h = (int(x) for x in arg("size", "1920x1080").split("x"))
    fps = int(arg("fps", "24"))
    bg = Image.new("RGB", (1, 1), arg("bg", "#0d0f14")).getpixel((0, 0))
    glow = np.array(Image.new("RGB", (1, 1), arg("glow", "#3b82f6")).getpixel((0, 0)), float)
    short = min(w, h)
    size = int(short * 0.30)
    base = mark.resize((size, size), Image.LANCZOS)
    font = ImageFont.truetype(arg("font"), int(short * 0.075)) if arg("font") else ImageFont.load_default()
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = w / 2, h * 0.44
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / short
    proc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(fps),
                             "-i", "-", "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    n = int(SECONDS * fps)
    for i in range(n):
        t = i / fps
        frame = np.zeros((h, w, 3)) + np.array(bg, float)
        pulse = ease_out(t / 0.5) * (0.55 + 0.45 * np.exp(-((t - 1.2) / 0.5) ** 2))
        halo = np.exp(-(dist / 0.32) ** 2) * 0.45 * pulse
        frame = frame + halo[..., None] * (glow - frame) * 0.9
        img = Image.fromarray(frame.clip(0, 255).astype("uint8"))
        s = 0.9 + 0.1 * ease_out(t / 0.6)
        m = base.resize((int(size * s), int(size * s)), Image.LANCZOS)
        alpha = ease_out(t / 0.35) * (1 - ease_out((t - (SECONDS - 0.5)) / 0.5))
        m.putalpha(m.getchannel("A").point(lambda v, a=alpha: int(v * a)))
        img.paste(m, (int(cx - m.width / 2), int(cy - m.height / 2)), m)
        text_a = ease_out((t - 0.6) / 0.5) * (1 - ease_out((t - (SECONDS - 0.5)) / 0.5))
        layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        box = d.textbbox((0, 0), word, font=font)
        d.text((cx - (box[2] - box[0]) / 2, cy + size * 0.62), word, font=font, fill=(236, 238, 242, int(255 * text_a)))
        img = Image.alpha_composite(img.convert("RGBA"), layer.filter(ImageFilter.GaussianBlur(0.4))).convert("RGB")
        proc.stdin.write(img.tobytes())
    proc.stdin.close()
    proc.wait()
    print(out)


if __name__ == "__main__":
    main()
