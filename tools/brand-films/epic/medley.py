#!/usr/bin/env python3
"""The epic's soundtrack: the ACE-Step cues of edl.json placed on the cut's timeline, plus synthesised hits.

    python3 medley.py <edl.json> <timeline.json> <cues dir> <out.wav> [--pick prologue=prologue.wav,club=club.wav,…]

Each cue starts on the first shot of its act (`from`, read in the timeline edit.py wrote) and plays until the next one
starts, with a 0.35 s crossfade. The hits are made here with ffmpeg sources (noise and sines): no sample library,
no foley model (the only one installed is non-commercial, ADR-080 §5). Loudness: -14 LUFS integrated, -1.5 dBTP.
"""
import json
import subprocess
import sys
from pathlib import Path

SR = 48000
XF = 0.35

# Hits: (shot id, seconds into the shot or "end", kind). Kinds are ffmpeg graphs of `d` seconds.
HITS = [
    ("01-code-ridge", "end", "whoosh"),
    ("02-ridge-dawn", "end", "whoosh"),
    ("05-club-audience", 0.0, "laugh"),
    ("04-club-scan", "end", "rimshot"),
    ("07-dinner-owl", 3.4, "stamp"),
    ("08-dinner-answer", 3.6, "coin"),
    ("08-dinner-answer", "end", "scratch"),
    ("09-studio-duck", "end", "whoosh"),
    ("13-beach-beaver", "end", "whoosh"),
    ("14-clay-leap", 0.4, "thud"),
    ("16-line-call", 0.6, "thud"),
    ("16-line-call", "end", "riser"),
]

SOUNDS = {
    "whoosh": ("anoisesrc=d=0.5:c=pink:a=0.5", "highpass=f=600,lowpass=f=6000,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.2,volume=0.6"),
    "rimshot": ("anoisesrc=d=0.25:c=white:a=0.8", "bandpass=f=2200:w=1200,afade=t=out:st=0.02:d=0.2,volume=1.2"),
    "laugh": ("anoisesrc=d=1.6:c=brown:a=0.25", "bandpass=f=900:w=800,tremolo=f=7:d=0.7,afade=t=in:d=0.2,afade=t=out:st=0.9:d=0.7,volume=0.5"),
    "stamp": ("sine=f=70:d=0.25", "afade=t=out:st=0.02:d=0.2,volume=1.6"),
    "coin": ("sine=f=2400:d=0.6", "afade=t=out:st=0.0:d=0.6,volume=0.5"),
    "scratch": ("anoisesrc=d=0.45:c=white:a=0.6", "bandpass=f=1500:w=1400,vibrato=f=9:d=1,afade=t=out:st=0.25:d=0.2,volume=0.6"),
    "thud": ("sine=f=55:d=0.4", "afade=t=out:st=0.02:d=0.38,volume=1.6"),
    "riser": ("anoisesrc=d=1.0:c=pink:a=0.4", "highpass=f=1200,afade=t=in:d=0.9,afade=t=out:st=0.9:d=0.1,volume=0.5"),
}


def run(args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def main():
    edl = json.loads(Path(sys.argv[1]).read_text())
    timeline = json.loads(Path(sys.argv[2]).read_text())
    cues, out = Path(sys.argv[3]), Path(sys.argv[4])
    picks = dict(p.split("=") for p in sys.argv[sys.argv.index("--pick") + 1].split(",")) if "--pick" in sys.argv else {}
    starts, total = timeline["starts"], timeline["total"]
    order = list(starts)
    ends = {sid: (starts[order[i + 1]] if i + 1 < len(order) else total) for i, sid in enumerate(order)}

    inputs, graph, labels = [], [], []
    music = edl["music"]
    for i, cue in enumerate(music):
        a = starts[cue["from"]]
        b = starts[music[i + 1]["from"]] if i + 1 < len(music) else total
        length = b - a + (XF if i + 1 < len(music) else 0)
        inputs += ["-i", str(cues / picks.get(cue["id"], f"{cue['id']}.wav"))]
        k = len(inputs) // 2 - 1
        fade_in = f"afade=t=in:d={XF if i else 0.6},"
        graph.append(f"[{k}:a]aresample={SR},aformat=channel_layouts=stereo,atrim=0:{length:.3f},asetpts=PTS-STARTPTS,{fade_in}"
                     f"afade=t=out:st={max(length - (XF if i + 1 < len(music) else 2.5), 0):.3f}:d={XF if i + 1 < len(music) else 2.5},"
                     f"adelay={int(a * 1000)}|{int(a * 1000)}[m{i}]")
        labels.append(f"[m{i}]")
    for j, (sid, at, kind) in enumerate(HITS):
        if sid not in starts:
            continue
        t = ends[sid] - 0.25 if at == "end" else starts[sid] + at
        src, chain = SOUNDS[kind]
        graph.append(f"{src},aresample={SR},aformat=channel_layouts=stereo,{chain},adelay={int(t * 1000)}|{int(t * 1000)}[h{j}]")
        labels.append(f"[h{j}]")
    graph.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{total:.3f},"
                 f"loudnorm=I=-14:TP=-1.5:LRA=11,aresample={SR}[out]")
    run([*inputs, "-filter_complex", ";".join(graph), "-map", "[out]", "-c:a", "pcm_s16le", str(out)])
    print(out, f"{total:.2f} s")


if __name__ == "__main__":
    main()
