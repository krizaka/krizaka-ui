#!/bin/bash
# Fetches the finished takes (and their 4K) from the pod and makes each new take's review sheet (orazaka cinema review).
#   pull.sh <film dir> <production dir> <orazaka-cli checkout>
set -eu
FILM="$1"; PROD="$2"; CLI="$3"; P="$(dirname "$0")/pod.sh"
mkdir -p "$FILM/takes" "$FILM/up4k"
for j in $("$P" ssh "cd /workspace/takes && ls *.json 2>/dev/null"); do
  n="${j%.json}"
  if [ ! -f "$FILM/takes/$n.mp4" ]; then
    "$P" ssh "cat /workspace/takes/$n.mp4" > "$FILM/takes/$n.mp4.part" && mv "$FILM/takes/$n.mp4.part" "$FILM/takes/$n.mp4"
    "$P" ssh "cat /workspace/takes/$j" > "$FILM/takes/$j"
    shot=$((10#${n:0:2}))
    (cd "$CLI" && npx ts-node src/index.ts cinema review "$PROD" "$shot" "$FILM/takes/$n.mp4" >/dev/null 2>&1) && echo "new take $n: $PROD/review/$n.jpg"
  fi
  if [ ! -f "$FILM/up4k/$n.mp4" ] && "$P" ssh "test -f /workspace/up4k/$n.mp4.json"; then
    "$P" ssh "cat /workspace/up4k/$n.mp4" > "$FILM/up4k/$n.mp4.part" && mv "$FILM/up4k/$n.mp4.part" "$FILM/up4k/$n.mp4"
    "$P" ssh "cat /workspace/up4k/$n.mp4.json" > "$FILM/up4k/$n.mp4.json"
    echo "new 4K $n"
  fi
done
"$P" ssh "date -u +%T; tail -c 100 /workspace/wan.log | tr '\r' '\n' | tail -1; echo; tail -c 90 /workspace/up.log | tr '\r' '\n' | tail -1"
