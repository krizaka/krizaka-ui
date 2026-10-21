#!/usr/bin/env python3
"""The local vision model of the v3 gates: Qwen2.5-VL 7B (Apache-2.0) on MLX, on the Mac ($0). It answers the pack's
yes/no questions (orazaka-cli cinema.staging.ts, read strictly) and finds objects in a plate (`locate`: a bounding box
in the plate's own pixels), which is how a bird is put on the surface it stands on instead of beside it.

Pure helpers (`parse_box`, `parse_yes_no`, `model_size`) are tested without the model (v3.test.mjs).
"""
import json
import re

MODEL = "mlx-community/Qwen2.5-VL-7B-Instruct-4bit"
#: The size the model sees (a multiple of its 28-pixel patches, 16:9): boxes come back in these pixels.
SEE = (1176, 672)


def model_size(width: int, height: int) -> tuple[int, int]:
    """The size an image is shown to the model at: SEE for a landscape frame, its transpose for a portrait one."""
    return SEE if width >= height else (SEE[1], SEE[0])


def parse_box(text: str, seen: tuple[int, int], size: tuple[int, int]) -> tuple[int, int, int, int] | None:
    """The first `bbox_2d` of the model's answer, mapped from the pixels it saw to the image's own; None without one."""
    match = re.search(r"\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]", text)
    if not match:
        return None
    x1, y1, x2, y2 = (float(v) for v in match.groups())
    sx, sy = size[0] / seen[0], size[1] / seen[1]
    box = (round(min(x1, x2) * sx), round(min(y1, y2) * sy), round(max(x1, x2) * sx), round(max(y1, y2) * sy))
    w, h = size
    box = (max(0, box[0]), max(0, box[1]), min(w, box[2]), min(h, box[3]))
    return box if box[2] > box[0] and box[3] > box[1] else None


def parse_yes_no(text: str, expected: str) -> bool:
    """True only when the answer starts with the expected word and nothing hedges it (the pack's parseYesNo)."""
    upper = text.strip().upper()
    word = re.match(r"^(YES|NO)\b", upper)
    if not word or word.group(1) != expected:
        return False
    return not re.search(r"\bBUT\b|\bHOWEVER\b|\bPARTLY\b", upper)


class Vision:
    """The model, loaded once."""

    def __init__(self):
        from mlx_vlm import generate, load  # noqa: PLC0415 — only where the model runs
        from mlx_vlm.prompt_utils import apply_chat_template  # noqa: PLC0415
        from mlx_vlm.utils import load_config  # noqa: PLC0415

        self._generate, self._template = generate, apply_chat_template
        self.model, self.processor = load(MODEL)
        self.config = load_config(MODEL)

    def ask(self, images: list, question: str, max_tokens: int = 8) -> str:
        """The model's answer about one or more images (PIL images or paths), each shown at its model size."""
        import tempfile  # noqa: PLC0415
        from pathlib import Path  # noqa: PLC0415

        from PIL import Image  # noqa: PLC0415

        with tempfile.TemporaryDirectory() as tmp:
            paths = []
            for k, img in enumerate(images):
                im = Image.open(img) if not hasattr(img, "size") else img
                im = im.convert("RGB")
                p = Path(tmp) / f"{k}.png"
                im.resize(model_size(*im.size)).save(p)
                paths.append(str(p))
            prompt = self._template(self.processor, self.config, question, num_images=len(paths))
            out = self._generate(self.model, self.processor, prompt, paths, max_tokens=max_tokens, temperature=0.0, verbose=False)
        return (getattr(out, "text", out) or "").strip()

    def locate(self, image, what: str) -> tuple[int, int, int, int] | None:
        """The bounding box of `what` in the image, in its own pixels."""
        from PIL import Image  # noqa: PLC0415

        im = Image.open(image) if not hasattr(image, "size") else image
        q = f'Locate {what} in this image. Output its bbox coordinates as JSON: [{{"bbox_2d": [x1, y1, x2, y2], "label": "..."}}]'
        text = self.ask([im], q, max_tokens=80)
        return parse_box(text, model_size(*im.size), im.size)

    def yes_no(self, images: list, question: str, expected: str) -> tuple[bool, str]:
        answer = self.ask(images, question)
        return parse_yes_no(answer, expected), answer[:60]


if __name__ == "__main__":
    import sys

    v = Vision()
    print(json.dumps({"box": v.locate(sys.argv[1], sys.argv[2])}))
