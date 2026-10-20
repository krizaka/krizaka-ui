#!/bin/bash
# Upscales every finished take to 4K beside the generation (the H200 holds both): one at a time, oldest first, until stopped.
cd /workspace/worker
while true; do
  for f in $(ls -tr /workspace/takes/*.mp4 2>/dev/null); do
    n=$(basename "$f")
    [ -f "/workspace/up4k/$n" ] && continue
    [ -f "/workspace/takes/${n%.mp4}.json" ] || continue  # a take is finished once its facts are written
    python upscale.py /workspace/takes /workspace/up4k "$n" >> /workspace/up.log 2>&1 || echo "FAILED $n" >> /workspace/up.log
  done
  sleep 30
done
