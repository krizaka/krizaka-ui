#!/bin/sh
# Upscales the chosen takes to 1080p with SeedVR2 3B (Apache-2.0) on the cinema pod — the upscaler the showcase session
# measured and the worker uses (orazaka-worker-media app/upscale.py: same checkout, weights and flags).
#
#   upscale.sh <pod.sh> <in dir of <shot>-<aspect>.mp4> <out dir>
#
# 16:9 → 1920x1080, 9:16 → 1080x1920 (the short side is 1080). Files already upscaled are skipped.
set -eu
POD="$1"; IN="$2"; OUT="$3"
mkdir -p "$OUT"
for f in "$IN"/*.mp4; do
  name=$(basename "$f")
  [ -f "$OUT/$name" ] && continue
  "$POD" "mkdir -p /tmp/up && cat > /tmp/up/in.mp4" < "$f"
  "$POD" 'cd /models/up/seedvr2 && /models/up/venv/bin/python inference_cli.py /tmp/up/in.mp4 --output /tmp/up/out.mp4 --resolution 1080 \
    --dit_model seedvr2_ema_3b_fp16.safetensors --model_dir /models/seedvr2 --batch_size 5 --attention_mode sdpa \
    --color_correction lab --output_format mp4 > /tmp/up/log.txt 2>&1 || { tail -5 /tmp/up/log.txt >&2; exit 1; }'
  "$POD" 'cat /tmp/up/out.mp4' > "$OUT/$name.part" && mv "$OUT/$name.part" "$OUT/$name"
  echo "upscaled $name $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$OUT/$name")"
done
