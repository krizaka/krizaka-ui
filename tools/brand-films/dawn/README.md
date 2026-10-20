# « Le monde de Krizaka : l'aube » / *The World of Krizaka: Dawn*

The brand film after « la tournée » (`../epic/`): night falls over the valley, one bird keeps watch, each of the others keeps
its promise, and the flock greets the dawn as the phoenix rises. Made with Orazaka's cinema pack (krizaka/orazaka#259): the
treatment is the data, `orazaka cinema` plans and tracks it, the Orazaka media worker makes every take and every
deliverable. AI-generated, and said so on the picture and in the files.

| File | What it is |
| --- | --- |
| `treatment.json` | The film as data: cast (each bird's reference is its `Mascot` render), the exact lines (`cues`), every shot (lens, camera, light, air, action, the model that makes it, where its birds stand). Read by `orazaka cinema plan`. |
| `edl.json` | The edit: which take, in-point, screen time, speed or ramp, handover, caption cue, 9:16 centre. |
| `canvas.py`, `keyframes.py` | On-model keyframes, on the Mac (FLUX.2 [klein] 4B, Apache-2.0): an empty plate, the bird's render composited and lit like the plate, then image-to-image at a high image strength (0.60 for one bird, 0.80 for a group) so the design stays the render's. |
| `pod/` | The GPU host (one RunPod pod, the spend guard watching): `setup.sh` (the worker's own code and pinned weights), `run_jobs.py` (the worker's `generate_wan_frames` over `orazaka cinema jobs`), `upscale.py` + `autoup.sh` (the worker's SeedVR2 to 2160p beside the generation), `pull.sh` (takes back, review sheets). |
| `score.py`, `voice.py` | The score (ACE-Step 1.5 XL turbo, MIT) and the narrator (Kokoro-82M, Apache-2.0: af_heart EN, ff_siwis FR), on the Mac. |
| `finish.py` | The worker's cut (4K master, LUT grade, 16→24 fps, ramps, synthesized foley) cut on the score's beats, the code film's end card, the mix (-14 LUFS, the score ducked under the narrator), then the deliverables per language: 2160p, 1080p, 9:16, WebVTT. |
| `dawn.test.mjs` | The brand guardrails as tests: the flock only, licensed models only (Wan at 40 steps for birds, LTX for landscapes), no real name, every line word for word. |

## Make it again

```sh
# keyframes (Mac): plates, composites, integration; a person accepts each against the render
python3 keyframes.py treatment.json <renders> <work> --stage plate|composite|integrate [--only 11 --strength 0.8]
# production (orazaka-cli)
orazaka cinema plan <prod> --treatment treatment.json --references <renders>   # --update after a change
orazaka cinema sheet <prod> && orazaka cinema jobs <prod> --out jobs.json
# GPU host
pod/pod.sh create && WORKER_REF=<sha> bash setup.sh && python run_jobs.py jobs.json kfinal takes --models wan2.2-i2v-a14b-hq --wait
# back home: review, record, reshoot one shot (its chained shots follow)
pod/pull.sh <work> <prod> <orazaka-cli>; orazaka cinema take <prod> 4 takes/04-….mp4; orazaka cinema reshoot <prod> 5
# sound and finish (Mac, ffmpeg with drawtext)
python score.py <worker> treatment.json <work>/score && python voice.py treatment.json edl.json <work>/voice
python3 finish.py treatment.json edl.json <4K takes> score.wav beats.json endcard.mp4 <voice> <out> --worker <worker>
```

The gate is frame by frame against the render (TREATMENT §5 of `../epic/`): a take that loses a design feature (the visor,
the white eyes, the glasses, the parcel) or grows a limb, a bird or a hand is rejected; a take good for only part of its
length is cut to that part.
