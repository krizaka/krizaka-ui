#!/usr/bin/env python3
"""The v3 gate on every keyframe and every take (ADR-080 v3): the anomalies of the v2 audit, checked on the pixels.

The questions are the pack's own (`orazaka cinema stage <treatment> --out questions.json`, orazaka-cli
cinema.staging.ts), answered by the local vision model (vlm.py, read strictly); the numbers are measured here.

    <venv with mlx-vlm, opencv>/bin/python integrity.py keyframes <treatment> <questions.json> <renders> <kf dir> <out.json> [--only 3,4]
    <venv …>/bin/python integrity.py takes <treatment> <questions.json> <renders> <takes dir> <out.json> [file.mp4 …]

**keyframes** — for each candidate of a character shot (<kf>/keyframes/<id>-*.png): the shot's questions (grounded on its
surface, no floating shadow, shadows with the light, nothing pasted), the character's scale against its reference
(both found by the model, `scale`), its light against the plate around it (`colour`) and its design against its render
(`onModel`). The best candidate (every check passed, else the fewest failed) is copied to <kf>/final/<id>.png; a shot with
no clean candidate is listed in `rejected` and is not sent to the GPU.

**takes** — six frames across each take: the camera really moves when the shot asks a move (`static`, phase correlation),
the characters do not slide or float (`sliding`, four frames in one strip), they stay on their design (`onModel`, the
last frame), a prop stays the same object across a cut (`continuity`), nothing whites out (`whiteout`).

Exits 1 when a file is rejected. Pure helpers are tested in v3.test.mjs.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "dawn"))

#: Thresholds: the pack's (cinema.staging.ts) — the same numbers, said once there and mirrored here (v3.test.mjs).
MIN_CAMERA_SHIFT = 0.0015
MIN_ZOOM = 0.01
LUMA_RATIO = (0.55, 1.6)
MAX_CHROMA_SHIFT = 15
MAX_CLIPPED_SECONDS = 0.3
MAX_CONTACT_RATIO = 0.85
SCALE_TOLERANCE = 1.43
SKIP_SCALE = {"extreme close-up", "insert", "close-up"}


def lab(rgb: np.ndarray) -> np.ndarray:
    """sRGB (0..1, …×3) → CIELAB (pure, D65)."""
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def light_match(image: np.ndarray, box: tuple[int, int, int, int], own_rgb: tuple[float, float, float] = (1.0, 1.0, 1.0)) -> dict:
    """The character's light against the plate around it (pure). `lumaRatio`: its luminance over the plate's around
    it. `chromaShift`: light tints multiplicatively, so the colour of the light the bird took (its mean RGB over its
    render's own, `own_rgb`) is compared with the colour of the plate's light (the ring's mean RGB), as chromaticities
    in log space ×100: a bird under a warm lamp is warmer than its render by about as much as its surroundings are
    warm; v2's pasted birds kept their render's colours in any light."""
    h, w = image.shape[:2]
    x0, y0, x1, y1 = box
    inner = image[y0:y1, x0:x1].reshape(-1, 3)
    pad = max(x1 - x0, y1 - y0) // 2
    ring = image[max(0, y0 - pad):min(h, y1 + pad), max(0, x0 - pad):min(w, x1 + pad)].copy()
    ring[(y0 - max(0, y0 - pad)):(y1 - max(0, y0 - pad)), (x0 - max(0, x0 - pad)):(x1 - max(0, x0 - pad))] = np.nan
    ring = ring.reshape(-1, 3)
    ring = ring[~np.isnan(ring).any(1)]
    if len(inner) == 0 or len(ring) == 0:
        return {"lumaRatio": 1.0, "chromaShift": 0.0}
    luma = lambda x: 0.2126 * x[:, 0] + 0.7152 * x[:, 1] + 0.0722 * x[:, 2]  # noqa: E731
    ratio = float((luma(inner).mean() + 0.01) / (luma(ring).mean() + 0.01))
    chroma = lambda g: np.log(g + 1e-3) - np.log(g + 1e-3).mean()  # noqa: E731
    light_bird = inner.mean(0) / np.maximum(np.asarray(own_rgb, float), 1e-3)
    light_plate = ring.mean(0)
    return {"lumaRatio": round(ratio, 3), "chromaShift": round(float(np.linalg.norm(chroma(light_bird) - chroma(light_plate)) * 100), 2)}


def contact_ratio(image: np.ndarray, box: tuple[int, int, int, int]) -> float:
    """How much darker the ground is right under a standing bird than beside it (pure): the luminance of a thin band
    under its feet over the same band left and right of it. A contact shadow reads below ~0.85; v2's pasted birds,
    with nothing under them, read ~1."""
    h, w = image.shape[:2]
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    top, bottom = min(h - 1, y1 - int(0.02 * bh)), min(h, y1 + max(2, int(0.06 * bh)))
    if bottom - top < 2:
        return 1.0
    luma = 0.2126 * image[..., 0] + 0.7152 * image[..., 1] + 0.0722 * image[..., 2]
    under = luma[top:bottom, x0 + bw // 5:x1 - bw // 5]
    left = luma[top:bottom, max(0, x0 - bw):max(0, x0 - bw // 4)]
    right = luma[top:bottom, min(w, x1 + bw // 4):min(w, x1 + bw)]
    beside = np.concatenate([left.ravel(), right.ravel()])
    if under.size == 0 or beside.size == 0:
        return 1.0
    return round(float((under.mean() + 0.01) / (beside.mean() + 0.01)), 3)


def render_rgb(figure) -> tuple[float, float, float]:
    """The render's own mean RGB over its opaque pixels (what the character looks like in white light)."""
    rgba = np.asarray(figure.convert("RGBA"), float) / 255.0
    opaque = rgba[..., 3] > 0.5
    m = rgba[..., :3][opaque].mean(0)
    return float(m[0]), float(m[1]), float(m[2])


def camera_motion(frames: list[np.ndarray]) -> dict:
    """Median translation per frame (share of the width) and the scale change, from phase correlation (pure, OpenCV)."""
    import cv2  # noqa: PLC0415
    shifts, grey = [], [cv2.cvtColor(f, cv2.COLOR_RGB2GRAY).astype(np.float32) for f in frames]
    for a, b in zip(grey, grey[1:]):
        (dx, dy), _ = cv2.phaseCorrelate(a, b)
        shifts.append(np.hypot(dx, dy) / a.shape[1])
    # Zoom: the log-polar phase correlation of the first and last frames' magnitude spectra.
    first, last = grey[0], grey[-1]
    centre = (first.shape[1] / 2, first.shape[0] / 2)
    radius = min(centre)
    lp0 = cv2.warpPolar(first, (256, 256), centre, radius, cv2.WARP_POLAR_LOG)
    lp1 = cv2.warpPolar(last, (256, 256), centre, radius, cv2.WARP_POLAR_LOG)
    (dr, _), _ = cv2.phaseCorrelate(lp0, lp1)
    zoom = abs(np.exp(dr * np.log(radius) / 256) - 1)
    steps = max(1, len(frames) - 1)
    return {"cameraShift": round(float(np.median(shifts)) if shifts else 0.0, 5), "zoom": round(float(zoom), 4), "frames": steps}


def clipped_seconds(frames: list[np.ndarray], spacing: float) -> float:
    """Seconds where more than a third of the frame is clipped white (pure)."""
    return round(sum(spacing for f in frames if (f.min(-1) >= 250).mean() > 1 / 3), 2)


def scale_ok(character: int, ref: int, ratio: float) -> bool:
    factor = (character / max(1, ref)) / ratio
    return 1 / SCALE_TOLERANCE <= factor <= SCALE_TOLERANCE


def strip(frames: list[Image.Image]) -> Image.Image:
    """Four frames side by side (one image for the model)."""
    w, h = 588, 336
    out = Image.new("RGB", (w * 2, h * 2))
    for k, f in enumerate(frames[:4]):
        out.paste(f.convert("RGB").resize((w, h)), ((k % 2) * w, (k // 2) * h))
    return out


def seconds_of(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def grab(path: Path, at: float, tmp: Path, k: int) -> Image.Image:
    out = tmp / f"{path.stem}-{k}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{at:.3f}", "-i", str(path), "-frames:v", "1", str(out)], check=True)
    if not out.exists() or not out.stat().st_size:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", str(path), "-frames:v", "1", str(out)], check=True)
    return Image.open(out).convert("RGB")


def reference_figure(renders: Path, character: str) -> Image.Image:
    import stage  # noqa: PLC0415
    from canvas import body  # noqa: PLC0415
    return stage.clean(body(Image.open(renders / f"{character}-alpha.png")), character)


def reference(renders: Path, character: str) -> Image.Image:
    fig = reference_figure(renders, character)
    sheet = Image.new("RGB", (fig.width + 40, fig.height + 40), (128, 128, 128))
    sheet.paste(fig, (20, 20), fig)
    return sheet


def check_keyframe(v, path: Path, shot: dict, qs: dict, plan: dict, renders: Path, placed: dict | None = None) -> list[dict]:
    """Every check of one keyframe candidate: [{check, pass, detail}]."""
    img = Image.open(path).convert("RGB")
    arr = np.asarray(img, float) / 255.0
    described = {c["id"]: c["description"].split(",")[0] for c in plan["characters"]}
    out = []
    for q in qs["questions"]:
        ok, answer = v.yes_no([img], q["question"], q["pass"])
        out.append({"check": q["check"], "pass": ok, "detail": answer})
    for g in shot.get("staging", []):
        box = v.locate(img, described[g["character"]])
        if box is None:
            out.append({"check": "onModel", "pass": False, "detail": f"{g['character']} not found"})
            continue
        crop = img.crop(box)
        ok, answer = v.yes_no([reference(renders, g["character"]), crop], qs_take(qs, "onModel"), "YES")
        out.append({"check": "onModel", "pass": ok, "detail": f"{g['character']}: {answer}"})
        # Recorded, not gating: on the calibration set (calibration.json) neither the light-colour nor the luminance
        # measure separated v2's pasted birds from v3's lit ones; the contact ratio is a soft second opinion.
        m = light_match(arr, box, render_rgb(reference_figure(renders, g["character"])))
        if g["support"] == "ground":
            m["contact"] = contact_ratio(arr, box)
        out.append({"check": "measured", "pass": True, "detail": f"{g['character']}: {m}"})
        # Scale: the composite put the bird at the set's scale (its reference found in the plate, place/<id>.json); the
        # keyframe must keep that height (FLUX may not grow or shrink it). A reference cropped by the frame cannot be
        # measured again on the keyframe, so the composite's height is the measure.
        placed_h = (placed or {}).get("birds", {}).get(g["character"], {}).get("h")
        if placed_h and shot.get("framing") not in SKIP_SCALE:
            ok = scale_ok(box[3] - box[1], placed_h, 1.0)
            out.append({"check": "scale", "pass": ok, "detail": f"{g['character']} {box[3] - box[1]} px, staged {round(placed_h)} px"})
    return out


def qs_take(qs: dict, key: str) -> str:
    return qs.get("take", {}).get(key, {}).get("ask") or QUESTIONS[key]


QUESTIONS: dict = {}


def main() -> None:
    from vlm import Vision  # noqa: PLC0415

    mode, plan = sys.argv[1], json.loads(Path(sys.argv[2]).read_text())
    questions = json.loads(Path(sys.argv[3]).read_text())
    QUESTIONS.update({k: v["ask"] for k, v in questions["take"].items()})
    renders, folder, out = Path(sys.argv[4]), Path(sys.argv[5]), Path(sys.argv[6])
    only = {int(x) for x in sys.argv[sys.argv.index("--only") + 1].split(",") if x.strip()} if "--only" in sys.argv else None
    shots = {s["id"]: s for s in plan["shots"]}
    qs_by = {q["id"]: q for q in questions["shots"]}
    v = Vision()
    report: dict = {"mode": mode, "files": {}, "rejected": [], "chosen": {}}
    if mode == "keyframes":
        (folder / "final").mkdir(exist_ok=True)
        for sid, shot in shots.items():
            if only and sid not in only:
                continue
            if not shot["characters"]:
                shutil.copy(folder / "plates" / f"{sid:02d}.png", folder / "final" / f"{sid:02d}.png")
                continue
            ranked = []
            for cand in sorted((folder / "keyframes").glob(f"{sid:02d}-*.png")):
                place = folder / "place" / f"{sid:02d}.json"
                checks = check_keyframe(v, cand, shot, qs_by[sid], plan, renders, json.loads(place.read_text()) if place.exists() else None)
                report["files"][cand.name] = checks
                fails = [c["check"] for c in checks if not c["pass"]]
                ranked.append((len(fails), cand))
                print(cand.name, "PASS" if not fails else f"FAIL {fails}", flush=True)
            if not ranked:
                continue
            ranked.sort()
            best = ranked[0][1]
            report["chosen"][str(sid)] = best.name
            shutil.copy(best, folder / "final" / f"{sid:02d}.png")
            if ranked[0][0] > 0:
                report["rejected"].append(best.name)
    else:
        names = sys.argv[7:] or sorted(p.name for p in folder.glob("*.mp4"))
        last_frames: dict[int, Image.Image] = {}
        with tempfile.TemporaryDirectory() as tmp:
            for name in names:
                path = folder / name
                sid = int(name[:2])
                shot = shots[sid]
                secs = seconds_of(path)
                times = [0.05 + (secs - 0.1) * k / 5 for k in range(6)]
                frames = [grab(path, t, Path(tmp), k) for k, t in enumerate(times)]
                arrays = [np.asarray(f) for f in frames]
                checks = []
                m = camera_motion(arrays)
                if shot["camera"] != "locked":
                    moving = m["cameraShift"] >= MIN_CAMERA_SHIFT or m["zoom"] >= MIN_ZOOM
                    checks.append({"check": "static", "pass": moving, "detail": m})
                clip = clipped_seconds(arrays, secs / 6)
                checks.append({"check": "whiteout", "pass": clip <= MAX_CLIPPED_SECONDS, "detail": clip})
                if shot["characters"]:
                    ok, answer = v.yes_no([strip([frames[0], frames[2], frames[3], frames[5]])], qs_take(questions, "sliding"), "NO")
                    checks.append({"check": "sliding", "pass": ok, "detail": answer})
                    described = {c["id"]: c["description"].split(",")[0] for c in plan["characters"]}
                    for c in shot["characters"]:
                        box = v.locate(frames[-1], described[c])
                        if box is None:
                            checks.append({"check": "onModel", "pass": shot.get("framing") == "insert", "detail": f"{c} not found in the last frame"})
                            continue
                        ok, answer = v.yes_no([reference(renders, c), frames[-1].crop(box)], qs_take(questions, "onModel"), "YES")
                        checks.append({"check": "onModel", "pass": ok, "detail": f"{c}: {answer}"})
                prev = shots.get(sid - 1)
                shared = [p for p in shot.get("props", []) if prev and p in prev.get("props", [])]
                if shared and (sid - 1) in last_frames:
                    prop = next(p["description"] for p in plan["props"] if p["id"] == shared[0])
                    q = qs_take(questions, "continuity").replace("{prop}", f"the {prop.split(',')[0]}")
                    ok, answer = v.yes_no([last_frames[sid - 1], frames[0]], q, "YES")
                    checks.append({"check": "continuity", "pass": ok, "detail": answer})
                last_frames[sid] = frames[-1]
                report["files"][name] = checks
                fails = [c["check"] for c in checks if not c["pass"]]
                if fails:
                    report["rejected"].append(name)
                print(name, "PASS" if not fails else f"FAIL {fails}", flush=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=1, default=str))
    print("rejected:", report["rejected"] or "none")
    sys.exit(1 if report["rejected"] else 0)


if __name__ == "__main__":
    main()
