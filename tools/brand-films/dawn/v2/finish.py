#!/usr/bin/env python3
"""The finish of « l'aube » v2 (orazaka#289): the Orazaka media worker's cut, then the new sound and text of the pack —
the narrator placed on the shots his lines belong to, a score that follows the arc ducked under him, the shots' own
foley, a -14 LUFS / -1 dBTP master, film titles and subtitles — and the deliverables per language. On the Mac.

    python3 finish.py <treatment.json> <edl.json> <takes dir> <score dir> <voice dir> <endcard.mp4|-> <out dir>
                      --worker <orazaka-worker-media> --cli <orazaka-cli> --fonts <dir>
                      [--master 2160p|1080p] [--shots 1-4] [--kinds 2160p,1080p,9:16] [--languages en,fr]

1. **Cut** — edl.json's shots (take, in-point, screen time), graded (teal-orange LUT), 16 → 24 fps; no synthesized bed
   (the foley is now per shot): `cut.cut`, `text: false`. The end card from the code film, joined with a fade.
2. **Timeline** — `orazaka cinema timeline --spans` places every line (its measured length), music cue and sound on the
   cut's own spans, and says which line does not fit its shots.
3. **Foley** — `foley.render` of the timeline's sound list; its coverage.
4. **Mix** per language — `mixer.master`: the beat cues at their intensity, ducked under the narrator, the foley, -14 LUFS,
   true peak ≤ -1 dBTP, measured. The site's mix has no narrator.
5. **Text** — `titles.script` per deliverable frame (main title pairing, film subtitles; no burnt label: the players draw the AI disclosure), burnt by libass in
   `deliver.deliver`; a WebVTT per language.
Writes <out>/finish-report.json: the timeline, the loudness of each mix, the foley coverage, the deliverables.
"""
import json
import subprocess
import sys
from pathlib import Path

FRAMES = {"2160p": (3840, 2160), "1080p": (1920, 1080), "9:16": (1080, 1920)}


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def run(command: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(command, check=True, **kw)


def seconds_of(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0",
                          str(path)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def shot_range(spec: str | None, count: int) -> list[int]:
    if not spec:
        return list(range(1, count + 1))
    a, b = (int(x) for x in spec.split("-"))
    return list(range(a, b + 1))


def parts(count: int, limit: int, cuts: list[bool]) -> list[list[int]]:
    """The film in parts the worker can cut (at most ``limit`` shots each), as [start, end) shot indexes: balanced, and each
    part after the first starting on a hard cut (``cuts[i]``: shot i comes in on a cut), so no transition spans two parts."""
    if count <= limit:
        return [[0, count]]
    pieces = -(-count // limit)
    bounds, start = [], 0
    for k in range(1, pieces):
        ideal = round(count * k / pieces)
        at = min((i for i in range(start + 1, count) if cuts[i] and i - start <= limit and count - i <= limit * (pieces - k)),
                 key=lambda i: abs(i - ideal))
        bounds.append([start, at])
        start = at
    return bounds + [[start, count]]


def vtt(texts: list[tuple[str, float, float]]) -> str:
    def stamp(t: float) -> str:
        return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}"
    out = ["WEBVTT", ""]
    for n, (text, start, end) in enumerate(sorted(texts, key=lambda x: x[1]), start=1):
        out += [str(n), f"{stamp(start)} --> {stamp(end)}", text, ""]
    return "\n".join(out)


def main() -> None:
    treatment = json.loads(Path(sys.argv[1]).read_text())
    edl = json.loads(Path(sys.argv[2]).read_text())
    takes, score_dir, voice_dir = Path(sys.argv[3]), Path(sys.argv[4]), Path(sys.argv[5])
    endcard = None if sys.argv[6] == "-" else Path(sys.argv[6])
    out = Path(sys.argv[7])
    out.mkdir(parents=True, exist_ok=True)
    worker, cli, fonts = arg("worker"), arg("cli"), arg("fonts")
    sys.path.insert(0, worker)
    from app import cut, deliver, foley, mixer, titles  # noqa: PLC0415

    import soundfile  # noqa: PLC0415

    picked = shot_range(arg("shots"), len(edl["shots"]))
    shots = [s for s in edl["shots"] if s["shot"] in picked]
    # A part of the film (a proof segment) is its own treatment: its shots renumbered, its lines and cues kept if inside.
    sub = dict(treatment)
    renumber = {s["shot"]: k + 1 for k, s in enumerate(shots)}
    sub["shots"] = []
    for s in treatment["shots"]:
        if s["id"] in renumber:
            c = dict(s, id=renumber[s["id"]])
            if "chainFrom" in c:
                c.pop("chainFrom")
            sub["shots"].append(c)
    sub["lines"] = [dict(line, shots=[renumber[i] for i in line["shots"]]) for line in treatment["lines"]
                    if all(i in renumber for i in line["shots"])]
    beats = {s["beat"] for s in sub["shots"]}
    kept = []
    for c in treatment["music"]["cues"]:
        if "shots" in c:  # a cue by place: kept where it overlaps the part, its span clipped and renumbered
            inside = [renumber[i] for i in range(c["shots"][0], c["shots"][1] + 1) if i in renumber]
            if inside:
                kept.append(dict(c, shots=[min(inside), max(inside)]))
        elif c["beat"] in beats:
            kept.append(c)
    sub["music"] = dict(treatment["music"], cues=kept)
    (out / "treatment.part.json").write_text(json.dumps(sub, ensure_ascii=False))

    # 1. The cut.
    raw = {"aspect": "16:9", "fps": 24, "master": arg("master", "2160p"), "text": False, "grade": edl.get("grade", "teal-orange"),
           "upscale": "none", "interpolate": True, "ambience": "none", "sfx": False, "label": "AI-generated", "shots": []}
    for i, s in enumerate(shots):
        clip = seconds_of(takes / s["take"])
        item = {"clip": i, "in": s["in"], "out": round(min(s["in"] + s["screen"], clip - 0.02), 3), "speed": 1.0,
                "zoom": s.get("zoom", 1.0), "transition": s.get("transition", "cut") if i else "cut"}
        if item["transition"] != "cut":
            item["transitionSeconds"] = s.get("transitionSeconds", 0.5)
        raw["shots"].append(item)
    # The worker cuts at most cut.MAX_SHOTS shots: a longer film is cut in parts at hard cuts, then joined end to end.
    body = out / f"body-{raw['master']}.mp4"
    split = parts(len(shots), cut.MAX_SHOTS, [item["transition"] == "cut" for item in raw["shots"]])
    spans, offset, pieces = [], 0.0, []
    for k, (a, b) in enumerate(split):
        part = dict(raw, shots=[dict(item, clip=i - a, transition=item["transition"] if i > a else "cut")
                                for i, item in enumerate(raw["shots"][a:b], start=a)])
        edit = cut.parse_edit(part, b - a)
        piece = body if len(split) == 1 else out / f"body-{raw['master']}-part{k + 1}.mp4"
        if not piece.exists() and not body.exists():
            cut.cut([str(takes / s["take"]) for s in shots[a:b]], edit, str(piece), provenance={"film": treatment["title"], "edl": part})
        planned = cut.timeline(edit)
        # The spans on the file as cut (its measured length; the plan runs a few frames long per part).
        real = seconds_of(piece) if piece.exists() else planned[-1][1]
        scale = real / planned[-1][1]
        spans += [[round(x * scale + offset, 3), round(y * scale + offset, 3)] for x, y in planned]
        offset += real
        pieces.append(piece)
    if len(split) > 1 and not body.exists():
        listing = out / "parts.txt"
        listing.write_text("".join(f"file '{p.resolve()}'\n" for p in pieces))
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(body)])
    master = out / f"master-{raw['master']}.mp4"
    length = seconds_of(body)
    if endcard and not master.exists():
        w, h = (3840, 2160) if raw["master"] == "2160p" else (1920, 1080)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(body), "-i", str(endcard), "-filter_complex",
             f"[1:v]scale={w}:{h}:flags=lanczos,settb=AVTB,fps=24,format=yuv420p,setsar=1[e];[0:v]settb=AVTB,fps=24,format=yuv420p,setsar=1[b];"
             f"[b][e]xfade=transition=fade:duration=0.8:offset={length - 0.8:.3f}[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "slow",
             "-crf", "14", "-pix_fmt", "yuv420p", str(master)])
    elif not endcard:
        master = body
    total = seconds_of(master)
    all_spans = spans + ([[round(length - 0.8, 3), round(total, 3)]] if endcard else [])
    (out / "spans.json").write_text(json.dumps(spans))

    report = {"seconds": total, "spans": all_spans, "edit": raw, "mix": {}, "deliverables": [], "timeline": {}}
    languages = arg("languages", "en,fr").split(",")
    voice_report = voice_dir / "voice-report.json"
    for language in languages:
        # 2. The timeline on the cut's spans.
        command = ["npx", "ts-node", "--transpile-only", "src/index.ts", "cinema", "timeline", str((out / "treatment.part.json").resolve()),
                   "--language", language, "--spans", str((out / "spans.json").resolve())]
        if voice_report.exists():
            command += ["--voice", str(voice_report.resolve())]
        placed = json.loads(subprocess.run(command, cwd=cli, capture_output=True, text=True).stdout)
        report["timeline"][language] = placed
        # 3. Foley (the same for both languages; made once).
        stem = out / "foley.wav"
        if not stem.exists():
            cues = [dict(c, pan=[-0.3, 0.0, 0.3][k % 3]) for k, c in enumerate(placed["sound"])]
            soundfile.write(str(stem), foley.render(cues, total, seed=treatment["seedBase"] % 1000), foley.RATE, subtype="PCM_24")
            report["foley"] = foley.coverage([{"id": s["id"], "characters": s.get("characters", [])} for s in sub["shots"]],
                                             placed["sound"])
        # 4. The mix: the beat cues (the chosen take of each, edl.music, else the first made), the narrator, the foley.
        cues, prev_genre = [], None
        for m in placed["music"]:
            # The cue's take: by its id, or (a part of the film renumbers the cues) by its genre.
            genre = m["id"].split("-", 1)[-1]
            music = edl.get("music", {})
            chosen = music.get(m["id"]) or next((v for k, v in music.items() if k.split("-", 1)[-1] == genre), None)
            path = score_dir / chosen if chosen else sorted(score_dir.glob(f"*-{genre}-s*.wav"))[0]
            end = total if m is placed["music"][-1] else m["end"]
            # A genre switch (a new place) is cut on the picture: a short crossfade; inside a mood, a long one.
            switch = cues and m["id"].split("-", 1)[-1] != prev_genre
            cues.append(mixer.Cue(str(path), m["start"], end, m["intensity"], fade=0.4 if switch else 1.5))
            prev_genre = m["id"].split("-", 1)[-1]
        lines = [mixer.Line(str(voice_dir / f"{language}-{p['id']}.wav"), p["start"]) for p in placed["lines"]
                 if (voice_dir / f"{language}-{p['id']}.wav").exists()]
        mix = out / f"mix-{language}.m4a"
        report["mix"][language] = mixer.master(cues, lines, str(stem), total, str(mix))
        if "site" not in report["mix"]:
            report["mix"]["site"] = mixer.master(cues, [], str(stem), total, str(out / "mix-site.m4a"))
        withsound = out / f"master-{language}.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-i", str(mix), "-map", "0:v", "-map", "1:a", "-c", "copy", "-shortest",
             str(withsound)])
        # 5. The text: subtitles for the lines (on screen while said, never past their last shot), the main title.
        line_text = {line["id"]: line[language] for line in sub["lines"]}
        subs = [titles.Text(p["start"], min(p["end"] + 0.25, all_spans[sub["lines"][k]["shots"][-1] - 1][1] + 0.4), line_text[p["id"]])
                for k, p in enumerate(placed["lines"])]
        cuts = [s[0] for s in spans[1:]]
        subs = titles.on_cuts(subs, cuts)
        mains = []
        for t in treatment.get("titles", []):
            if t["shot"] in renumber:
                a, b = all_spans[renumber[t["shot"]] - 1]
                mains.append(titles.Text(round(a + 0.5, 3), round(b + (0.6 if endcard else -0.2), 3), t[language], "main",
                                         sub=t.get("sub", {}).get(language, "")))
        texts = subs + mains
        (out / f"captions-{language}.vtt").write_text(vtt([(t.text, t.start, t.end) for t in subs]))
        centres = [s.get("vx", 0.5) for s in shots] + ([0.5] if endcard else [])
        for kind in arg("kinds", "2160p,1080p,9:16").split(","):
            w, h = FRAMES[kind]
            ass = out / f"titles-{kind.replace(':', 'x')}-{language}.ass"
            # No burnt « AI-generated » label: the players draw the disclosure (orochia#349); the metadata carries it.
            ass.write_text(titles.script(titles.Frame(w, h), texts), encoding="utf-8")
            name = out / f"dawn-v2-{kind.replace(':', 'x')}-{language}.mp4"
            facts = deliver.deliver(str(withsound), str(name), kind, [tuple(x) for x in all_spans], centres, [], "", font="",
                                    provenance={"film": treatment["title"], "language": language, "version": 2},
                                    titles_ass=str(ass), fontsdir=fonts)
            report["deliverables"].append({**facts, "language": language, "file": name.name, "loudness": mixer.measure(str(name))})
            print(name.name, json.dumps(facts), flush=True)
    # The site's cut: no narrator, no drawn text (the page gives the captions); music and foley.
    site = out / "dawn-v2-16x9.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-i", str(out / "mix-site.m4a"), "-map", "0:v", "-map", "1:a",
         "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
         "-c:a", "copy", "-shortest", "-metadata", "comment=AI-generated — made with Orazaka", "-movflags", "+faststart", str(site)])
    report["site"] = {"mp4": site.name, "loudness": mixer.measure(str(site))}
    (out / "finish-report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
