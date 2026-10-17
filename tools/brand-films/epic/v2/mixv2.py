#!/usr/bin/env python3
"""The v2 soundtrack: the birds' lines where they speak them, the sung chorus over the finale, and the score ducked
under both (sidechain), then -14 LUFS.

    python3 mixv2.py <edl-v2.json> <timeline.json> <bed.wav> <voices dir> <chorus.wav> <out.wav> --lang en|fr

A shot with `voice` plays <voices dir>/<voice>-<lang>.wav from its start (the talking shots are cut at speed 1 from
their first frame, so the beak and the word meet). A shot with `chorus` plays the chorus from `chorus.<lang>` seconds
(its sung line) for `chorus.seconds`.
"""
import json
import subprocess
import sys
from pathlib import Path


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def main():
    edl = json.loads(Path(sys.argv[1]).read_text())
    timeline = json.loads(Path(sys.argv[2]).read_text())
    bed, voices, chorus, out = sys.argv[3], Path(sys.argv[4]), sys.argv[5], sys.argv[6]
    lang = arg("lang", "en")
    starts, total = timeline["starts"], timeline["total"]
    inputs, graph, fg = ["-i", bed], [], []
    for s in edl["shots"]:
        at = starts.get(s["id"])
        if at is None:
            continue
        if s.get("voice"):
            inputs += ["-i", str(voices / f"{s['voice']}-{lang}.wav")]
            k = len(inputs) // 2 - 1
            graph.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.6,adelay={int(at * 1000)}|{int(at * 1000)}[v{k}]")
            fg.append(f"[v{k}]")
        if s.get("chorus"):
            c = s["chorus"]
            inputs += ["-i", chorus]
            k = len(inputs) // 2 - 1
            a = c[lang]
            graph.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim={a}:{a + c['seconds']},asetpts=PTS-STARTPTS,"
                         f"afade=t=in:d=0.15,afade=t=out:st={c['seconds'] - 0.6}:d=0.6,adelay={int(at * 1000)}|{int(at * 1000)}[c{k}]")
            fg.append(f"[c{k}]")
    graph.append(f"{''.join(fg)}amix=inputs={len(fg)}:normalize=0:duration=longest,apad=whole_dur={total:.3f}[front]")
    graph.append("[front]asplit=2[f1][key]")
    graph.append("[0:a]aresample=48000,aformat=channel_layouts=stereo[b]")
    graph.append("[b][key]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400:makeup=1[duck]")
    graph.append(f"[duck][f1]amix=inputs=2:normalize=0:duration=first,atrim=0:{total:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(graph),
                    "-map", "[out]", "-c:a", "pcm_s16le", out], check=True)
    print(out, f"{total:.2f} s")


if __name__ == "__main__":
    main()
