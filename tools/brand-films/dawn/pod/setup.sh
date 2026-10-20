#!/bin/bash
# The GPU host of « l'aube » (one RunPod pod, H200 141 GB): the Orazaka media worker's own code and pinned weights, nothing
# else. Run once over ssh after the pod starts; every step is skipped when already done (a stopped pod keeps /workspace).
#
#   WORKER_REF=<orazaka-worker-media commit> bash setup.sh
#
# /workspace/worker   orazaka-worker-media at WORKER_REF (its generator, its models.yaml, its fetch_models)
# /workspace/models   the Hugging Face cache (HF_HOME) and SeedVR2's weights
# /workspace/up       the SeedVR2 3B upscaler, pinned like the worker's bootstrap (infra/gpu/runpod-bootstrap.sh)
set -euo pipefail
WS=/workspace
WORKER_REF="${WORKER_REF:?the worker commit to run}"
SEEDVR2_REF=4490bd1f482e026674543386bb2a4d176da245b9
export HF_HOME=$WS/models/hf MEDIA_MODELS_DIR=$WS/models MEDIA_SCRATCH_DIR=$WS/scratch HF_HUB_ENABLE_HF_TRANSFER=1
mkdir -p $WS/models $WS/scratch $WS/jobs $WS/takes $WS/up

step() { printf '\n== %s (%s)\n' "$1" "$(date -u +%H:%M:%S)"; }

step "system packages"
command -v ffmpeg >/dev/null || { apt-get update -qq && apt-get install -y -qq ffmpeg >/dev/null; }

step "worker $WORKER_REF"
[ -d $WS/worker/.git ] || git clone -q https://github.com/krizaka/orazaka-worker-media $WS/worker
git -C $WS/worker fetch -q origin && git -C $WS/worker checkout -q "$WORKER_REF"

step "python dependencies (the worker's pins; torch stays the image's)"
grep -v -E '^(kokoro|cryptography)' $WS/worker/requirements-cuda.txt > /tmp/req.txt
pip install -q -r /tmp/req.txt hf_transfer

step "weights: Wan 2.2 I2V A14B (40 steps) and LTX-Video 0.9.8, pinned by the worker's models.yaml"
cd $WS/worker && python - <<'PY'
import os
from pathlib import Path
from app import fetch_models, video_models
manifest = video_models.load_manifest()
manifest["profiles"]["dawn"] = {"video": ["wan2.2-i2v-a14b-hq", "ltx-video-0.9.8-13b-distilled"], "defaultVideo": "wan2.2-i2v-a14b-hq"}
fetch_models.load_manifest = lambda *a, **k: manifest
video_models.load_manifest = lambda *a, **k: manifest
fetch_models.fetch("dawn", Path(os.environ["MEDIA_MODELS_DIR"]))
PY

step "SeedVR2 3B (Apache-2.0)"
[ -d $WS/up/seedvr2/.git ] || git clone -q https://github.com/numz/ComfyUI-SeedVR2_VideoUpscaler $WS/up/seedvr2
git -C $WS/up/seedvr2 checkout -q "$SEEDVR2_REF"
[ -x $WS/up/venv/bin/python ] || { python -m venv --system-site-packages $WS/up/venv && $WS/up/venv/bin/pip install -q -r $WS/up/seedvr2/requirements.txt; }
mkdir -p $WS/models/seedvr2
df -h $WS | tail -1
step "ready"
