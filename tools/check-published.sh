#!/usr/bin/env bash
# Last step of release.yml: every non-private workspace package version on main must be on npm. The registry can lag a few
# seconds to minutes behind a publish, so each missing version is polled with a growing wait (default 300 s total) and only
# fails if it is still missing after that. Never skipped.
set -uo pipefail
budget=${PUBLISHED_WAIT_SECONDS:-300}
missing=0
for f in packages/*/package.json; do
  node -e 'const p=require("./"+process.argv[1]);process.exit(p.private?1:0)' "$f" || continue
  name=$(node -p "require('./$f').name"); ver=$(node -p "require('./$f').version")
  waited=0; delay=${PUBLISHED_FIRST_DELAY:-5}
  until [ "$(npm view "$name@$ver" version --registry https://registry.npmjs.org 2>/dev/null)" = "$ver" ]; do
    if [ "$waited" -ge "$budget" ]; then echo "::error::$name@$ver is on main but not on npm after ${waited}s"; missing=1; break; fi
    echo "$name@$ver not on npm yet, retrying in ${delay}s"; sleep "$delay"; waited=$((waited+delay)); delay=$((delay*2>60?60:delay*2))
  done
done
exit $missing
