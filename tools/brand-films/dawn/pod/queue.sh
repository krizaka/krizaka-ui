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
#
# v3 (ADR-080 v3): every output leaves the pod BEFORE it stops. After each stage the takes and the 4K are pushed to
# Bunny Storage under $PUSH_PREFIX/{takes,up4k} (push.sh), and the trap pushes both once more before the stop — on a
# failure too, so what was paid for is kept. Without PUSH_PREFIX and the storage zone and key in the environment the
# queue refuses to start (NO_PUSH=1 runs without pushing, for a dry test only).
set -euo pipefail
JOBS=$1 KF=$2 TAKES=$3 UP=$4
HERE=$(cd "$(dirname "$0")" && pwd)
[ -n "${RUNPOD_POD_ID:-}" ] || { echo "queue: no RUNPOD_POD_ID, so the pod could not stop itself: refusing to start" >&2; exit 2; }
if [ -z "${NO_PUSH:-}" ]; then
  [ -n "${PUSH_PREFIX:-}" ] || { echo "queue: no PUSH_PREFIX, so the outputs would die with the pod: refusing to start" >&2; exit 2; }
  [ -n "${MEDIA_STORAGE_API_KEY:-}" ] && [ -n "${MEDIA_STORAGE_ZONE:-}" ] || { echo "queue: no storage zone or key to push to: refusing to start" >&2; exit 2; }
fi

step() {
  if [ -n "${DRY_RUN:-}" ]; then
    echo "$*"
    if [ -n "${DRY_RUN_FAIL:-}" ] && [[ "$*" == *"$DRY_RUN_FAIL"* ]]; then return 1; fi
    return 0
  fi
  "$@"
}

push() {
  [ -n "${NO_PUSH:-}" ] && return 0
  step bash "$HERE/push.sh" "$TAKES" "$PUSH_PREFIX/takes" || echo "queue: some takes were not pushed" >&2
  step bash "$HERE/push.sh" "$UP" "$PUSH_PREFIX/up4k" || echo "queue: some 4K were not pushed" >&2
}

stop_self() {
  local code=$?
  trap - EXIT ERR
  set +e
  [ -n "${PUSHER:-}" ] && kill "$PUSHER" 2>/dev/null
  push
  echo "queue: ended with code $code at $(date -u +%T), stopping pod $RUNPOD_POD_ID" >&2
  if [ -n "${DRY_RUN:-}" ]; then echo "STOP $RUNPOD_POD_ID"; exit "$code"; fi
  if command -v runpodctl > /dev/null; then
    runpodctl stop pod "$RUNPOD_POD_ID" || true
  fi
  curl -sS -X POST -H "Authorization: Bearer ${RUNPOD_API_KEY:-}" "https://rest.runpod.io/v1/pods/$RUNPOD_POD_ID/stop" > /dev/null || true
  exit "$code"
}
trap stop_self EXIT

# The pusher: every PUSH_EVERY seconds the new takes and 4K leave the pod, so a stop from outside (the spend guard at
# 6 h, a crash) loses at most the take in progress.
if [ -z "${NO_PUSH:-}" ]; then
  every=${PUSH_EVERY:-120}
  if [ -n "${DRY_RUN:-}" ]; then echo "PUSHER every $every s"; else
    ( while sleep "$every"; do bash "$HERE/push.sh" "$TAKES" "$PUSH_PREFIX/takes"; bash "$HERE/push.sh" "$UP" "$PUSH_PREFIX/up4k"; done ) > /dev/null 2>&1 &
    PUSHER=$!
  fi
fi

# PRE: what the pod needs first (setup.sh after a restart): under the same trap, so a failed setup stops the pod too.
if [ -n "${PRE:-}" ]; then step bash -c "$PRE"; fi
# WORKDIR: where the jobs run (the worker checkout PRE made), entered once it exists.
if [ -n "${WORKDIR:-}" ]; then step cd "$WORKDIR"; fi
step python run_jobs.py "$JOBS" "$KF" "$TAKES" --models ltx-video-0.9.8-13b-distilled
push
step python run_jobs.py "$JOBS" "$KF" "$TAKES" --models wan2.2-i2v-a14b-hq --sage
push
takes=$(cd "$TAKES" 2>/dev/null && ls ./*.mp4 2>/dev/null | xargs -n1 basename || true)
step env SEEDVR2_BATCH_SIZE="${SEEDVR2_BATCH_SIZE:-77}" python upscale.py "$TAKES" "$UP" ${takes:-"<every take>"}
