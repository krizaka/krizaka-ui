# Brand films v3 — « Le monde de Krizaka : le courant » and « Orochia : le pas » (krizaka/orazaka#289, ADR-080 v3)

Oussama's brief after v2: no narrator (the voice spoiled the story), the birds and animals tell it by picture, action,
music and sound; dynamic, underground, tonic; fix the shadows, the birds' positioning and every anomaly.

## What v2 got wrong (the frame-by-frame audit) and where it is fixed

| Anomaly in « le relais » / « la première livraison » | Fix | Gate |
| --- | --- | --- |
| Flat cel birds pasted on photographic plates (hard outline, halo, the render's own colours in any light) | the composite is re-rendered in the plate's light at image strength 0.5/0.58 instead of 0.72–0.8 (`keyframes.py` integrate): volumetric birds, lit by the scene | `onModel` (vision model vs the render) keeps the design; a person's review |
| Birds floating beside the surface they should stand on (the duck next to the café table, the owl in front of the desk, the family in front of the kitchen table) | the treatment names each bird's surface; the vision model finds it in the plate and the feet go on it (`stage.feet_on`) | `grounded`, `floating` (calibrated, `calibration.json`); `sliding` on the takes |
| No contact shadow; black ellipses in the air under flying birds | the bird's own silhouette cast on the ground away from the stated key light, a contact occlusion, nothing under a flyer (`stage.cast_shadow`) | `grounded` (a shadow under the feet), `floatingShadow` on flying shots; `contactRatio` recorded |
| Shadows against the light | every hard-lit plate states its key (« from the left »), the shadow is cast from it | the pack refuses a plate that does not say it (`critiqueCut` `light`); a person's review |
| Wrong scale (a pigeon as tall as a flamingo's chest, an owl as big as a desk) | each bird's height is the treatment's ratio of a reference object found in the plate (`staging[].scale`); the camera comes to that scale by cropping the plate (≤ 3.2×, `stage.reframe`) instead of growing the bird | `scale`: the keyframe keeps the staged height |
| The render's props and baked grey shadow (the owl's check mark, the duck's code panel, the pigeon's parcel stand) | `stage.clean` | review sheets |
| Locked-off framings, postcards | a camera move per shot from a vocabulary, at most 15 % locked, 5 kinds at least, low angles and macro inserts; the edit adds the shake, punch-in, whip blur, snap zoom (`edit.camera_crop`) | `critiqueCut`; `static` measured on each take (phase correlation) |
| Motion that slides like a sticker | performances with weight and contact in the motion prompt, the take starts from an integrated keyframe | `sliding` (four frames in one strip) |
| Colour and light mismatch | the integration relights the bird; per-act grades in the edit | light measures recorded (`calibration.json`: they did not separate the sets, so they do not gate) |
| Continuity breaks (the parcel changes, a scarf appears, the owl's back becomes a blob) | one prop per film described identically in every prompt (`props`) | `continuity` across cuts sharing a prop; `onModel` on each take's last frame |
| The phoenix's white-out | no light burst over a third of the frame | `whiteout` measured |
| Lens-flare rainbows washing the frame | « no lens flare rainbows » in the style | review |

## The pipeline ($0 on the Mac, then one pod)

| Step | File |
| --- | --- |
| Treatment (story, staging, camera, cut, score form, sound list) | `<film>/treatment.json` — `orazaka cinema critique` and `orazaka cinema stage` pass |
| Score: one ACE-Step groove, arranged on the grid (intro filtered, build riser and roll, drops with impacts, the break's silence, outro) | `score.py`, `beats.py`, `arrange.py` |
| Keyframes: plate, placement, composite, integration | `keyframes.py`, `stage.py`, `vlm.py` |
| Gates on keyframes and takes | `integrity.py` (questions from `orazaka cinema stage --out`), `calibration.json`, `../dawn/childsafe.py` |
| GPU jobs and the pod | `jobs.py`, `../dawn/pod/queue.sh` (pushes every take and 4K to Bunny before the pod stops; a pusher every 2 min) |
| Edit, foley, mix, titles, end card, deliverables | `edit.py`, `endcard.py` (worker `foley`, `mixer`, `titles`) |
| Gate record | `<film>/gate.json` |

Tests: `v3.test.mjs` (python3 with numpy, scipy and Pillow) and `../dawn/pod/queue.test.mjs`.
