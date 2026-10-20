# « Le monde de Krizaka : le relais » — v2 of the reference film (krizaka/orazaka#289)

v1 (`../`, « l'aube ») had the picture. Oussama's two reviews named the rest: titles not cinematic, a flat « GPS » narrator
over a score far too aggressive, no foley, no story, no emotion, no rhythm, subtitles too low, and birds presented in a
lineup instead of acting. v2 is made with the cinema pack's second version (ADR-080 addendum v2), which fixes those in the
pack, and follows his brief: a soft open, then a journey across places and cultures with a score that switches genre.

**The story** — at dawn the falcon seals a small glowing parcel and hands it to the pigeon. In a Moroccan medina the owl
argues before it reads the page and recognises the pigeon's face; on a Mile End café terrace the duck rebuilds the broken
strap; over the Alps a storm throws the pigeon toward the rocks and the falcon, who kept watch all along, catches the
parcel mid-air; in a Québec winter night the pigeon freezes, and a family (the beaver, the magpie, the lovebird) scoops
it in, argues about how to help, and sends it off; in California the flamingo pays its share from a bouncing lowrider,
the magpie and the flamingo dance off, the crane drops the beat, the parcel opens in the middle of the flock and the
phoenix rises over the ocean. Theme: *a promise travels further when it is passed from wing to wing.*

| File | What it is |
| --- | --- |
| `treatment.json` | The story as data: theme, arc, each bird's promise and intention, 25 shots with place, purpose, living action (gaze, physics) and what the birds do to each other (`interactionKind`), 8 directed lines, a music map of 9 cues by place and genre, a sound list per shot, the legal log (`references`, `legal.never`). Passes `orazaka cinema critique`. |
| `edl.json` | The edit: the take of each shot, its in-point, screen time, 9:16 centre, the chosen take of each cue. |
| `voice.py`, `voice_gate.py` | The narrator (Zonos v0.1, Apache-2.0, directed per line by the worker's `voice_direction`) and its gate: Whisper WER and pitch movement, takes picked among seeds. |
| `score.py` | One ACE-Step cue (MIT) per entry of the music map, from its genre prompt — original instrumentals, no artist or song named. |
| `alive.py` | « Alive » measured on a take (subject motion, activity, variety in the birds' box; v1: 2 of 9 bird takes pass). |
| `finish.py` | The worker's cut, then the timeline on the cut, the foley stem, the mix (−14 LUFS, ≤ −1 dBTP, short crossfades on genre switches), the film titles and subtitles (libass; no burnt AI label: the players draw it) and the deliverables per language. |
| `pod/setup.sh` | The GPU host (v1's, without LTX weights for the Wan pass). |
| `gate.json` | One check per step: story, takes (on-model, alive/on-topic), voice, music, foley, loudness, titles. |
| `v2.test.mjs` | The brand, story, interaction, rhythm, music and legal guardrails as tests. |

## The legal rule

No real person's likeness, name or voice; no existing song, lyric, game, show, character, logo or interface. The brief's
nods (West Coast G-funk, open-world-game energy, a rap rivalry's spirit, Québec franglais humour and a sitcom family) are
evoked by original instrumentals in the genres, generic objects and places, and the birds' own attitude — each logged in
`treatment.json` → `references`; the names never said are in `legal.never`, and the pack's rubric refuses them anywhere.

## Make it again

```sh
orazaka cinema critique v2/treatment.json                        # the rubric (and --judge for the LLM)
python3 voice.py treatment.json <voice> --worker <w> --kokoro-python <py> --speech-python <zonos py> [--seed 11 --suffix -s11]
orazaka cinema timeline treatment.json --voice <voice>/voice-report.json > timeline.json
<worker venv>/bin/python score.py <w> treatment.json timeline.json <score>
python3 ../keyframes.py treatment.json <renders> <kf> --stage plate|composite|integrate --only 2,3,…
orazaka cinema plan <prod> --treatment treatment.json --references <renders> && orazaka cinema jobs <prod> --out jobs.json
# GPU host (one pod, the spend guard running): ../pod/pod.sh create; WORKER_REF=<sha> bash pod/setup.sh; run_jobs.py jobs.json …
python3 alive.py treatment.json <takes> <take.mp4> …               # and the review sheets (orazaka cinema review)
python3 finish.py treatment.json edl.json <4K takes> <score> <voice> <endcard.mp4> <out> --worker <w> --cli <cli> --fonts <fonts>
```

Fonts: `@krizaka/fonts` (Plus Jakarta Sans, Inter — OFL) and Cormorant Garamond (OFL, google/fonts `ofl/cormorantgaramond`,
sha256 `b20b7d96…` regular, `0f48ea6a…` italic) in one folder.
