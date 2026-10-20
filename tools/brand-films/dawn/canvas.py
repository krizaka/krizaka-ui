#!/usr/bin/env python3
"""The canvases of « l'aube »: each shot's birds, cut from their code render, laid on the shot's colours. A keyframe model
re-lights the canvas; nothing of a bird is drawn here (the pixels are the Mascot render's, scaled and placed).

    python3 canvas.py <treatment.json> <renders dir> <out dir> [--only 1,2]

<renders dir> holds <bird>-alpha.png (the Mascot loops' stills, Bunny brand-films/loops/) and phoenix-alpha.png (the
Phoenix component's SVG, rendered). Each bird is the largest opaque island of its render (props that float apart, like
the shield or the lovebird's icons, are left out; props that touch the body, like the pigeon's parcel, stay).
Writes <out>/<id>.png (1280x720) and <out>/<id>-ref.png (the reference sheet of the shot's cast, for the edit model).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SIZE = (1280, 720)


def body(render: Image.Image) -> Image.Image:
    """The bird alone: the largest island of its alpha (pure, deterministic)."""
    rgba = np.asarray(render.convert("RGBA"))
    opaque = rgba[..., 3] > 20
    labels, count = ndimage.label(ndimage.binary_dilation(opaque, iterations=3))
    if count == 0:
        return render
    sizes = ndimage.sum(opaque, labels, range(1, count + 1))
    keep = labels == int(np.argmax(sizes)) + 1
    out = rgba.copy()
    out[..., 3] = np.where(keep, out[..., 3], 0)
    image = Image.fromarray(out)
    return image.crop(image.getbbox())


def backdrop(top: str, bottom: str) -> Image.Image:
    w, h = SIZE
    a = Image.new("RGB", (1, 1), top).getpixel((0, 0))
    b = Image.new("RGB", (1, 1), bottom).getpixel((0, 0))
    img = Image.new("RGB", SIZE)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        draw.line([(0, y), (w, y)], fill=tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    return img.convert("RGBA")


def place(canvas: Image.Image, figure: Image.Image, spot: dict) -> None:
    w, h = SIZE
    target = max(8, round(spot["h"] * h))
    scaled = figure.resize((max(1, round(figure.width * target / figure.height)), target), Image.LANCZOS)
    if spot.get("flip"):
        scaled = scaled.transpose(Image.FLIP_LEFT_RIGHT)
    x, y = round(spot["x"] * w - scaled.width / 2), round(spot["y"] * h - scaled.height)
    shadow = Image.new("RGBA", scaled.size, (0, 0, 0, 0))
    shadow.putalpha(scaled.getchannel("A").point(lambda v: v * 0.35))
    canvas.paste(shadow.filter(ImageFilter.GaussianBlur(6)), (x + 6, y + 8), shadow.filter(ImageFilter.GaussianBlur(6)))
    canvas.paste(scaled, (x, y), scaled)


def reference_sheet(figures: list[Image.Image]) -> Image.Image:
    """The cast of a shot side by side on neutral grey: what the edit model is told to keep."""
    sheet = Image.new("RGBA", (1024, 512), (128, 128, 128, 255))
    if not figures:
        return sheet.convert("RGB")
    slot = 1024 // len(figures)
    for i, fig in enumerate(figures):
        f = fig.copy()
        f.thumbnail((slot - 16, 480), Image.LANCZOS)
        sheet.paste(f, (i * slot + (slot - f.width) // 2, 500 - f.height), f)
    return sheet.convert("RGB")


def main(argv):
    plan = json.loads(Path(argv[1]).read_text())
    renders, out = Path(argv[2]), Path(argv[3])
    only = {int(x) for x in argv[argv.index("--only") + 1].split(",")} if "--only" in argv else None
    out.mkdir(parents=True, exist_ok=True)
    figures: dict[str, Image.Image] = {}
    for shot in plan["shots"]:
        if only and shot["id"] not in only:
            continue
        canvas = backdrop(*shot["backdrop"])
        cast = []
        for spot in sorted(shot["birds"], key=lambda s: s["y"]):
            name = spot["bird"]
            if name not in figures:
                figures[name] = body(Image.open(renders / f"{name}-alpha.png"))
            place(canvas, figures[name], spot)
            if name not in [c[0] for c in cast]:
                cast.append((name, figures[name]))
        canvas.convert("RGB").save(out / f"{shot['id']:02d}.png")
        reference_sheet([f for _, f in cast[:5]]).save(out / f"{shot['id']:02d}-ref.png")
        print(out / f"{shot['id']:02d}.png", [c[0] for c in cast])


if __name__ == "__main__":
    main(sys.argv)
