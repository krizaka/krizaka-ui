#!/usr/bin/env python3
"""The keyframes of « l'aube », on-model by construction (TREATMENT §5.3 exception: every bird starts from its Mascot render).

A free image edit redraws the bird (the first try turned the falcon into an owl without its visor: rejected), so a keyframe is
made in three steps, the bird's design never left to a model:

1. **plate** — FLUX.2 [klein] 4B (Apache-2.0) draws the set alone, empty, from the shot's keyframe prompt;
2. **composite** — the bird's Mascot render (its body, `canvas.body`) is laid on the plate where the shot puts it, lit like the
   plate: tinted by the light around it, exposed to the scene, a rim on the side of the key light, a contact shadow;
3. **integrate** — FLUX.2 [klein] img2img from that composite at a high image strength: the light, the feather texture and
   the contact are re-rendered, the silhouette, colours and features stay the render's.

    python3 keyframes.py <treatment.json> <renders dir> <out dir> --stage plate|composite|integrate [--only 2,4] [--strength 0.72]

Runs on the Mac (mflux, Metal): $0 of GPU. Each image is checked by a person against the render before any video is paid.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).parent))
from canvas import SIZE, body  # noqa: E402

MODEL = "flux2-klein-4b"
EMPTY = "Empty scene, no animals, no birds, no characters, no people, no text, no logos."


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def flux(args: list[str], log: Path) -> None:
    with log.open("w") as out:
        subprocess.run(args, check=True, stdout=out, stderr=subprocess.STDOUT)


def plate_prompt(shot: dict, plan: dict) -> str:
    return f"Cinematic film still. {shot.get('plate') or shot['keyframe']} {plan['style']} {EMPTY}"


def light_of(plate: Image.Image, box: tuple[int, int, int, int]) -> np.ndarray:
    """The mean colour of the plate around where the bird stands (its ambient light), 0..1."""
    x0, y0, x1, y1 = box
    w, h = plate.size
    pad = max(x1 - x0, y1 - y0) // 2
    region = plate.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)))
    return np.asarray(region.convert("RGB"), dtype=float).reshape(-1, 3).mean(0) / 255.0


def lit(figure: Image.Image, ambient: np.ndarray, key: tuple[float, float], exposure: float, rim: tuple[int, int, int]) -> Image.Image:
    """The render lit by the plate: tinted toward the ambient colour (luminance kept), exposed, a rim on the key's side (pure)."""
    rgba = np.asarray(figure.convert("RGBA"), dtype=float) / 255.0
    rgb, a = rgba[..., :3], rgba[..., 3]
    tint = ambient / max(ambient.mean(), 1e-3)
    rgb = rgb * (0.65 + 0.35 * tint) * exposure
    # Emissive features (the falcon's cyan eyes, the phoenix's core) stay bright: saturated, light pixels are not darkened.
    sat = rgba[..., :3].max(-1) - rgba[..., :3].min(-1)
    glow = ((sat > 0.45) & (rgba[..., :3].max(-1) > 0.75))[..., None]
    rgb = np.where(glow, rgba[..., :3], rgb)
    # The rim: the alpha's edge, kept where it faces the key light (key = direction in x, y, -1..1).
    edge = np.clip(a - np.asarray(Image.fromarray((a * 255).astype("uint8")).filter(ImageFilter.MinFilter(9)), dtype=float) / 255, 0, 1)
    h, w = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    facing = np.clip(((xx / w - 0.5) * key[0] + (yy / h - 0.5) * key[1]) * 2, 0, 1)
    rgb = rgb + (edge * facing)[..., None] * (np.array(rim) / 255.0) * 0.9
    out = np.dstack([np.clip(rgb, 0, 1), a])
    return Image.fromarray((out * 255).astype("uint8"), "RGBA")


def composite(plate: Image.Image, shot: dict, renders: Path) -> Image.Image:
    canvas = plate.convert("RGBA").resize(SIZE)
    w, h = SIZE
    look = shot.get("light", {})
    for spot in sorted(shot["birds"], key=lambda s: s["y"]):
        figure = body(Image.open(renders / f"{spot['bird']}-alpha.png"))
        if spot.get("crop"):  # leave a prop out (fractions of the body's box): in a group a prop can turn into an extra bird
            x0, y0, x1, y1 = spot["crop"]
            figure = figure.crop((round(x0 * figure.width), round(y0 * figure.height), round(x1 * figure.width), round(y1 * figure.height)))
        target = max(8, round(spot["h"] * h))
        figure = figure.resize((max(1, round(figure.width * target / figure.height)), target), Image.LANCZOS)
        if spot.get("flip"):
            figure = figure.transpose(Image.FLIP_LEFT_RIGHT)
        x, y = round(spot["x"] * w - figure.width / 2), round(spot["y"] * h - figure.height)
        ambient = light_of(canvas, (x, y, x + figure.width, y + figure.height))
        figure = lit(figure, ambient, tuple(look.get("key", (-1, -1))), look.get("exposure", 0.85), tuple(look.get("rim", (255, 236, 200))))
        # Contact shadow: a soft ellipse under the feet.
        shadow = Image.new("L", SIZE, 0)
        ell = Image.new("L", (figure.width, max(4, figure.height // 10)), 0)
        from PIL import ImageDraw
        ImageDraw.Draw(ell).ellipse((0, 0, ell.width - 1, ell.height - 1), fill=150)
        shadow.paste(ell, (x, y + figure.height - ell.height // 2))
        shadow = shadow.filter(ImageFilter.GaussianBlur(max(2, figure.width // 25)))
        canvas = Image.composite(Image.new("RGBA", SIZE, (0, 0, 0, 255)), canvas, shadow.point(lambda v: v * 0.6))
        canvas.alpha_composite(figure, (x, y))
    return canvas.convert("RGB")


def integrate_prompt(shot: dict, plan: dict) -> str:
    cast = {c["id"]: c["description"] for c in plan["characters"]}
    described = "; ".join(cast[b] for b in dict.fromkeys(s["bird"] for s in shot["birds"]))
    return (f"Cinematic film still from a premium feature-film CG animation. {shot['keyframe']} Characters: {described}. "
            f"{plan['keyframeKeep']}")


def main() -> None:
    plan = json.loads(Path(sys.argv[1]).read_text())
    renders, out = Path(sys.argv[2]), Path(sys.argv[3])
    stage = arg("stage", "plate")
    only = {int(x) for x in arg("only").split(",")} if arg("only") else None
    strength = float(arg("strength", "0.72"))
    seeds = int(arg("seeds", "1"))
    for sub in ("plates", "composites", "keyframes"):
        (out / sub).mkdir(parents=True, exist_ok=True)
    for shot in plan["shots"]:
        sid = shot["id"]
        if only and sid not in only:
            continue
        name = f"{sid:02d}"
        seed = plan["seedBase"] + sid + int(arg("seed-offset", "0"))
        if stage == "plate":
            path = out / "plates" / f"{name}.png"
            if not path.exists():
                flux(["mflux-generate-flux2", "--model", MODEL, "--prompt", plate_prompt(shot, plan), "--width", str(SIZE[0]),
                      "--height", str(SIZE[1]), "--steps", "4", "--seed", str(seed), "--output", str(path)], out / "plates" / f"{name}.log")
            print(path, flush=True)
        elif stage == "composite":
            plate = Image.open(out / "plates" / f"{name}.png")
            path = out / "composites" / f"{name}.png"
            (composite(plate, shot, renders) if shot["birds"] else plate.convert("RGB").resize(SIZE)).save(path)
            print(path, flush=True)
        else:
            source = out / "composites" / f"{name}.png"
            for k in range(seeds):
                path = out / "keyframes" / f"{name}-i{int(strength * 100)}-s{seed + 100 * k}.png"
                if path.exists():
                    continue
                flux(["mflux-generate-flux2", "--model", MODEL, "--prompt", integrate_prompt(shot, plan) if shot["birds"] else plate_prompt(shot, plan),
                      "--image-path", str(source), "--image-strength", str(strength), "--width", str(SIZE[0]), "--height", str(SIZE[1]),
                      "--steps", "4", "--seed", str(seed + 100 * k), "--output", str(path)], out / "keyframes" / f"{path.stem}.log")
                print(path, flush=True)


if __name__ == "__main__":
    main()
