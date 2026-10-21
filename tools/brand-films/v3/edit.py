#!/usr/bin/env python3
"""The v3 edit: the picture cut to the music (no narrator). Every shot starts and ends on the score's beat grid
(grid.json from arrange.py), so the cuts land on the beat and the drops; each shot gets the camera its treatment names
on top of what the take already does (a handheld shake, a punch-in, a whip-pan blur, a snap zoom), its act's grade, film
grain, and its post effect (the blackout, the city relighting on the kicks, a white flash). The same edit makes the
animatic from the keyframes ($0, before any GPU) and the film from the 4K takes.

    python3 edit.py <treatment> <grid.json> <source dir> <out.mp4> --mode animatic|film [--size 1920x1080] [--edl edl.json]
                    [--score score.wav] [--worker <orazaka-worker-media>] [--fonts <dir>] [--titles en|fr|none] [--fps 24]
                    [--endcard end.mp4] [--place <kf>/place]   (9:16: the window follows the placed birds)

animatic: <source>/<id>.png (keyframes/final). film: <source>/<take>.mp4 per shot, chosen in edl.json
({"shots": {"3": {"take": "03-pigeon-ledge-t0.mp4", "in": 0.2}}}), slowed by the shot's speed and interpolated to the
output rate. With --score: the foley of every shot (the worker's foley.render), the mix (mixer.master: −14 LUFS,
≤ −1 dBTP) and the report beside the film (<out>.json). Needs ffmpeg with libass (ffmpeg-full).
"""
import json
import math
import os
import subprocess
import sys
import tempfile
from pathlib import Path

FF = os.environ.get("FFMPEG", "/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg")

#: A grade per act: eq (contrast, saturation, gamma), colour balance (shadows, highlights), a vignette.
GRADES = {
    "steel-night": "eq=contrast=1.12:saturation=0.75:gamma=0.92,colorbalance=bs=0.10:bm=0.04:rh=0.05:gh=0.02,vignette=PI/4.2",
    "teal-dark": "eq=contrast=1.15:saturation=0.9:gamma=0.95,colorbalance=rs=-0.06:bs=0.10:rh=0.06:gh=0.02,vignette=PI/4.5",
    "cyan-only": "eq=contrast=1.2:saturation=1.05:gamma=0.9,colorbalance=rs=-0.08:gs=0.03:bs=0.12:rm=-0.04,vignette=PI/4",
    "storm-mono": "eq=contrast=1.25:saturation=0.35:gamma=0.9,colorbalance=bs=0.06,vignette=PI/3.8",
    "neon-full": "eq=contrast=1.12:saturation=1.3:gamma=1.0,colorbalance=rs=0.05:bs=0.08:rh=0.04:bh=0.04,vignette=PI/5",
    "violet-night": "eq=contrast=1.12:saturation=1.05:gamma=0.95,colorbalance=rs=0.04:bs=0.10:rh=0.06:bh=0.06,vignette=PI/4.5",
    "violet-magenta-neon": "eq=contrast=1.15:saturation=1.25:gamma=0.98,colorbalance=rs=0.07:bs=0.09:rh=0.08:bh=0.05,vignette=PI/4.5",
    "cold-blue": "eq=contrast=1.22:saturation=0.55:gamma=0.9,colorbalance=rs=-0.05:bs=0.12,vignette=PI/3.8",
    "magenta-burst": "eq=contrast=1.12:saturation=1.35:gamma=1.02,colorbalance=rs=0.10:bs=0.06:rh=0.08:bh=0.04,vignette=PI/5",
}


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def spans(shots: list[dict], bpm: float, fps: int) -> list[tuple[int, int]]:
    """Each shot's first and last frame (exclusive) on the beat grid, rounded once from the cumulative beat (pure: the
    error never accumulates, every cut is within half a frame of its beat)."""
    beat = 60.0 / bpm
    out, at = [], 0
    for s in shots:
        a = round(at * beat * fps)
        at += s["beats"]
        out.append((a, round(at * beat * fps)))
    return out


def camera_crop(move: str, frames: int, w: int, h: int, seed: int) -> str:
    """The extra camera of a shot as a crop over a 112 % frame (pure): what the take or the still gets on top."""
    n = max(1, frames - 1)
    p = f"(n/{n})"
    zoom = {"push-in": f"1+0.10*{p}", "dolly-in": f"1+0.07*{p}", "snap-zoom": f"1+0.16*min(1,{p}*4)", "pull-back": f"1.10-0.10*{p}",
            "dolly-out": f"1.08-0.08*{p}", "crane-up": "1.04", "crane-down": "1.04"}.get(move, "1.02")
    dy = {"crane-up": f"(0.5-0.5*{p})", "crane-down": f"(0.5*{p})", "tilt-up": f"(0.6-0.6*{p})", "tilt-down": f"(0.6*{p})"}.get(move, "0.5")
    dx = {"tracking": f"(0.2+0.6*{p})", "orbit": f"(0.25+0.5*{p})", "whip-pan": f"(0.5+0.5*max(0,1-n/4))"}.get(move, "0.5")
    shake = ""
    if move in ("handheld", "fpv", "whip-pan"):
        amp = 0.010 if move == "handheld" else 0.016
        shake = (f"+{amp}*iw*(sin(n*0.41+{seed % 7})+0.6*sin(n*1.13+{seed % 5})+0.3*sin(n*2.7))")
    z = f"(1.12/({zoom}))"
    cw, ch = f"iw/{z}", f"ih/{z}"
    x = f"(iw-{cw})*{dx}{shake}"
    y = f"(ih-{ch})*{dy}" + (shake.replace("sin(n*0.41", "sin(n*0.37").replace("iw*", "ih*") if shake else "")
    return f"scale={int(w * 1.12) // 2 * 2}:{int(h * 1.12) // 2 * 2},crop=w='{cw}':h='{ch}':x='max(0,min(iw-ow,{x}))':y='max(0,min(ih-oh,{y}))',scale={w}:{h}"


def post_filter(effects: list[str], frames: int, fps: int, bpm: float) -> str:
    """The shot's post effects (pure): a blackout that eats the city, the relight on the kicks, a flash, a flicker."""
    out = []
    beat = 60.0 / bpm
    secs = frames / fps
    for e in effects:
        if e == "blackout":
            out.append(f"eq=eval=frame:brightness='-0.55*min(1,max(0,(t-{secs * 0.45:.2f})/{secs * 0.45:.2f}))"
                       f"+0.12*gt(sin(t*37),0.85)*lt(t,{secs * 0.8:.2f})'")
        elif e == "relight":
            steps = max(1, round(secs / beat))
            out.append(f"eq=eval=frame:brightness='-0.5*(1-min(1,floor(t/{beat:.4f})/{max(1, steps - 2)}))'")
        elif e == "flash":
            out.append("fade=t=in:st=0:d=0.18:color=white")
        elif e == "flicker":
            out.append(f"eq=eval=frame:brightness='-0.6*gt(t,{secs * 0.55:.2f})+0.25*gt(sin(t*53),0.7)*lt(t,{secs * 0.55:.2f})'")
    return ",".join(out)


def subject_x(shot: dict, place_dir: Path | None) -> float:
    """Where the shot's subject is, across the frame (0..1): the birds the composite placed (place/<id>.json), else
    the centre. The 9:16 window follows it (pure but for the file read)."""
    if place_dir is None:
        return 0.5
    f = place_dir / f"{shot['id']:02d}.json"
    if not f.exists():
        return 0.5
    birds = json.loads(f.read_text()).get("birds", {})
    return min(0.85, max(0.15, sum(b["x"] for b in birds.values()) / len(birds) / 1280)) if birds else 0.5


def shot_command(shot: dict, source: Path, mode: str, frames: int, fps: int, size: tuple[int, int], grade: str,
                 bpm: float, take_in: float, out: Path, vx: float = 0.5) -> list[str]:
    w, h = size
    chain = []
    if mode == "animatic":
        inputs = ["-loop", "1", "-framerate", str(fps), "-i", str(source)]
        chain.append(f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}:x='(iw-ow)*{vx:.3f}',format=yuv420p")
    else:
        speed = float(shot.get("speed", 1) or 1)
        inputs = ["-ss", f"{take_in:.3f}", "-i", str(source)]
        chain.append(f"setpts=PTS/{speed:.4f}")
        chain.append(f"minterpolate=fps={fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1")
        chain.append(f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h}:x='(iw-ow)*{vx:.3f}'")
    chain.append(camera_crop(shot["camera"], frames, w, h, shot["id"]))
    if shot["camera"] == "whip-pan":
        chain.append("gblur=sigma=40:sigmaV=0.01:enable='lt(n,3)'")
    chain.append(GRADES.get(grade, "null"))
    post = post_filter(shot.get("post", []), frames, fps, bpm)
    if post:
        chain.append(post)
    chain.append("noise=alls=7:allf=t")
    chain.append("format=yuv420p")
    return [FF, "-v", "error", "-y", *inputs, "-vf", ",".join(c for c in chain if c), "-frames:v", str(frames), "-r", str(fps),
            "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "14", str(out)]


def title_ass(plan: dict, at: float, until: float, size: tuple[int, int], language: str, worker: Path) -> str:
    sys.path.insert(0, str(worker))
    from app import titles  # noqa: PLC0415
    t = plan["titles"][0]
    texts = [titles.Text(at, until, t[language], kind="main", sub=t["sub"][language])]
    return titles.script(titles.Frame(*size), texts)


def foley_cues(plan: dict, bounds: list[tuple[int, int]], fps: int) -> list[dict]:
    """Every shot's sound list on the film's clock: a bed spans its shot, an event lands on its second (pure)."""
    cues = []
    for s, (a, b) in zip(plan["shots"], bounds):
        start, end = a / fps, b / fps
        for c in s.get("sound", []):
            if "at" in c:
                at = start + c["at"] / float(s.get("speed", 1) or 1) * (1.0 if c["at"] < (end - start) else 0.0)
                cues.append({"kind": c["kind"], "start": min(at, end - 0.05), "end": end, "gain": c["gain"], "shot": s["id"]})
            else:
                cues.append({"kind": c["kind"], "start": start, "end": end, "gain": c["gain"], "shot": s["id"]})
    return cues


def main() -> None:
    plan = json.loads(Path(sys.argv[1]).read_text())
    grid = json.loads(Path(sys.argv[2]).read_text())
    source, out = Path(sys.argv[3]), Path(sys.argv[4])
    mode = arg("mode", "animatic")
    fps = int(arg("fps", "24"))
    size = tuple(int(x) for x in arg("size", "1920x1080").split("x"))
    edl = json.loads(Path(arg("edl")).read_text()) if arg("edl") else {"shots": {}}
    bpm = float(grid["bpm"])
    bounds = spans(plan["shots"], bpm, fps)
    grades = plan.get("grades", {})
    out.parent.mkdir(parents=True, exist_ok=True)
    report = {"mode": mode, "fps": fps, "size": size, "bpm": bpm, "shots": []}
    with tempfile.TemporaryDirectory() as tmp:
        parts = []
        for s, (a, b) in zip(plan["shots"], bounds):
            frames = b - a
            pick = edl["shots"].get(str(s["id"]), {})
            src = source / (f"{s['id']:02d}.png" if mode == "animatic" else pick.get("take", f"{s['id']:02d}.mp4"))
            part = Path(tmp) / f"{s['id']:02d}.mp4"
            vx = subject_x(s, Path(arg("place")) if arg("place") else None) if size[1] > size[0] else 0.5
            cmd = shot_command(s, src, mode, frames, fps, size, grades.get(s.get("act"), ""), bpm, float(pick.get("in", 0.0)), part, vx)
            subprocess.run(cmd, check=True)
            parts.append(part)
            report["shots"].append({"id": s["id"], "slug": s["slug"], "start": round(a / fps, 3), "end": round(b / fps, 3), "source": src.name})
            print(f"{s['id']:02d} {s['slug']} {frames} frames", flush=True)
        listing = Path(tmp) / "list.txt"
        listing.write_text("".join(f"file '{p}'\n" for p in parts))
        body = Path(tmp) / "body.mp4"
        subprocess.run([FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(body)], check=True)
        total = bounds[-1][1] / fps
        picture = body
        language = arg("titles", "en")
        if language != "none" and plan.get("titles"):
            worker, fonts = Path(arg("worker")), arg("fonts")
            last = bounds[-1]
            ass = Path(tmp) / "titles.ass"
            ass.write_text(title_ass(plan, last[0] / fps + 0.4, total - 0.3, size, language, worker))
            titled = Path(tmp) / "titled.mp4"
            esc = str(ass).replace(":", r"\:")
            subprocess.run([FF, "-v", "error", "-y", "-i", str(body), "-vf", f"ass='{esc}':fontsdir='{fonts}'", "-c:v", "libx264",
                            "-preset", "medium", "-crf", "14", "-pix_fmt", "yuv420p", str(titled)], check=True)
            picture = titled
        if arg("endcard"):  # the brand's end card (endcard.py) after the last shot, at the film's size and rate
            ended = Path(tmp) / "ended.mp4"
            w, h = size
            subprocess.run([FF, "-v", "error", "-y", "-i", str(picture), "-i", arg("endcard"), "-filter_complex",
                            f"[1:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},format=yuv420p,setsar=1[e];"
                            f"[0:v]setsar=1[b];[b][e]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "medium",
                            "-crf", "14", "-pix_fmt", "yuv420p", str(ended)], check=True)
            picture = ended
            total += 4.0
            report["endcard"] = Path(arg("endcard")).name
        if arg("score"):
            sys.path.insert(0, str(Path(arg("worker"))))
            import soundfile  # noqa: PLC0415
            from app import foley, mixer  # noqa: PLC0415
            cues = foley_cues(plan, bounds, fps)
            if arg("endcard"):  # the mark lands on a hit
                end_at = bounds[-1][1] / fps
                cues += [{"kind": "impact", "start": end_at + 0.12, "end": total, "gain": -6, "shot": 0},
                         {"kind": "chime", "start": end_at + 1.1, "end": total, "gain": -16, "shot": 0}]
            stem = Path(tmp) / "foley.wav"
            soundfile.write(str(stem), foley.render(cues, total, seed=plan["seedBase"] % 1000), foley.RATE, subtype="PCM_24")
            mix = Path(tmp) / "mix.m4a"
            report["mix"] = mixer.master([mixer.Cue(arg("score"), 0.0, total, 1.0, fade=0.05)], [], str(stem), total, str(mix), ffmpeg=FF)
            report["foley"] = foley.coverage([{"id": s["id"], "characters": s.get("characters", [])} for s in plan["shots"]], cues)
            subprocess.run([FF, "-v", "error", "-y", "-i", str(picture), "-i", str(mix), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                            "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", str(out)], check=True)
        else:
            subprocess.run([FF, "-v", "error", "-y", "-i", str(picture), "-c", "copy", str(out)], check=True)
    Path(str(out) + ".json").write_text(json.dumps(report, indent=1, default=str))
    print(out, flush=True)


if __name__ == "__main__":
    main()
