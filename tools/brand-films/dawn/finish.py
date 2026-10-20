#!/usr/bin/env python3
"""The finish of « l'aube »: the Orazaka media worker's own cut (app/cut.py) and deliverables (app/deliver.py), the end card
from the code film, the mix, the captions. Runs on the Mac (ffmpeg with drawtext: Homebrew's ffmpeg-full).

    python3 finish.py <treatment.json> <edl.json> <takes 4K dir> <score.wav> <beats.json> <endcard.mp4> <voice dir> <out>
                      --worker <orazaka-worker-media checkout>

1. **Cut** — edl.json's shots (which take, its in-point, its speed or ramp, its push-in, its handover, its 9:16 centre),
   each cut snapped to the score's beat grid; graded (teal-orange LUT), 16 fps → 24 fps motion-compensated, the
   synthesized foley (wind bed, whooshes on the handovers, hits on the ramps): `cut.cut`, `master: 2160p`, `text: false`.
2. **End card** — the Krizaka mark from the code-rendered film (never generated), joined with a fade.
3. **Mix**, per language — the score (ACE-Step 1.5, MIT) under the narrator's lines (Kokoro-82M, Apache-2.0: the
   film's exact lines), ducked while the narrator speaks, the foley under both, -14 LUFS, a fade to the end.
4. **Deliverables**, per language — 4K and 1080p 16:9, 9:16 (each shot's centre), the captions and the « AI-generated »
   label drawn in the language after the reframe (`deliver.deliver`), and a WebVTT file.
"""
import json
import subprocess
import sys
from pathlib import Path


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


LABELS = {"en": "AI-generated", "fr": "Généré par IA"}


def run(command: list[str]) -> None:
    subprocess.run(command, check=True)


def seconds_of(path: Path) -> float:
    """The picture's length (the video stream's, not the container's: a foley track can run past the last frame)."""
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0",
                          str(path)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def snapped(durations: list[float], beats: list[float], overlaps: list[float]) -> list[float]:
    """Each shot's screen time, moved so its cut lands on the nearest beat (pure). The film's first frame is beat 0."""
    out, t, start = [], 0.0, beats[0] if beats else 0.0
    grid = [b - start for b in beats]
    for i, wanted in enumerate(durations):
        end = t + wanted
        if grid and i < len(durations) - 1:
            end = min(grid, key=lambda b: abs(b - end))
            if end - t < 1.2:  # never a shot shorter than a beat and a half
                end = t + wanted
        out.append(round(end - t + (overlaps[i + 1] if i + 1 < len(overlaps) else 0.0), 3))
        t = end
    return out


def build_edit(edl: dict, beats: list[float], language: str, cues: dict) -> dict:
    shots = edl["shots"]
    overlaps = [0.0] + [s.get("transitionSeconds", 0.0) if s.get("transition", "cut") != "cut" else 1 / 24 for s in shots[1:]]
    screens = snapped([s["screen"] for s in shots], beats, overlaps)
    out = []
    for i, (s, screen) in enumerate(zip(shots, screens)):
        speed = s.get("speed", 1.0)
        if s.get("rampAt") is not None:
            before = s["rampAt"] - s["in"]
            source_out = s["rampAt"] + max(0.2, (screen - before / speed)) * s.get("rampSpeed", 0.5)
        else:
            source_out = s["in"] + screen * speed
        item = {"clip": i, "in": s["in"], "out": round(min(source_out, s["clipSeconds"] - 0.02), 3), "speed": speed,
                "zoom": s.get("zoom", 1.0), "transition": s.get("transition", "cut")}
        if s.get("rampAt") is not None:
            item |= {"rampAt": s["rampAt"], "rampSpeed": s.get("rampSpeed", 0.5)}
        if item["transition"] != "cut":
            item["transitionSeconds"] = s.get("transitionSeconds", 0.4)
        out.append(item)
    return {"aspect": "16:9", "fps": 24, "master": "2160p", "text": False, "grade": edl.get("grade", "teal-orange"),
            "upscale": "none", "interpolate": True, "ambience": edl.get("ambience", "wind"), "sfx": True,
            "label": LABELS[language], "shots": out}


def texts_for(edl: dict, spans: list[tuple[float, float]], titles: list[dict], cues: dict, language: str) -> list[tuple]:
    """The captions (a cue spans its shots) and the titles, in the language: (text, start, end, style)."""
    shots = edl["shots"]
    texts = []
    for t in titles:
        # A title rides on its shot (treatment `shot`): it starts and ends with that shot's place in the cut.
        at = next((k for k, s in enumerate(shots) if s["take"].startswith(f"{t['shot']:02d}-")), None) if "shot" in t else None
        if "shot" in t and at is None:
            continue  # its shot is not in this cut
        start, end = (spans[at][0] + 0.4, spans[at][1] - 0.2) if at is not None else (t["start"], t["end"])
        texts.append((t[language], round(start, 3), round(end, 3), t.get("style", "hero")))
    i = 0
    while i < len(shots):
        cue = shots[i].get("caption")
        if not cue:
            i += 1
            continue
        j = i
        while j + 1 < len(shots) and shots[j + 1].get("caption") == cue:
            j += 1
        start = spans[i][0] + 0.35
        end = spans[j][1] - 0.1  # a caption never outlasts its shots (the narrator may finish over the cut)
        texts.append((cues[cue][language], round(start, 3), round(end, 3), "caption"))
        i = j + 1
    return texts


def vtt(texts: list[tuple]) -> str:
    def stamp(t: float) -> str:
        return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}"
    lines = ["WEBVTT", ""]
    for n, (text, start, end, _style) in enumerate(sorted(texts, key=lambda x: x[1]), start=1):
        lines += [str(n), f"{stamp(start)} --> {stamp(end)}", text, ""]
    return "\n".join(lines)


def mix(score: Path, foley_from: Path, voice: list[tuple[Path, float]], seconds: float, out: Path) -> None:
    """Score + foley + narrator: the score ducks under the voice (sidechain), -14 LUFS integrated, a 3 s fade out."""
    inputs = ["-i", str(score), "-i", str(foley_from)]
    for path, _ in voice:
        inputs += ["-i", str(path)]
    parts = [f"[0:a]atrim=0:{seconds:.3f},asetpts=PTS-STARTPTS,volume=0.9[music]",
             f"[1:a]aresample=48000,volume=0.55[fx]"]
    if voice:
        delays = []
        for k, (_, at) in enumerate(voice):
            ms = int(at * 1000)
            parts.append(f"[{k + 2}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms},volume=1.6[v{k}]")
            delays.append(f"[v{k}]")
        parts.append(f"{''.join(delays)}amix=inputs={len(voice)}:normalize=0,apad=whole_dur={seconds:.3f},asplit=2[voice][key]")
        parts.append("[music][key]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=450[ducked]")
        parts.append("[ducked][fx][voice]amix=inputs=3:normalize=0[sum]")
    else:
        parts.append("[music][fx]amix=inputs=2:normalize=0[sum]")
    parts.append(f"[sum]atrim=0:{seconds:.3f},afade=t=out:st={seconds - 3:.3f}:d=3,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]")
    first = out.with_name(out.stem + ".pass1.wav")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts), "-map", "[out]", str(first)])
    # loudnorm in one pass lands near, not on, its target: measure the mix, then set it to -14 LUFS exactly.
    report = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(first), "-af", "ebur128", "-f", "null", "-"],
                            capture_output=True, text=True).stderr
    measured = float(report.rsplit("Integrated loudness:", 1)[1].split("I:", 1)[1].split("LUFS", 1)[0])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(first), "-af", f"volume={-14.0 - measured:.2f}dB,alimiter=limit=0.89",
         "-c:a", "aac", "-b:a", "256k", str(out)])
    first.unlink()


def main() -> None:
    treatment = json.loads(Path(sys.argv[1]).read_text())
    edl = json.loads(Path(sys.argv[2]).read_text())
    takes, score, beats_file = Path(sys.argv[3]), Path(sys.argv[4]), Path(sys.argv[5])
    endcard, voices, out = Path(sys.argv[6]), Path(sys.argv[7]), Path(sys.argv[8])
    sys.path.insert(0, arg("worker"))
    from app import cut, deliver  # noqa: PLC0415

    out.mkdir(parents=True, exist_ok=True)
    beats = json.loads(beats_file.read_text())["beats"]
    for shot in edl["shots"]:
        if shot.get("reverse") and not (takes / shot["take"]).exists():
            # Played backwards (a sun that sets, reversed, rises): made once from the take, beside it.
            source = takes / shot["take"].replace("-reversed", "")
            run(["ffmpeg", "-v", "error", "-y", "-i", str(source), "-vf", "reverse", "-an", "-c:v", "libx264", "-crf", "12",
                 "-preset", "slow", "-pix_fmt", "yuv420p", str(takes / shot["take"])])
        shot["clipSeconds"] = seconds_of(takes / shot["take"])
    raw = build_edit(edl, beats, "en", treatment["cues"])
    edit = cut.parse_edit(raw, len(edl["shots"]))
    spans = cut.timeline(edit)
    body = out / "body-2160p.mp4"
    if not body.exists():
        facts = cut.cut([str(takes / s["take"]) for s in edl["shots"]], edit, str(body),
                        provenance={"film": treatment["title"], "edl": raw})
        print("cut", json.dumps(facts), flush=True)
    # The end card: the code film's last seconds (the Krizaka mark), 4K, joined with a fade; ungraded (it is the brand's own).
    master = out / "master-2160p.mp4"
    length = seconds_of(body)
    fade = 0.6
    if not master.exists():
        run(["ffmpeg", "-v", "error", "-y", "-i", str(body), "-i", str(endcard), "-filter_complex",
             f"[1:v]scale=3840:2160:flags=lanczos,settb=AVTB,fps=24,format=yuv420p,setsar=1[e];[0:v]settb=AVTB,fps=24,format=yuv420p,setsar=1[b];"
             f"[b][e]xfade=transition=fade:duration={fade}:offset={length - fade:.3f}[v]",
             "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-f", "mp4", str(master) + ".part"])
        Path(str(master) + ".part").rename(master)  # never a half-written master taken for a finished one
    total = seconds_of(master)
    end_span = (round(length - fade, 3), round(total, 3))
    all_spans = spans + [end_span]
    centres = [s.get("vx", 0.5) for s in edl["shots"]] + [0.5]
    foley = out / "foley.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(body), "-vn", "-af", f"apad=whole_dur={total:.3f}", "-ar", "48000", str(foley)])
    report = {"seconds": total, "spans": all_spans, "edit": raw, "deliverables": []}
    for language in ("en", "fr"):
        texts = texts_for(edl, spans, treatment.get("titles", []), treatment["cues"], language)
        (out / f"captions-{language}.vtt").write_text(vtt(texts))
        # The narrator's line k is voices/<language>-<k>.wav (voice.py writes them in the order of the texts).
        lines = [(voices / f"{language}-{k:02d}.wav", t[1] + 0.1) for k, t in enumerate(texts)]
        lines = [(p, at) for p, at in lines if p.exists()]
        audio = out / f"mix-{language}.m4a"
        mix(score, foley, lines, total, audio)
        withsound = out / f"master-{language}.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-i", str(audio), "-map", "0:v", "-map", "1:a", "-c", "copy",
             "-shortest", str(withsound)])
        for kind in ("2160p", "1080p", "9:16"):
            name = out / f"dawn-{kind.replace(':', 'x')}-{language}.mp4"
            facts = deliver.deliver(str(withsound), str(name), kind, all_spans, centres, texts, LABELS[language],
                                    font=arg("font") or cut.find_font(), provenance={"film": treatment["title"], "language": language})
            report["deliverables"].append({**facts, "language": language, "file": name.name})
            print(name.name, json.dumps(facts), flush=True)
    # The site's cut (krizaka.com « Watch the film », /story): no narrator and no drawn text — the page gives the captions in
    # its own language (WebVTT) and says the film is AI-generated; the file's metadata says so too. mp4, webm and a poster.
    site_audio = out / "mix-site.m4a"
    mix(score, foley, [], total, site_audio)
    site = out / "dawn-16x9.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-i", str(site_audio), "-map", "0:v", "-map", "1:a", "-vf",
         "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
         "-c:a", "copy", "-shortest", "-metadata", "comment=AI-generated — made with Orazaka", "-movflags", "+faststart", str(site)])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(site), "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1",
         "-deadline", "good", "-cpu-used", "2", "-c:a", "libopus", "-b:a", "128k", str(out / "dawn-16x9.webm")])
    poster_at = next(a + 0.3 for (a, _), s in zip(spans, edl["shots"]) if s["take"].startswith(edl.get("poster", "02-")))
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{poster_at:.2f}", "-i", str(master), "-frames:v", "1", "-vf",
         "scale=1920:1080:flags=lanczos", "-q:v", "3", str(out / "dawn-16x9.jpg")])
    report["site"] = {"mp4": site.name, "webm": "dawn-16x9.webm", "poster": "dawn-16x9.jpg", "posterAt": round(poster_at, 2)}
    (out / "finish-report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
