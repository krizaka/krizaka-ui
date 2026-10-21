#!/bin/bash
# One film's GPU queue on one RunPod pod (ADR-080 v3): create or restart the pod, send the queue, the jobs and the
# keyframes, then run setup → LTX → Wan → 4K under queue.sh, which pushes every take and 4K to Bunny before it stops
# its own pod. The spend guard (launchd, 20 min idle / 6 h) watches it like any pod; this script starts no guard.
#
#   launch.sh <film> <jobs.json> <keyframes final dir>          film: krizaka | orochia
#
# Secrets are read with secret.sh into variables and written to the pod's /workspace/.env through ssh stdin: never
# printed, never in a command line or a URL. The balance is logged before the start (spend.log).
set -euo pipefail
FILM=$1 JOBS=$2 KF=$3
HERE=$(cd "$(dirname "$0")" && pwd)
POD="$HERE/../dawn/pod"
export DAWN_POD_STATE="${DAWN_POD_STATE:-$HOME/.orazaka/gpu-dev/v3-pod.json}"
export POD_GPUS="${POD_GPUS:-NVIDIA H100 NVL,NVIDIA H200,NVIDIA H100 80GB HBM3}"
LOG="${SPEND_LOG:-$HERE/../../../.cinema-v3-spend.log}"
S="$HOME/.krizaka-worktrees/tools/secret.sh"
WORKER_REF="${WORKER_REF:?the orazaka-worker-media commit}"

balance() {
  local k; k=$("$S" @dev AI_GPU_RUNPOD_API_KEY)
  curl -sS -H "Authorization: Bearer $k" -H 'Content-Type: application/json' https://api.runpod.io/graphql \
    -d '{"query":"query{myself{clientBalance}}"}' | python3 -c 'import json,sys;print(round(json.load(sys.stdin)["data"]["myself"]["clientBalance"],2))'
}
echo "$(date -u +%FT%TZ) $FILM start balance=$(balance)" | tee -a "$LOG"

if [ ! -f "$DAWN_POD_STATE" ]; then
  bash "$POD/pod.sh" create
else  # a pod stopped by its queue (or the guard) keeps /workspace: start it again
  k=$("$S" @dev AI_GPU_RUNPOD_API_KEY)
  id=$(python3 -c "import json;print(json.load(open('$DAWN_POD_STATE'))['id'])")
  curl -sS -X POST -H "Authorization: Bearer $k" "https://rest.runpod.io/v1/pods/$id/start" > /dev/null
  for _ in $(seq 1 60); do
    read -r ip port <<<"$(curl -sS -H "Authorization: Bearer $k" "https://rest.runpod.io/v1/pods/$id" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("publicIp") or "-", (d.get("portMappings") or {}).get("22") or "-")')"
    [ "$port" != "-" ] && break; sleep 10
  done
  python3 -c "import json;d=json.load(open('$DAWN_POD_STATE'));d.update(ip='$ip',port=int('$port'));json.dump(d,open('$DAWN_POD_STATE','w'))"
fi
for _ in $(seq 1 40); do bash "$POD/pod.sh" ssh true 2>/dev/null && break; sleep 5; done

for f in setup.sh run_jobs.py upscale.py queue.sh push.sh; do bash "$POD/pod.sh" put "$POD/$f" /workspace; done
bash "$POD/pod.sh" ssh "mkdir -p /workspace/$FILM"
bash "$POD/pod.sh" put "$KF" "/workspace/$FILM"           # → /workspace/<film>/final
bash "$POD/pod.sh" put "$JOBS" "/workspace/$FILM"         # → /workspace/<film>/jobs.json

# The pod's environment: the storage zone to push to, the Hugging Face token; never printed.
{
  printf 'export MEDIA_STORAGE_API_KEY=%q\n' "$("$S" @dev MEDIA_STORAGE_API_KEY)"
  printf 'export MEDIA_STORAGE_ZONE=%q\n' "$("$S" @dev MEDIA_STORAGE_ZONE)"
  printf 'export MEDIA_STORAGE_ENDPOINT=%q\n' "$("$S" @dev MEDIA_STORAGE_ENDPOINT)"
  printf 'export HF_TOKEN=%q\n' "$("$S" @dev AI_HUGGINGFACE_TOKEN)"
} | bash "$POD/pod.sh" ssh 'umask 077 && cat > /workspace/.env'

bash "$POD/pod.sh" ssh "cd /workspace && cat > go-$FILM.sh" <<EOF
set -a; . /workspace/.env; . <(tr '\0' '\n' < /proc/1/environ | grep -E '^RUNPOD_(POD_ID|API_KEY)='); set +a
export HF_HOME=/workspace/models/hf MEDIA_MODELS_DIR=/workspace/models MEDIA_SCRATCH_DIR=/workspace/scratch SEEDVR2_BATCH_SIZE=77
export PUSH_PREFIX=pr-assets/orazaka/cinema-v3/$FILM
export PRE="cd /workspace && WORKER_REF=$WORKER_REF bash setup.sh > setup-$FILM.log 2>&1 && pip install -q sageattention==1.0.6 && cp /workspace/run_jobs.py /workspace/upscale.py /workspace/worker/"
export WORKDIR=/workspace/worker
cd /workspace
exec bash /workspace/queue.sh /workspace/$FILM/jobs.json /workspace/$FILM/final /workspace/$FILM/takes /workspace/$FILM/up4k
EOF
bash "$POD/pod.sh" ssh "cd /workspace && (setsid nohup bash go-$FILM.sh > queue-$FILM.log 2>&1 < /dev/null &) ; echo launched \$(date -u +%T)"
