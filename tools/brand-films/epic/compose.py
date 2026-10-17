#!/usr/bin/env python3
"""Lays the code-rendered birds (`Mascot`, idle frame of loops/<bird>-alpha.webm) on each shot's canvas: the reference image
the keyframe model re-lights. Nothing of a bird is drawn here: its pixels are the render's, only scaled and placed.

    python3 compose.py <shots.json> <dir of <bird>-idle.png> <out dir> [--only id,id]

Writes <out>/<id>-16x9.png (1280x720) and, for a shot marked vertical, <out>/<id>-9x16.png (720x1280).
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

SIZES = {"16x9": (1280, 720), "9x16": (720, 1280)}


def backdrop(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size)
    a, b = Image.new("RGB", (1, 1), top).getpixel((0, 0)), Image.new("RGB", (1, 1), bottom).getpixel((0, 0))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / (h - 1)
        draw.line([(0, y), (w, y)], fill=tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    return img.convert("RGBA")


def bird_layer(idle, place, size):
    w, h = size
    src = idle.crop(idle.getbbox())
    target_h = max(8, round(place["h"] * h))
    scaled = src.resize((max(1, round(src.width * target_h / src.height)), target_h), Image.LANCZOS)
    if place.get("flip"):
        scaled = scaled.transpose(Image.FLIP_LEFT_RIGHT)
    x = round(place["x"] * w - scaled.width / 2)
    y = round(place["y"] * h - scaled.height)
    return scaled, (x, y)


def compose(shot, idles, aspect):
    size = SIZES[aspect]
    canvas = backdrop(size, *shot["backdrop"])
    places = shot.get("birds9x16", shot["birds"]) if aspect == "9x16" else shot["birds"]
    for place in sorted(places, key=lambda p: p["y"]):  # the nearest bird last
        layer, (x, y) = bird_layer(idles[place["bird"]], place, size)
        shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        shadow.putalpha(layer.getchannel("A").point(lambda v: v * 0.35))
        shadow = shadow.filter(ImageFilter.GaussianBlur(6))
        canvas.paste(shadow, (x + 6, y + 8), shadow)  # paste clips at the edges, alpha_composite does not
        canvas.paste(layer, (x, y), layer)
    return canvas.convert("RGB")


def main(argv):
    shots = json.loads(Path(argv[1]).read_text())["shots"]
    ref, out = Path(argv[2]), Path(argv[3])
    only = argv[argv.index("--only") + 1].split(",") if "--only" in argv else None
    out.mkdir(parents=True, exist_ok=True)
    idles = {}
    for shot in shots:
        if only and shot["id"] not in only:
            continue
        for place in shot["birds"] + shot.get("birds9x16", []):
            if place["bird"] not in idles:
                idles[place["bird"]] = Image.open(ref / f"{place['bird']}-idle.png").convert("RGBA")
        for aspect in ["16x9"] + (["9x16"] if shot.get("vertical") else []):
            path = out / f"{shot['id']}-{aspect}.png"
            compose(shot, idles, aspect).save(path)
            print(path)


if __name__ == "__main__":
    main(sys.argv)
