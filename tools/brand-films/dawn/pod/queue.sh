#!/bin/bash
# The whole GPU queue of a film on its pod, then the pod stops itself: never an idle GPU billing.
#
#   queue.sh <jobs.json> <keyframes dir> <takes dir> <4K dir>     (on the pod, from /workspace/worker)
#
# 1. LTX-Video's jobs, then Wan 2.2's (run_jobs.py skips a take already made), 2. every take to 4K (upscale.py, one
# batch per take), 3. stop this pod through the RunPod API: on success, on a failure (trap ERR) and on any exit.
# RunPod gives every pod RUNPOD_POD_ID and a key scoped to it (RUNPOD_API_KEY); without a pod id the queue refuses to
# start, since it could not stop itself. DRY_RUN=1 prints the steps and the stop instead (tests: queue.test.mjs;
# DRY_RUN_FAIL=<text> fails the step that contains it).
set -euo pipefail
JOBS=$1 KF=$2 TAKES=$3 UP=$4
[ -n "${RUNPOD_POD_ID:-}" ] || { echo "queue: no RUNPOD_POD_ID, so the pod could not stop itself: refusing to start" >&2; exit 2; }

step() {
  if [ -n "${DRY_RUN:-}" ]; then
    echo "$*"
    if [ -n "${DRY_RUN_FAIL:-}" ] && [[ "$*" == *"$DRY_RUN_FAIL"* ]]; then return 1; fi
    return 0
  fi
  "$@"
}

stop_self() {
  local code=$?
  trap - EXIT ERR
  echo "queue: ended with code $code at $(date -u +%T), stopping pod $RUNPOD_POD_ID" >&2
  if [ -n "${DRY_RUN:-}" ]; then echo "STOP $RUNPOD_POD_ID"; exit "$code"; fi
  if command -v runpodctl > /dev/null; then
    runpodctl stop pod "$RUNPOD_POD_ID" || true
  fi
  curl -sS -X POST -H "Authorization: Bearer ${RUNPOD_API_KEY:-}" "https://rest.runpod.io/v1/pods/$RUNPOD_POD_ID/stop" > /dev/null || true
  exit "$code"
}
trap stop_self EXIT

# PRE: what the pod needs first (setup.sh after a restart): under the same trap, so a failed setup stops the pod too.
if [ -n "${PRE:-}" ]; then step bash -c "$PRE"; fi
step python run_jobs.py "$JOBS" "$KF" "$TAKES" --models ltx-video-0.9.8-13b-distilled
step python run_jobs.py "$JOBS" "$KF" "$TAKES" --models wan2.2-i2v-a14b-hq --sage
takes=$(cd "$TAKES" 2>/dev/null && ls ./*.mp4 2>/dev/null | xargs -n1 basename || true)
step env SEEDVR2_BATCH_SIZE="${SEEDVR2_BATCH_SIZE:-77}" python upscale.py "$TAKES" "$UP" ${takes:-"<every take>"}
