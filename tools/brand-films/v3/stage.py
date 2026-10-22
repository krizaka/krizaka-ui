#!/usr/bin/env python3
"""Staging a bird on a plate, the v3 way (ADR-080 v3): the fixes of the anomalies the v2 audit found, as code.

- **On its surface, not beside it** (v2: the duck hung in the air next to the café table). A grounded bird's feet are put
  on the surface the treatment names (`staging[].surface`), found in the plate by the vision model (`vlm.locate`):
  `feet_on` places the feet inside that box at the asked depth.
- **At its size** (v2: a pigeon as tall as a flamingo's chest, an owl as big as a desk). Its height is the treatment's
  ratio of a reference object the model finds in the plate (`staging[].scale`): `height_from`.
- **A shadow that lies on the ground and falls away from the light** (v2: no contact shadow, or a black ellipse in the
  air under a flying bird). `cast_shadow` projects the bird's own silhouette on the ground away from the key the plate
  states (`light.key`), with a tight contact occlusion at the feet; a bird in the air casts nothing on a surface it
  does not touch.
- **No cut-out edges, no baked props or baked shadows** (v2: hard outlines, halos, the render's own grey ellipse under
  every bird). `clean` drops the render's soft baked shadow and the props that are not the bird; `edge_wrap` feathers
  the edge and wraps the plate's light around it.
- **The plate's light** (v2: birds brighter and of another colour than their scene): `exposure_for` sets the bird's
  exposure from the light around it (keyframes.py also tints it, as v2 did).

Pure functions, tested in v3.test.mjs (python3 + numpy + Pillow + scipy).
"""
import numpy as np
from PIL import Image, ImageFilter

#: Where a key light comes from → the direction its shadows fall on the ground, in screen (x right, y toward the camera).
SHADOW_DIR = {
    "left": (1.0, 0.25),
    "right": (-1.0, 0.25),
    "back-left": (0.55, 1.0),
    "back-right": (-0.55, 1.0),
    "back": (0.0, 1.0),
    "front": (0.0, -0.6),
    "top": (0.0, 0.0),
}

#: The render's parts that are not the bird, as a box of its body (fractions): the owl's check mark, the duck's code
#: panel, the falcon's scan bracket, the crane's sound arcs, the pigeon's parcel stand.
CLEAN = {
    "pigeon": (0.0, 0.0, 1.0, 0.80),
    "falcon": (0.0, 0.0, 0.9, 1.0),
    "owl": (0.0, 0.0, 0.8, 1.0),
    "duck": (0.0, 0.0, 0.7, 1.0),
    "crane": (0.1, 0.0, 1.0, 1.0),
}


def clean(figure: Image.Image, bird: str) -> Image.Image:
    """The bird without its props and without the render's baked shadow (soft pixels at the very bottom)."""
    x0, y0, x1, y1 = CLEAN.get(bird, (0, 0, 1, 1))
    w, h = figure.size
    fig = figure.convert("RGBA").crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
    rgba = np.asarray(fig).copy()
    hh = rgba.shape[0]
    bottom = np.zeros(rgba.shape[:2], bool)
    bottom[int(hh * 0.86):] = True
    rgba[..., 3] = np.where(bottom & (rgba[..., 3] < 200), 0, rgba[..., 3])
    out = Image.fromarray(rgba)
    box = out.getbbox()
    return out.crop(box) if box else out


def feet_on(surface: tuple[int, int, int, int], x: float, depth: float) -> tuple[int, int]:
    """Where the feet go on a surface box: `x` across it (0 left … 1 right), `depth` into it (0 far edge … 1 near edge)."""
    x1, y1, x2, y2 = surface
    return round(x1 + x * (x2 - x1)), round(y1 + depth * (y2 - y1))


def height_from(ref: tuple[int, int, int, int], ratio: float, frame_h: int, lo: float = 0.05, hi: float = 0.85) -> int:
    """The bird's height in pixels: `ratio` of the reference object's, kept between lo and hi of the frame."""
    h = (ref[3] - ref[1]) * ratio
    return int(round(min(max(h, lo * frame_h), hi * frame_h)))


def exposure_for(ambient: np.ndarray) -> float:
    """The bird's exposure from the plate's light around it (0..1 RGB mean): dim scenes darken it, bright ones keep it."""
    luma = float(0.2126 * ambient[0] + 0.7152 * ambient[1] + 0.0722 * ambient[2])
    return float(np.clip(0.5 + 1.1 * luma, 0.55, 1.05))


def cast_shadow(alpha: np.ndarray, key: str, hard: bool) -> tuple[np.ndarray, tuple[int, int]]:
    """The ground shadow of a silhouette (alpha 0..1, the figure's box) and its offset from the figure's top-left.

    The silhouette is flipped onto the ground at the feet line, squashed (a low sun lays it long and flat), sheared away
    from the key light, blurred more when the light is soft, plus a tight contact occlusion under the feet. Returns the
    shadow's opacity (0..1) and where its top-left lands relative to the figure's top-left.
    """
    h, w = alpha.shape
    dx, dy = SHADOW_DIR[key]
    squash = 0.22 + 0.18 * min(1.0, abs(dy))
    sh = max(2, int(h * squash))
    flipped = np.asarray(Image.fromarray((alpha[::-1] * 255).astype("uint8")).resize((w, sh)), float) / 255.0
    if dy < 0:  # toward the back: it lies behind the feet, so it rises on screen
        flipped = flipped[::-1]
    shear = int(round(dx * h * 0.55))
    out_w = w + abs(shear)
    shadow = np.zeros((sh, out_w))
    for row in range(sh):
        t = row / max(1, sh - 1) if dy >= 0 else 1 - row / max(1, sh - 1)
        off = int(round(t * shear)) + (abs(shear) if shear < 0 else 0)
        shadow[row, off:off + w] = np.maximum(shadow[row, off:off + w], flipped[row])
    # Contact: a tight dark ellipse where the feet meet the ground.
    cy, cx = (0 if dy >= 0 else sh - 1), (abs(shear) if shear < 0 else 0) + w // 2
    yy, xx = np.mgrid[0:sh, 0:out_w]
    contact = np.clip(1 - (((xx - cx) / (0.32 * w)) ** 2 + ((yy - cy) / max(2, 0.06 * h)) ** 2), 0, 1)
    strength = 0.55 if hard else 0.32
    shadow = np.clip(shadow * strength + contact * 0.75, 0, 1)
    blur = max(1, int(w * (0.012 if hard else 0.04)))
    shadow = np.asarray(Image.fromarray((shadow * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(blur)), float) / 255.0
    top = h - (sh if dy < 0 else 0) - max(1, int(0.02 * h))
    left = -(abs(shear) if shear < 0 else 0)
    return shadow, (left, top)


def edge_wrap(figure: Image.Image, plate_region: Image.Image, amount: float = 0.35) -> Image.Image:
    """The edge feathered by a pixel and the plate's blurred light wrapped onto the bird's rim (no cut-out halo)."""
    rgba = np.asarray(figure.convert("RGBA"), float) / 255.0
    a = rgba[..., 3]
    soft = np.asarray(Image.fromarray((a * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.0)), float) / 255.0
    inner = np.asarray(Image.fromarray((a * 255).astype("uint8")).filter(ImageFilter.MinFilter(7)), float) / 255.0
    rim = np.clip(a - inner, 0, 1)[..., None]
    bg = np.asarray(plate_region.convert("RGB").resize(figure.size).filter(ImageFilter.GaussianBlur(8)), float) / 255.0
    rgb = rgba[..., :3] * (1 - rim * amount) + bg * rim * amount
    return Image.fromarray((np.dstack([rgb, soft]) * 255).clip(0, 255).astype("uint8"), "RGBA")


def hero_size(shot: dict) -> float:
    """How tall (share of the frame) the tallest bird of a shot should read: a close-up fills, a group shares (pure)."""
    framing = shot.get("framing", "medium")
    if "close" in framing:
        return 0.62
    n = len(shot.get("characters", []))
    return 0.42 if n <= 1 else 0.34 if n == 2 else 0.3 if n == 3 else 0.24


def reframe(points: list[tuple[float, float, float]], size: tuple[int, int], hero: float,
            most: float = 3.2) -> tuple[float, float, float]:
    """The crop that brings a plate to its birds' scale (pure): `points` are (feet x, feet y, height) in the plate's
    pixels; returns (zoom, x0, y0) — the crop is size/zoom from (x0, y0), inside the plate, centred on the birds, their
    feet at ~80 % of its height. No crop (1, 0, 0) when the tallest bird is already hero-sized."""
    w, h = size
    tallest = max(p[2] for p in points)
    zoom = min(most, hero * h / max(1.0, tallest))
    if zoom <= 1.0:
        return 1.0, 0.0, 0.0
    cw, ch = w / zoom, h / zoom
    cx = sum(p[0] for p in points) / len(points)
    feet = max(p[1] for p in points)
    x0 = min(max(0.0, cx - cw / 2), w - cw)
    y0 = min(max(0.0, feet - 0.8 * ch), h - ch)
    down = lambda v: float(np.floor(v * 100) / 100)  # noqa: E731 — rounded down: the crop never leaves the plate
    return round(zoom, 4), down(x0), down(y0)


#: A reference the vision model could not find is assumed this tall (share of the frame): every bird of the shot keeps
#: its ratio to it, so their sizes stay right against each other (v3: two birds drawn the same height when it was missing).
MISSING_REF = 0.55


def target_height(ref: tuple[int, int, int, int] | None, ratio: float, frame_h: int) -> float:
    """A grounded bird's height in the plate (pure): its ratio of the reference found, else of an assumed reference."""
    ref_h = (ref[3] - ref[1]) if ref else MISSING_REF * frame_h
    return ref_h * ratio
