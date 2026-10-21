#!/usr/bin/env python3
"""The keyframes of a v3 film, on-model and grounded by construction (ADR-080 v3). Every bird still starts from its
Mascot render (a model never draws a bird from nothing), but the v2 audit's anomalies are fixed in the staging:

1. **plate** — FLUX.2 [klein] 4B (Apache-2.0) draws the set alone, its key light stated in words (the treatment's
   `plate`); a shot with a prop and no character draws the prop in the plate;
2. **place** — the vision model finds, in the plate, the surface each grounded bird stands on and its scale reference
   (`vlm.locate`), written to `place/<id>.json`: the feet go on that surface, the height is the asked ratio of the
   reference (`stage.feet_on`, `stage.height_from`); a flying bird keeps its frame position; a held one rides its holder;
3. **composite** — the cleaned render (`stage.clean`: no props, no baked shadow), exposed and tinted by the light around
   it, its edge feathered and wrapped in the plate's light (`stage.edge_wrap`), and — only when it touches a surface —
   its own silhouette cast on the ground away from the key light (`stage.cast_shadow`);
4. **integrate** — FLUX.2 [klein] image-to-image from that composite at moderate image strengths (0.5 and 0.58:
   v2's 0.72–0.8 kept the flat cel look pasted on photographs): the bird is re-rendered as a lit, volumetric
   feature-film character standing in the plate's light. Several seeds; integrity.py keeps the one that passes the gates.

    python3 keyframes.py <treatment.json> <renders dir> <out dir> --stage plate|place|composite|integrate [--only 2,4]
                         [--strength 0.5,0.58] [--seeds 1]

Runs on the Mac (mflux on Metal; the place stage needs mlx-vlm): $0 of GPU.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "dawn"))
import importlib.util  # noqa: E402

import stage  # noqa: E402
from canvas import body  # noqa: E402

# v2's light helpers and the rule's exact words, from dawn/keyframes.py (same file name: loaded by path).
_spec = importlib.util.spec_from_file_location("dawn_keyframes", HERE.parent / "dawn" / "keyframes.py")
_dawn = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_dawn)
NO_CHILDREN, light_of, lit = _dawn.NO_CHILDREN, _dawn.light_of, _dawn.lit

MODEL = "flux2-klein-4b"
SIZE = (1280, 720)
EMPTY = "Empty scene, no animals, no birds, no characters, no people, no text, no logos."
RIM = {"left": (255, 236, 210), "right": (255, 236, 210)}


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def flux(args: list[str], log: Path) -> None:
    with log.open("w") as out:
        subprocess.run(args, check=True, stdout=out, stderr=subprocess.STDOUT)


def plate_prompt(shot: dict, plan: dict) -> str:
    props = " ".join(p["description"] for p in plan.get("props", []) if p["id"] in shot.get("props", []))
    with_prop = f" In the scene: {props}." if props and not shot["characters"] else ""
    return f"{plan['style']} {shot['plate']}{with_prop} {EMPTY} {NO_CHILDREN}"


def integrate_prompt(shot: dict, plan: dict) -> str:
    cast = {c["id"]: c["description"] for c in plan["characters"]}
    described = "; ".join(cast[c] for c in dict.fromkeys(shot["characters"]))
    props = " ".join(p["description"] for p in plan.get("props", []) if p["id"] in shot.get("props", []))
    return (f"{plan['style']} {shot['keyframe']} Characters: {described}. {('Prop: ' + props + '.') if props else ''} "
            f"{plan['keyframeKeep']} {NO_CHILDREN}")


def key_vector(key: str) -> tuple[float, float]:
    """v2's rim helper takes the key as a screen direction toward the light."""
    dx, dy = stage.SHADOW_DIR[key]
    return (-dx or 0.0, -1.0 if dy >= 0 else 0.5)


def place(shot: dict, plate_path: Path, vision) -> dict:
    """The boxes of each grounded bird's surface and scale reference in the plate (the evidence of where it stands)."""
    plate = Image.open(plate_path).convert("RGB").resize(SIZE)
    found: dict = {"surfaces": {}, "refs": {}}
    for g in shot.get("staging", []):
        if g["support"] != "ground":
            continue
        for kind, what in (("surfaces", g["surface"]), ("refs", g["scale"]["ref"])):
            if what not in found[kind]:
                found[kind][what] = vision.locate(plate, what)
    return found


def composite(plate: Image.Image, shot: dict, plan: dict, renders: Path, placed: dict) -> Image.Image:
    canvas = plate.convert("RGBA").resize(SIZE)
    w, h = SIZE
    key = shot["light"]["key"]
    hard = shot["light"].get("hard", True)
    spots: list[tuple[dict, Image.Image, int, int]] = []
    positions: dict[str, tuple[float, float, float]] = {}
    staged = sorted(shot.get("staging", []), key=lambda s: (s["support"] == "held", s.get("depth", s.get("y", 0.5))))
    # 1. Where each bird stands and how tall it is, in the plate's pixels, at the set's scale.
    for g in staged:
        if g["support"] == "ground":
            surface = placed["surfaces"].get(g["surface"]) or (0, int(h * 0.6), w, h)
            ref = placed["refs"].get(g["scale"]["ref"])
            fx, fy = stage.feet_on(tuple(surface), g.get("x", 0.5), g.get("depth", 0.4))
            target = (ref[3] - ref[1]) * g["scale"]["ratio"] if ref else 0.3 * h
        elif g["support"] == "held" and g.get("on") in positions:
            hx, hy, hh = positions[g["on"]]
            fx, fy, target = g.get("x", 0.5) * w, hy - hh * 0.72, g.get("h", 0.15) * h
        else:
            fx, fy, target = g["x"] * w, g["y"] * h, g.get("h", 0.25) * h
        positions[g["character"]] = (fx, fy, target)
    # 2. The camera comes to the birds' scale: a real-size bird in a set framed for people is a speck, so the plate is
    #    cropped around them (at most 3.2×) until the tallest reaches the shot's hero size — the scale against the set kept.
    grounded = [positions[g["character"]] for g in staged if g["support"] == "ground"]
    zoom, x0, y0 = stage.reframe(grounded, (w, h), stage.hero_size(shot)) if grounded else (1.0, 0.0, 0.0)
    if zoom > 1.0:
        canvas = canvas.crop((round(x0), round(y0), round(x0 + w / zoom), round(y0 + h / zoom))).resize(SIZE, Image.LANCZOS)
        for g in staged:
            if g["support"] == "air":
                continue  # a flyer keeps its frame position and size
            fx, fy, target = positions[g["character"]]
            positions[g["character"]] = ((fx - x0) * zoom, (fy - y0) * zoom, target * zoom)
    placed["reframe"] = {"zoom": round(zoom, 3), "x0": round(x0), "y0": round(y0)}
    placed["birds"] = {c: {"x": round(p[0]), "y": round(p[1]), "h": round(min(max(p[2], 0.05 * h), 0.95 * h))} for c, p in positions.items()}
    # 3. The birds.
    for g in staged:
        fig = stage.clean(body(Image.open(renders / f"{g['character']}-alpha.png")), g["character"])
        fx, fy, target = positions[g["character"]]
        fx, fy = round(fx), round(fy)
        target = int(round(min(max(target, 0.05 * h), 0.95 * h) if g["support"] != "air" else target))
        fig = fig.resize((max(1, round(fig.width * target / fig.height)), target), Image.LANCZOS)
        if g.get("flip"):
            fig = fig.transpose(Image.FLIP_LEFT_RIGHT)
        x, y = fx - fig.width // 2, fy - fig.height
        spots.append((g, fig, x, y))
    # Shadows first (all of them under every bird), then the birds from the back to the front.
    for g, fig, x, y in spots:
        if g["support"] != "ground":
            continue  # nothing on a surface it does not touch (v2's black ellipses in the air)
        alpha = np.asarray(fig.getchannel("A"), float) / 255.0
        shadow, (left, top) = stage.cast_shadow(alpha, key, hard)
        ambient = light_of(canvas, (x, y, x + fig.width, y + fig.height))
        tone = tuple(int(v) for v in (ambient * 255 * 0.25))
        layer = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        sh = Image.new("RGBA", (shadow.shape[1], shadow.shape[0]), (*tone, 255))
        sh.putalpha(Image.fromarray((shadow * 255).astype("uint8")))
        layer.paste(sh, (x + left, y + top), sh)
        canvas = Image.alpha_composite(canvas, layer)
    for g, fig, x, y in spots:
        ambient = light_of(canvas, (x, y, x + fig.width, y + fig.height))
        rim = RIM.get(key, (230, 240, 255))
        fig = lit(fig, ambient, key_vector(key), stage.exposure_for(ambient), rim)
        region = canvas.crop((max(0, x), max(0, y), min(w, x + fig.width), min(h, y + fig.height)))
        fig = stage.edge_wrap(fig, region)
        canvas.alpha_composite(fig, (max(0, x), max(0, y)), (max(0, -x), max(0, -y)))
    return canvas.convert("RGB")


def main() -> None:
    plan = json.loads(Path(sys.argv[1]).read_text())
    renders, out = Path(sys.argv[2]), Path(sys.argv[3])
    which = arg("stage", "plate")
    only = {int(x) for x in arg("only").split(",") if x.strip()} if arg("only") else None
    strengths = [float(x) for x in arg("strength", "0.5,0.58").split(",")]
    seeds = int(arg("seeds", "1"))
    for sub in ("plates", "place", "composites", "keyframes"):
        (out / sub).mkdir(parents=True, exist_ok=True)
    vision = None
    for shot in plan["shots"]:
        sid = shot["id"]
        if only and sid not in only:
            continue
        name = f"{sid:02d}"
        seed = plan["seedBase"] + sid + int(arg("seed-offset", "0"))
        if which == "plate":
            path = out / "plates" / f"{name}.png"
            if not path.exists():
                flux(["mflux-generate-flux2", "--model", MODEL, "--prompt", plate_prompt(shot, plan), "--width", str(SIZE[0]),
                      "--height", str(SIZE[1]), "--steps", "4", "--seed", str(seed), "--output", str(path)], out / "plates" / f"{name}.log")
            print(path, flush=True)
        elif which == "place":
            if not shot["characters"] or (out / "place" / f"{name}.json").exists() or not (out / "plates" / f"{name}.png").exists():
                continue
            if vision is None:
                from vlm import Vision  # noqa: PLC0415
                vision = Vision()
            found = place(shot, out / "plates" / f"{name}.png", vision)
            (out / "place" / f"{name}.json").write_text(json.dumps(found, indent=1))
            print(name, json.dumps(found), flush=True)
        elif which == "composite":
            plate = Image.open(out / "plates" / f"{name}.png")
            path = out / "composites" / f"{name}.png"
            if shot["characters"]:
                placed = json.loads((out / "place" / f"{name}.json").read_text())
                composite(plate, shot, plan, renders, placed).save(path)
                (out / "place" / f"{name}.json").write_text(json.dumps(placed, indent=1))  # with its reframe
            else:
                plate.convert("RGB").resize(SIZE).save(path)
            print(path, flush=True)
        else:
            if not shot["characters"]:
                continue  # the plate is the keyframe
            source = out / "composites" / f"{name}.png"
            for strength, k in [(st, k) for st in strengths for k in range(seeds)]:
                path = out / "keyframes" / f"{name}-i{int(strength * 100)}-s{seed + 100 * k}.png"
                if path.exists():
                    continue
                flux(["mflux-generate-flux2", "--model", MODEL, "--prompt", integrate_prompt(shot, plan),
                      "--image-path", str(source), "--image-strength", str(strength), "--width", str(SIZE[0]), "--height", str(SIZE[1]),
                      "--steps", "4", "--seed", str(seed + 100 * k), "--output", str(path)], out / "keyframes" / f"{path.stem}.log")
                print(path, flush=True)


if __name__ == "__main__":
    main()
