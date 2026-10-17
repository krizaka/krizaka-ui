#!/usr/bin/env python3
"""The cut of « Le monde de Krizaka : la tournée »: an edit decision list (edl.json) in, a graded, titled, scored film out.

    python3 edit.py <edl.json> <clips dir> <out.mp4> --aspect 16x9|9x16 [--vclips <9:16 clips dir>] [--captions en|fr] [--music bed.wav]
                    [--fonts <packages/fonts/files/native>] [--only-shots a,b] [--work dir]

Per shot: trim, speed or ramp (two segments), motion-compensated 16 → 30 fps, fit to 1920x1080 / 1080x1920 (a wide shot
in a vertical film sits on its own blurred enlargement), the era's grade (GRADES), then the shots are joined with
xfade (a hard cut is a 1-frame fade). Titles and captions are PNGs drawn with the Krizaka type (Plus Jakarta Sans),
overlaid on their times. The film is labelled AI-generated in its metadata and on the end card.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FPS = 30
SIZES = {"16x9": (1920, 1080), "9x16": (1080, 1920)}

# One look per era: ffmpeg filters on 8-bit RGB after scaling. Sepia and grain are mixed, never full strength.
GRADES = {
    "code": "null",
    "dawn": "colorbalance=rh=0.05:gh=0.01:bh=-0.04:rs=-0.02:bs=0.03,eq=contrast=1.05:saturation=1.05",
    "club": "colorbalance=rs=-0.04:bs=0.06:rh=0.09:gh=0.02:bh=-0.07,eq=contrast=1.14:saturation=0.92:gamma=0.96,vignette=PI/4.5",
    "sepia": "split[a][b];[b]colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131[s];[a][s]blend=all_mode=normal:all_opacity=0.62,eq=contrast=1.10:gamma=0.95,noise=alls=7:allf=t,vignette=PI/4",
    "nineties": "eq=saturation=0.86:contrast=1.04:gamma=1.04,colorbalance=rs=0.03:gs=-0.01:bs=-0.03:rh=0.04,noise=alls=13:allf=t+u",
    "golden": "colorbalance=rs=0.07:gs=0.02:bs=-0.08:rm=0.05:gm=0.01:bm=-0.05:rh=0.04,eq=saturation=1.12:contrast=1.04",
    "broadcast": "eq=contrast=1.07:saturation=1.10,unsharp=5:5:0.4",
}

TRANSITIONS = {"cut": ("fade", 1 / FPS), "dissolve": ("dissolve", 0.5), "flash": ("fadewhite", 0.25),
               "whip": ("hblur", 0.25), "black": ("fadeblack", 0.6)}


def run(args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def shot_seconds(s):
    if "ramp" in s:
        at, a, b = s["ramp"]
        return (at - s["in"]) / a + (s["out"] - at) / b
    return (s["out"] - s["in"]) / s.get("speed", 1.0)


def fit(aspect, wide_source):
    w, h = SIZES[aspect]
    if aspect == "9x16" and wide_source:  # a wide shot in the vertical film: itself, over its own blurred enlargement
        return (f"split[f][g];[g]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},gblur=sigma=30,eq=brightness=-0.08[bg];"
                f"[f]scale={w}:-2:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2")
    return f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h}"


def render_shot(s, clips, aspect, work, i, vclips=None):
    # The vertical film takes a shot's own 9:16 clip when there is one; otherwise the wide clip over its blurred enlargement.
    own = vclips / s["clip"] if vclips else None
    src = own if own and own.exists() else clips / s["clip"]
    wide = not (own and own.exists())
    if not wide:  # the shot's own vertical clip may need its own in/out (the code film's 9:16 render keeps its own timing)
        s = {**s, "in": s.get("in9x16", s["in"]), "out": s.get("out9x16", s["out"])}
    tail = f"minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1," if s.get("interpolate", True) else f"fps={FPS},"
    look = GRADES[s.get("grade", "dawn")]
    parts = [(s["in"], s["ramp"][0], s["ramp"][1]), (s["ramp"][0], s["out"], s["ramp"][2])] if "ramp" in s else [(s["in"], s["out"], s.get("speed", 1.0))]
    segs = []
    for k, (a, b, speed) in enumerate(parts):
        seg = work / f"s{i:02d}-{k}.mp4"
        graph = f"[0:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{speed},{tail}{fit(aspect, wide)},format=rgb24,{look},format=yuv420p,setsar=1[v]"
        run(["-i", str(src), "-filter_complex", graph, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-r", str(FPS), str(seg)])
        segs.append(seg)
    out = work / f"s{i:02d}.mp4"
    if len(segs) == 1:
        segs[0].rename(out)
    else:
        lst = work / f"s{i:02d}.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in segs))
        run(["-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)])
    return out


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).strip())


def text_png(path, size, lines, font, px, y, shadow=True, box=False):
    w, h = size
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(str(font), px)
    total = len(lines) * int(px * 1.25)
    top = int(y * h - total / 2)
    for n, line in enumerate(lines):
        tw = d.textlength(line, font=f)
        x, yy = (w - tw) / 2, top + n * int(px * 1.25)
        if box:
            pad = px * 0.45
            d.rounded_rectangle([x - pad, yy - pad * 0.6, x + tw + pad, yy + px * 1.15 + pad * 0.3], radius=px * 0.3, fill=(10, 14, 22, 150))
        if shadow:
            for dx, dy in ((0, 3), (2, 2), (-2, 2)):
                d.text((x + dx, yy + dy), line, font=f, fill=(0, 0, 0, 140))
        d.text((x, yy), line, font=f, fill=(255, 255, 255, 255))
    img.save(path)


def wrap(text, font, px, width):
    f = ImageFont.truetype(str(font), px)
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if f.getlength(trial) > width and cur:
            lines.append(cur)
            cur = word
        else:
            cur = trial
    return lines + [cur]


def main():
    edl = json.loads(Path(sys.argv[1]).read_text())
    clips, out = Path(sys.argv[2]), Path(sys.argv[3])
    aspect, lang = arg("aspect", "16x9"), arg("captions")
    fonts = Path(arg("fonts", str(Path(__file__).resolve().parents[3] / "packages/fonts/files/native")))
    work = Path(arg("work") or tempfile.mkdtemp(prefix="epic-cut-")).resolve()
    work.mkdir(parents=True, exist_ok=True)
    only = arg("only-shots", "").split(",") if arg("only-shots") else None
    shots = [s for s in edl["shots"] if not only or s["id"] in only]
    size = SIZES[aspect]

    rendered = []
    for i, s in enumerate(shots):
        cache = work / f"{aspect}-{s['id']}.mp4"
        if not cache.exists():
            render_shot(s, clips, aspect, work, i, Path(arg("vclips")) if aspect == "9x16" and arg("vclips") else None).rename(cache)
        rendered.append(cache)
        print(f"shot {s['id']}: {duration(cache):.2f} s", flush=True)

    # Join: xfade chain; each offset = running length - the transition's own length.
    inputs, graph, last, t = [], [], "0:v", duration(rendered[0])
    for p in rendered:
        inputs += ["-i", str(p)]
    starts = [0.0]
    for k in range(1, len(rendered)):
        kind, d = TRANSITIONS[shots[k - 1].get("to", "cut")]
        offset = t - d - 0.02  # a margin: xfade drops the rest of the chain when offset + d meets the end exactly
        starts.append(offset)
        graph.append(f"[{last}][{k}:v]xfade=transition={kind}:duration={d:.4f}:offset={offset:.4f}[x{k}]")
        last, t = f"x{k}", offset + duration(rendered[k])
    total = t

    # Titles and captions: PNG layers on their times.
    layers, n = [], len(rendered)
    bold, semi = fonts / "PlusJakartaSans-ExtraBold.ttf", fonts / "PlusJakartaSans-SemiBold.ttf"
    short = min(size)
    for k, title in enumerate(edl.get("titles", [])):
        if title.get("lang") and title["lang"] != (lang or "en"):
            continue
        anchor = starts[[s["id"] for s in shots].index(title["shot"])] if title.get("shot") in [s["id"] for s in shots] else None
        if anchor is None:
            continue
        png = work / f"{aspect}-title-{k}.png"
        px = int(short * title.get("size", 0.07))
        text_png(png, size, wrap(title["text"], bold, px, size[0] * 0.86), bold, px, title.get("y", 0.45))
        layers.append((png, anchor + title.get("at", 0.3), anchor + title.get("at", 0.3) + title["seconds"]))
    if lang:
        for k, s in enumerate(shots):
            if not s.get("caption"):
                continue
            png = work / f"{aspect}-cap-{lang}-{k}.png"
            px = int(short * (0.040 if aspect == "16x9" else 0.050))
            text_png(png, size, wrap(s["caption"][lang], semi, px, size[0] * 0.84), semi, px, 0.84 if aspect == "16x9" else 0.78, box=True)
            layers.append((png, starts[k] + s.get("captionAt", 0.25), min(starts[k] + s.get("captionAt", 0.25) + s.get("captionSeconds", 3.8), total)))
    for j, (png, a, b) in enumerate(layers):
        inputs += ["-loop", "1", "-t", f"{total:.3f}", "-i", str(png)]
        idx = n + j
        graph.append(f"[{idx}:v]format=rgba,fade=t=in:st={a:.3f}:d=0.25:alpha=1,fade=t=out:st={b - 0.25:.3f}:d=0.25:alpha=1[t{j}]")
        graph.append(f"[{last}][t{j}]overlay=0:0:enable='between(t,{a:.3f},{b:.3f})'[o{j}]")
        last = f"o{j}"

    audio = []
    music = arg("music")
    if music:
        inputs += ["-i", music]
        a = len(rendered) + len(layers)
        graph.append(f"[{a}:a]atrim=0:{total:.3f},afade=t=in:d=0.4,afade=t=out:st={total - 2.5:.3f}:d=2.5,loudnorm=I=-14:TP=-1.5:LRA=11[a]")
        audio = ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    meta = ["-metadata", "title=Le monde de Krizaka : la tournée", "-metadata", "comment=AI-generated (Wan 2.2 I2V A14B, FLUX.2 klein, ACE-Step 1.5) from the @krizaka/ui Mascot renders",
            "-metadata", 'description={"aiGenerated": true}']
    run([*inputs, "-filter_complex", ";".join(graph), "-map", f"[{last}]", *audio, "-c:v", "libx264", "-preset", "slow", "-crf", "18",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", f"{total:.3f}", *meta, str(out)])
    (out.with_suffix(".timeline.json")).write_text(json.dumps({"total": total, "starts": dict(zip([s["id"] for s in shots], starts))}, indent=1))
    print(f"{out} {total:.2f} s")


if __name__ == "__main__":
    main()
