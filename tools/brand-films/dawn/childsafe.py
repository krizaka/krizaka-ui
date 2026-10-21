#!/usr/bin/env python3
"""The child-safety check of a film (orazaka#289, ADR-080 v2.8): no children, no child-like figures, no dolls or toys,
ever. Each keyframe (before any GPU) and frames sampled across each take are shown to a local vision model that answers
the pack's one question (orazaka-cli cinema.childsafe.ts: the same words, the same strict reading — only a clear NO
clears a frame). A take or keyframe with one flagged frame is rejected; the film passes only once a person has
reviewed the sheets too (gate.json `childSafe.reviewedBy`).

The model is Qwen2.5-VL 7B (Apache-2.0) on MLX, measured on « Orochia : la première livraison »: it flags the doll
keyframe and clears the eight clean ones; LLaVA 1.6 and BakLLaVA missed it (gate.json `childSafe.calibration`).

    <venv with mlx-vlm>/bin/python childsafe.py <dir> <out.json> [file.mp4|file.png …]

Writes {model, question, frames: [{file, at, answer, flagged}], rejected: [files]}; exits 1 when one is rejected.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

QUESTION = ("Is there a doll or a human child anywhere in this image, even small or in the background? "
            "Answer YES or NO only.")
MODEL = "mlx-community/Qwen2.5-VL-7B-Instruct-4bit"
MIN_FRAMES = 6
EDGE = 0.05


def sample_times(seconds: float, count: int = MIN_FRAMES) -> list[float]:
    """When to grab frames: evenly from start to end, at least MIN_FRAMES (the pack's sampleTimes)."""
    n = max(MIN_FRAMES, count)
    span = max(0.0, seconds - 2 * EDGE)
    return [round(EDGE + span * i / (n - 1), 2) for i in range(n)]


def parse(answer: str) -> bool:
    """True when the frame is flagged: only a clear NO clears it (the pack's parseChildCheck)."""
    word = answer.strip().upper()
    return not (word.startswith("NO") and (len(word) == 2 or not word[2].isalpha()))


def seconds_of(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def grab(path: Path, at: float, out: Path) -> Path:
    """The frame at `at` s as a PNG (the last frame when `at` is past it)."""
    for seek in (["-ss", f"{at:.2f}"], ["-sseof", "-0.1"]):
        subprocess.run(["ffmpeg", "-v", "error", "-y", *seek, "-i", str(path), "-frames:v", "1", str(out)], check=True)
        if out.exists() and out.stat().st_size:
            return out
    raise SystemExit(f"no frame at {at} s in {path}")


def main() -> None:
    from mlx_vlm import generate, load  # noqa: PLC0415 — only where the model runs
    from mlx_vlm.prompt_utils import apply_chat_template  # noqa: PLC0415
    from mlx_vlm.utils import load_config  # noqa: PLC0415

    folder, out = Path(sys.argv[1]), Path(sys.argv[2])
    names = sys.argv[3:] or sorted(p.name for p in [*folder.glob("*.mp4"), *folder.glob("*.png")])
    model, processor = load(MODEL)
    prompt = apply_chat_template(processor, load_config(MODEL), QUESTION, num_images=1)
    frames = []
    with tempfile.TemporaryDirectory() as tmp:
        for name in names:
            path = folder / name
            stills = [(None, path)] if path.suffix == ".png" else [
                (at, grab(path, at, Path(tmp) / f"{path.stem}-{k}.png")) for k, at in enumerate(sample_times(seconds_of(path)))]
            for at, still in stills:
                result = generate(model, processor, prompt, [str(still)], max_tokens=5, temperature=0.0, verbose=False)
                answer = (getattr(result, "text", result) or "").strip()
                frames.append({"file": name, "at": at, "answer": answer[:40], "flagged": parse(answer)})
                print(name, at, "FLAGGED" if frames[-1]["flagged"] else "clear", flush=True)
    rejected = sorted({f["file"] for f in frames if f["flagged"]})
    out.write_text(json.dumps({"model": MODEL, "question": QUESTION, "frames": frames, "rejected": rejected}, ensure_ascii=False, indent=1))
    print("rejected:", rejected or "none")
    sys.exit(1 if rejected else 0)


if __name__ == "__main__":
    main()
