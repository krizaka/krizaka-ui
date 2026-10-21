#!/bin/bash
# Sends every file of a folder from the pod to Bunny Storage (krizaka-assets, pr-assets/…), so nothing made on a paid GPU
# is lost when the pod stops (ADR-080 v3). A file already sent (a marker in <dir>/.pushed/) is not sent again.
#
#   push.sh <dir> <prefix>       e.g. push.sh /workspace/takes pr-assets/orazaka/cinema-v3/krizaka/takes
#
# The storage zone and its key come from the environment (MEDIA_STORAGE_ZONE, MEDIA_STORAGE_API_KEY, optional
# MEDIA_STORAGE_ENDPOINT), written to the pod by the launcher through ssh stdin — never printed, never in a URL.
# Exits 1 when a file could not be sent (after trying every file). DRY_RUN=1 prints the uploads instead (queue.test.mjs).
set -uo pipefail
DIR=$1 PREFIX=${2%/}
ENDPOINT=${MEDIA_STORAGE_ENDPOINT:-storage.bunnycdn.com}
ZONE=${MEDIA_STORAGE_ZONE:?the storage zone}
: "${MEDIA_STORAGE_API_KEY:?the storage key}"
[ -d "$DIR" ] || { echo "push: no $DIR yet" >&2; exit 0; }
mkdir -p "$DIR/.pushed" 2>/dev/null || true
failed=0
for f in "$DIR"/*; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  case "$name" in *.part) continue ;; esac
  [ -e "$DIR/.pushed/$name" ] && [ "$DIR/.pushed/$name" -nt "$f" ] && continue
  url="https://$ENDPOINT/$ZONE/$PREFIX/$name"
  if [ -n "${DRY_RUN:-}" ]; then echo "PUT $url"; continue; fi
  code=$(curl -sS -o /dev/null -w '%{http_code}' -X PUT -H "AccessKey: $MEDIA_STORAGE_API_KEY" \
    -H 'Content-Type: application/octet-stream' --data-binary @"$f" "$url" || echo 000)
  if [ "$code" = "201" ] || [ "$code" = "200" ]; then
    touch "$DIR/.pushed/$name"
  else
    echo "push: $name answered $code" >&2
    failed=1
  fi
done
exit $failed
