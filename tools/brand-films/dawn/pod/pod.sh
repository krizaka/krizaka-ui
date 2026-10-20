#!/bin/bash
# The one RunPod pod of « l'aube »: create, ssh, copy, terminate. The orchestrator's spend guard (runpod-guard.py loop:
# 20 min idle or 6 h) watches it like any pod; this script never starts a guard of its own and never relaxes it.
#
#   pod.sh create            an H200 141 GB (else H100 NVL / H100), community cloud, 300 GB pod volume on /workspace
#   pod.sh ssh '<command>'   runs a command on it          pod.sh put <local> <remote>   pod.sh get <remote> <local>
#   pod.sh status            its id, GPU, $/h, uptime       pod.sh terminate              ends it (billing and volume)
#
# The API key is read with ~/.krizaka-worktrees/tools/secret.sh (never printed); the ssh key is gpu-dev's own.
set -euo pipefail
KEY_DIR="$HOME/.orazaka/gpu-dev"
STATE="${DAWN_POD_STATE:-$HOME/.orazaka/gpu-dev/dawn-pod.json}"
NAME="orazaka-gpu-cinema-dawn"
api() { local k; k=$("$HOME/.krizaka-worktrees/tools/secret.sh" @dev AI_GPU_RUNPOD_API_KEY); curl -sS -H "Authorization: Bearer $k" -H 'Content-Type: application/json' -H 'User-Agent: krizaka-cinema/1.0' "$@"; }
target() { python3 -c "import json;d=json.load(open('$STATE'));print(d['ip'],d['port'])"; }
SSH() { read -r ip port <<<"$(target)"; ssh -q -i "$KEY_DIR/id_ed25519" -p "$port" -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile="$KEY_DIR/known_hosts" -o ServerAliveInterval=30 "root@$ip" "$@"; }

case "${1:-}" in
  create)
    [ -f "$STATE" ] && { echo "a dawn pod is recorded in $STATE: pod.sh status / terminate"; exit 1; }
    running=$(api https://rest.runpod.io/v1/pods | python3 -c 'import json,sys; print(sum(1 for p in json.load(sys.stdin) or [] if p.get("desiredStatus")=="RUNNING"))')
    [ "$running" = "0" ] || { echo "a pod already runs: one pod at a time"; exit 1; }
    for cloud in COMMUNITY SECURE; do
      body=$(PUB="$(cat "$KEY_DIR/id_ed25519.pub")" CLOUD=$cloud NAME=$NAME python3 -c '
import json, os
print(json.dumps({"name": os.environ["NAME"], "imageName": "runpod/pytorch:2.8.0-py3.11-cuda12.8.1-cudnn-devel-ubuntu22.04",
  "cloudType": os.environ["CLOUD"], "computeType": "GPU", "gpuCount": 1,
  "gpuTypeIds": ["NVIDIA H200", "NVIDIA H100 NVL", "NVIDIA H100 80GB HBM3"], "gpuTypePriority": "custom",
  "containerDiskInGb": 60, "volumeInGb": 300, "volumeMountPath": "/workspace", "ports": ["22/tcp"], "supportPublicIp": True,
  "env": {"PUBLIC_KEY": os.environ["PUB"]}}))')
      out=$(api -X POST https://rest.runpod.io/v1/pods -d "$body" || true)
      id=$(printf '%s' "$out" | python3 -c 'import json,sys
try: print(json.load(sys.stdin).get("id",""))
except Exception: print("")')
      [ -n "$id" ] && { echo "{\"id\":\"$id\",\"cloud\":\"$cloud\"}" > "$STATE"; echo "pod $id ($cloud)"; break; }
      echo "$cloud: $(printf '%s' "$out" | head -c 200)"
    done
    [ -f "$STATE" ] || exit 1
    id=$(python3 -c "import json;print(json.load(open('$STATE'))['id'])")
    for _ in $(seq 1 60); do
      info=$(api "https://rest.runpod.io/v1/pods/$id")
      ip=$(printf '%s' "$info" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("publicIp") or "", (d.get("portMappings") or {}).get("22") or "", d.get("costPerHr"), (d.get("machine") or {}).get("gpuTypeId") or "")')
      read -r pip pport cost gpu <<<"$ip"
      if [ -n "$pip" ] && [ -n "$pport" ]; then
        python3 -c "import json;d=json.load(open('$STATE'));d.update(ip='$pip',port=$pport,cost=float('$cost'),gpu='$gpu',started='$(date -u +%Y-%m-%dT%H:%M:%SZ)');json.dump(d,open('$STATE','w'))"
        echo "ready: $gpu \$$cost/h ssh $pip:$pport"; exit 0
      fi
      sleep 10
    done
    echo "the pod has no public ssh after 10 min"; exit 1 ;;
  ssh) shift; SSH "$@" ;;
  # The image has no sftp server: files travel through ssh as tar streams.
  put) COPYFILE_DISABLE=1 tar --no-xattrs -C "$(dirname "$2")" -cf - "$(basename "$2")" | SSH "mkdir -p '$3' && tar --no-same-owner -C '$3' -xf -" ;;
  get) mkdir -p "$3"; SSH "tar -C '$(dirname "$2")' -cf - '$(basename "$2")'" | tar -C "$3" -xf - ;;
  status)
    id=$(python3 -c "import json;print(json.load(open('$STATE'))['id'])")
    api "https://rest.runpod.io/v1/pods/$id" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("id"), d.get("desiredStatus"), (d.get("machine") or {}).get("gpuTypeId"), d.get("costPerHr"), d.get("lastStartedAt"))' ;;
  terminate)
    id=$(python3 -c "import json;print(json.load(open('$STATE'))['id'])")
    api -X DELETE "https://rest.runpod.io/v1/pods/$id" >/dev/null && mv "$STATE" "$STATE.$(date +%s).done" && echo "terminated $id" ;;
  *) sed -n 2,10p "$0"; exit 2 ;;
esac
