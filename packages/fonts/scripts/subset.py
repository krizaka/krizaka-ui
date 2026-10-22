#!/usr/bin/env python3
"""Cuts the Krizaka font files from their upstream sources — run by hand, never in CI.

The binaries it writes (files/web/*.woff2, files/native/*.ttf), src/faces.json (their metrics, sizes and hashes) and
licenses/*-OFL.txt are committed; scripts/build.mjs (Node, zero dependency) turns them into dist/. Change
src/families.json (an upstream commit, an axis, a subset, a native weight), then:

    uv run --with fonttools==4.66.1 --with brotli python packages/fonts/scripts/subset.py
    uv run --with fonttools==4.66.1 --with brotli python packages/fonts/scripts/subset.py --measure-fallbacks

For each family of src/families.json (legacy ones too: their files stay published):
  - downloads the variable font (or, for a static family, `upstream.fonts`: one file per weight) and its OFL from google/fonts at the pinned commit (cached in .cache/);
  - web: pins the axes that are not kept (Inter's opsz at 14), keeps the weight axis, and writes one WOFF2 per subset
    (latin, latin-ext), unhinted, every OpenType feature kept (kern, liga, tnum, cv01…);
  - native: one static TrueType per weight of `nativeWeights` (React Native takes no variable font), unhinted (iOS and
    Android ignore TrueType hints), latin + latin-ext,
    named `<NativeName>-<Style>` — the PostScript name expo-font and the iOS/Android build register;
  - measures what the fallback faces need (units per em, ascent, descent, line gap, the weighted average advance).
"""

import hashlib
import json
import os
import shutil
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache"
STYLE = {100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black"}

# Letter frequencies of English and French prose (with the space), for the average advance a fallback is matched on:
# the same idea as next/font and Capsize (a weighted xAvgCharWidth), on the languages Krizaka writes in.
FREQUENCIES = {
    " ": 0.1700, "e": 0.1080, "t": 0.0650, "a": 0.0700, "o": 0.0600, "i": 0.0640, "n": 0.0640, "s": 0.0650,
    "r": 0.0560, "h": 0.0350, "l": 0.0420, "d": 0.0360, "u": 0.0420, "c": 0.0300, "m": 0.0260, "p": 0.0230,
    "f": 0.0170, "g": 0.0160, "w": 0.0130, "y": 0.0130, "b": 0.0120, "v": 0.0110, "k": 0.0050, "x": 0.0030,
    "j": 0.0030, "q": 0.0070, "z": 0.0010, "é": 0.0150,
}


def fetch(url: str) -> bytes:
    CACHE.mkdir(exist_ok=True)
    cached = CACHE / hashlib.sha256(url.encode()).hexdigest()
    if not cached.exists():
        with urllib.request.urlopen(url) as response:  # noqa: S310 — pinned github raw URLs only
            cached.write_bytes(response.read())
    return cached.read_bytes()


def raw(family: dict, key: str, path: str | None = None) -> str:
    up = family["upstream"]
    path = (path or up[key]).replace("[", "%5B").replace("]", "%5D")
    return f"https://raw.githubusercontent.com/google/fonts/{up['commit']}/{path}"


def rename(static: TTFont, family: dict, weight: int, version: str) -> str:
    """Names a static instance `<NativeName>-<Style>`: the PostScript name expo-font and the iOS/Android build register."""
    postscript = f"{family['nativeName']}-{STYLE[weight]}"
    ribbi = weight in (400, 700)
    names = static["name"]
    for record in [r for r in names.names if r.nameID in (1, 2, 3, 4, 6, 16, 17, 25)]:
        names.removeNames(nameID=record.nameID)
    for name_id, value in {
        1: family["family"] if ribbi else f"{family['family']} {STYLE[weight]}",
        2: "Bold" if weight == 700 else "Regular",
        3: f"{version.split(';')[0].removeprefix('Version ')};KRIZAKA;{postscript}",
        4: f"{family['family']} {STYLE[weight]}",
        6: postscript,
        16: family["family"],
        17: STYLE[weight],
    }.items():
        names.setName(value, name_id, 3, 1, 0x409)
    static["OS/2"].usWeightClass = weight
    static["OS/2"].fsSelection = (static["OS/2"].fsSelection & ~0b1100001) | (0b100000 if weight == 700 else 0b1000000 if weight == 400 else 0)
    static["head"].macStyle = 1 if weight == 700 else 0
    return postscript


def derive_cahier(font: TTFont, family: dict) -> None:
    """Makes Krizaka Cahier out of Caveat (SIL OFL 1.1, no Reserved Font Name; renamed anyway as the licence asks for a
    modified version): the figures lining and of one width (tabular: folios and rule numbers align — checked, not
    assumed), the line metrics on a 1.25 em box (900 / −350 on 1000 units: 40 px at 32 px, the 8 px ruled grid), the
    names. The glyphs are Caveat's; the weight is the 500 of our ink (the instance is cut by the caller)."""
    cmap = font.getBestCmap()
    glyf, hmtx = font["glyf"], font["hmtx"]
    digits = [cmap[c] for c in range(0x30, 0x3A)]
    width = max(hmtx[g][0] for g in digits)
    for g in digits:  # tabular: one advance for the ten figures, each drawing centred in it
        advance, lsb = hmtx[g]
        shift = (width - advance) // 2
        glyph = glyf[g]
        assert glyph.numberOfContours > 0, f"{g} is a composite"
        glyph.coordinates.translate((shift, 0))
        glyph.recalcBounds(glyf)
        hmtx[g] = (width, lsb + shift)
    assert len({hmtx[g][0] for g in digits}) == 1
    assert 0xA7 in cmap and 0x153 in cmap and 0xE9 in cmap, "§, œ, é are required"
    upm = font["head"].unitsPerEm
    ascent, descent = round(upm * 0.9), -round(upm * 0.35)
    font["hhea"].ascent, font["hhea"].descent, font["hhea"].lineGap = ascent, descent, 0
    os2 = font["OS/2"]
    os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = ascent, descent, 0
    os2.usWinAscent, os2.usWinDescent = ascent, -descent
    os2.fsSelection |= 1 << 7  # USE_TYPO_METRICS
    names = font["name"]
    for record in [r for r in names.names if r.nameID in (0, 1, 2, 3, 4, 6, 16, 17, 25)]:
        if record.nameID != 0:
            names.removeNames(nameID=record.nameID)
    for name_id, value in {1: family["family"], 2: "Regular", 3: f"1.0;KRIZAKA;{family['nativeName']}-Regular", 4: family["family"], 6: f"{family['nativeName']}-Regular"}.items():
        names.setName(value, name_id, 3, 1, 0x409)


def avg_width(font: TTFont) -> float:
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    total = sum(FREQUENCIES.values())
    return round(sum(hmtx[cmap[ord(ch)]][0] * w for ch, w in FREQUENCIES.items()) / total, 2)


def metrics(font: TTFont) -> dict:
    os2, hhea = font["OS/2"], font["hhea"]
    return {
        "unitsPerEm": font["head"].unitsPerEm,
        "ascent": hhea.ascent,
        "descent": hhea.descent,
        "lineGap": hhea.lineGap,
        "capHeight": os2.sCapHeight,
        "xHeight": os2.sxHeight,
        "avgWidth": avg_width(font),
    }


def unicodes(ranges: str) -> list[int]:
    out: list[int] = []
    for part in ranges.split(","):
        part = part.strip().removeprefix("U+")
        lo, _, hi = part.partition("-")
        out.extend(range(int(lo, 16), int(hi or lo, 16) + 1))
    return out


def cut(font_bytes: bytes, codepoints: list[int], flavor: str | None, hinting: bool) -> bytes:
    font = TTFont(BytesIO(font_bytes))
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.hinting = hinting
    options.flavor = flavor
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    out = BytesIO()
    font.flavor = flavor
    font.save(out)
    return out.getvalue()


def to_bytes(font: TTFont) -> bytes:
    out = BytesIO()
    font.save(out)
    return out.getvalue()


def entry(path: Path, data: bytes) -> dict:
    path.write_bytes(data)
    return {"file": str(path.relative_to(ROOT)), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def main() -> None:
    source = json.loads((ROOT / "src" / "families.json").read_text())
    if "--measure-fallbacks" in sys.argv:
        for name, file in {"Arial": "Arial.ttf", "Courier New": "Courier New.ttf", "Georgia": "Georgia.ttf"}.items():
            font = TTFont(f"/System/Library/Fonts/Supplemental/{file}")
            print(name, font["head"].unitsPerEm, avg_width(font))
        return

    web_dir, native_dir, licenses = ROOT / "files" / "web", ROOT / "files" / "native", ROOT / "licenses"
    for folder in (web_dir, native_dir):
        shutil.rmtree(folder, ignore_errors=True)
        folder.mkdir(parents=True)
    licenses.mkdir(exist_ok=True)

    faces = {}
    everything = unicodes(source["subsets"]["latin"]) + unicodes(source["subsets"]["latin-ext"])
    # a family may keep a narrower set (`subsets` in src/families.json): the accent face, a few words per screen
    narrow = lambda family: [c for ranges in family.get("subsets", source["subsets"]).values() for c in unicodes(ranges)]
    for family in source["families"]:
        (licenses / f"{family['nativeName']}-OFL.txt").write_bytes(fetch(raw(family, "license")))
        if family.get("derive"):
            upstream_ofl = fetch(raw(family, "license")).decode().splitlines()[0]
            (licenses / f"{family['nativeName']}-FONTLOG.txt").write_text(
                f"FONTLOG for {family['family']}\n\n"
                f"{family['family']} is a modified version of {family['upstream']['derivedFrom']} ({family['upstream']['project']}),\n"
                f"{upstream_ofl}\n"
                "licensed under the SIL Open Font License 1.1 (see KrizakaCahier-OFL.txt, the upstream licence kept unchanged).\n\n"
                "Changes by Krizaka (https://www.krizaka.com), see scripts/subset.py (derive_cahier):\n"
                "  - renamed (the licence asks a modified version to carry another name): Krizaka Cahier;\n"
                "  - the weight instance 500 of the variable font, the other weights dropped;\n"
                "  - line metrics set on a 1.25 em box (the 8 px ruled grid); digits checked lining and tabular;\n"
                "  - subset to the French alphabet, WOFF2 for the web, TrueType for React Native.\n\n"
                f"Designers of {family['upstream']['derivedFrom']}: {family['designer'].split(';')[0]}.\n"
            )
        statics = family["upstream"].get("fonts")
        web, native = [], []
        if statics:
            # Static families (one file per weight upstream): one WOFF2 per weight and subset, the same files for native.
            files = {int(w): fetch(raw(family, "fonts", path)) for w, path in statics.items()}
            first = TTFont(BytesIO(files[min(files)]))
            version = first["name"].getDebugName(5)
            measured = first
            for weight, data in sorted(files.items()):
                for name, ranges in family.get("subsets", source["subsets"]).items():
                    cut_data = cut(data, unicodes(ranges), "woff2", hinting=False)
                    web.append({"subset": name, "weight": weight, "unicodeRange": ranges, **entry(web_dir / f"{family['slug']}-{name}-{weight}.woff2", cut_data)})
            for weight in family["nativeWeights"]:
                static = TTFont(BytesIO(files[weight]))
                postscript = rename(static, family, weight, version)
                data = cut(to_bytes(static), narrow(family), None, hinting=False)
                native.append({"weight": weight, "name": postscript, **entry(native_dir / f"{postscript}.ttf", data)})
        else:
            upstream = fetch(raw(family, "font"))
            variable = TTFont(BytesIO(upstream))
            version = variable["name"].getDebugName(5)

            # Web: the kept weight range, every other axis pinned.
            limits = {tag: (tuple(v) if isinstance(v, list) else v) for tag, v in family["axes"].items()}
            web_font = instancer.instantiateVariableFont(TTFont(BytesIO(upstream)), limits)
            if family.get("derive") == "cahier":
                derive_cahier(web_font, family)
            measured = web_font
            web_bytes = to_bytes(web_font)
            for name, ranges in family.get("subsets", source["subsets"]).items():
                data = cut(web_bytes, unicodes(ranges), "woff2", hinting=False)
                web.append({"subset": name, "unicodeRange": ranges, **entry(web_dir / f"{family['slug']}-{name}-wght.woff2", data)})

            # Native: one static instance per weight, latin + latin-ext in one file.
            for weight in family["nativeWeights"]:
                pinned = {tag: (weight if tag == "wght" else (v if not isinstance(v, list) else None)) for tag, v in family["axes"].items()}
                pinned = {k: v for k, v in pinned.items() if v is not None}
                static = instancer.instantiateVariableFont(TTFont(BytesIO(upstream)), pinned)
                if family.get("derive") == "cahier":
                    derive_cahier(static, family)
                postscript = rename(static, family, weight, version)
                data = cut(to_bytes(static), narrow(family), None, hinting=False)  # iOS and Android ignore TrueType hints
                native.append({"weight": weight, "name": postscript, **entry(native_dir / f"{postscript}.ttf", data)})

        faces[family["slug"]] = {"version": version, "metrics": metrics(measured), "web": web, "native": native}
        print(f"{family['family']} {version}: " + ", ".join(f"{w['subset']} {w['bytes'] / 1024:.1f} kB" for w in web) + f"; native {len(native)} files")

    out = {"$comment": "GENERATED by scripts/subset.py from src/families.json — do not edit.", "faces": faces}
    (ROOT / "src" / "faces.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    os.chdir(ROOT)
    main()
