#!/usr/bin/env python3
"""The narrator of « l'aube » v2: every line of the treatment, said as directed (emotion, pace, emphasis, the pause after)
by Zonos v0.1 (Zyphra, Apache-2.0) through the Orazaka media worker's own direction (`app/voice_direction.py`) and runner
(`app/zonos_runner.py`). The voice is a synthetic one: a Kokoro-82M voice (Apache-2.0; af_heart EN, ff_siwis FR) read
once as the reference — never a real person's. On the Mac: $0 of GPU.

    python3 voice.py <treatment.json> <out dir> --worker <orazaka-worker-media> --kokoro-python <py> --speech-python <py>
                     [--only storm,turn] [--languages en,fr] [--seed 7 --suffix -s7]

Writes <out>/<language>-<line id>.wav and <out>/voice-report.json ([{id, language, text, seconds}]), the report
`orazaka cinema timeline --voice` reads to check each line fits its shots.
"""
import json
import subprocess
import sys
from pathlib import Path

REFERENCE = {"en": ("a", "af_heart", "The river runs through the valley, and the morning light comes slowly over the mountains, warm and quiet."),
             "fr": ("f", "ff_siwis", "La rivière traverse la vallée, et la lumière du matin arrive doucement sur les montagnes, chaude et calme.")}
LANGUAGE = {"en": "en-us", "fr": "fr-fr"}


def arg(name, default=None):
    return sys.argv[sys.argv.index(f"--{name}") + 1] if f"--{name}" in sys.argv else default


def main() -> None:
    treatment = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    worker = Path(arg("worker"))
    sys.path.insert(0, str(worker))
    from app import voice_direction  # noqa: PLC0415

    only = set(arg("only").split(",")) if arg("only") else None
    report_file = out / "voice-report.json"
    report = json.loads(report_file.read_text()) if report_file.exists() else []
    for language in arg("languages", "en,fr").split(","):
        ref = out / f"reference-{language}.wav"
        if not ref.exists():
            code, voice, text = REFERENCE[language]
            subprocess.run([arg("kokoro-python"), "-c", (
                "import sys,numpy as np,soundfile;from kokoro import KPipeline;"
                f"p=KPipeline(lang_code='{code}',repo_id='hexgrad/Kokoro-82M');"
                f"soundfile.write(sys.argv[1],np.concatenate([np.asarray(a) for _,_,a in p({text!r},voice='{voice}',speed=0.95)]),24000)"),
                str(ref)], check=True)
        for line in treatment["lines"]:
            if only and line["id"] not in only:
                continue
            wav = out / f"{language}-{line['id']}{arg('suffix', '')}.wav"
            plan = [p.__dict__ for p in voice_direction.plan(line[language], line["direction"])]
            plan_file = out / f"{language}-{line['id']}.plan.json"
            plan_file.write_text(json.dumps(plan, ensure_ascii=False))
            subprocess.run([arg("speech-python"), "-m", "app.zonos_runner", "--plan", str(plan_file), "--voice", str(ref),
                            "--language", LANGUAGE[language], "--out", str(wav), "--seed", arg("seed", "7")], check=True, cwd=worker)
            seconds = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
                                           capture_output=True, text=True, check=True).stdout)
            if not arg("suffix"):  # a candidate take (--suffix) is not the line until voice_gate.py picks it
                report = [r for r in report if not (r["id"] == line["id"] and r["language"] == language)]
                report.append({"id": line["id"], "language": language, "text": line[language], "seconds": round(seconds, 3)})
                report_file.write_text(json.dumps(report, indent=1, ensure_ascii=False))
            print(language, line["id"], round(seconds, 2), flush=True)


if __name__ == "__main__":
    main()
