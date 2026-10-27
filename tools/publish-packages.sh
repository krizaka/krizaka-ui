#!/usr/bin/env bash
# Publish step of release.yml. @krizaka/ui has an npm Trusted Publisher (GitHub Actions OIDC, no token); the other packages
# still publish with NPM_TOKEN. The two are kept apart so a token can never be what publishes @krizaka/ui:
#  1. @krizaka/ui, if its version is not on npm: packed by pnpm (workspace: ranges resolved), published by `npm publish`
#     with an EMPTY user config, so the only credential npm can use is the OIDC token of the job (id-token: write).
#  2. everything else (and the tags): `changeset publish` with NODE_AUTH_TOKEN; it skips what npm already has.
set -euo pipefail
ver=$(node -p "require('./packages/ui/package.json').version")
if [ "$(npm view "@krizaka/ui@$ver" version 2>/dev/null || true)" != "$ver" ]; then
  echo "Publishing @krizaka/ui@$ver with trusted publishing (OIDC, no token)"
  tmp=$(mktemp -d); echo "registry=https://registry.npmjs.org/" > "$tmp/npmrc"
  pnpm turbo run build --filter='@krizaka/ui...'   # its workspace dependencies (tokens/native…) first
  pnpm --filter @krizaka/ui pack --pack-destination "$tmp"
  env -u NODE_AUTH_TOKEN NPM_CONFIG_USERCONFIG="$tmp/npmrc" npm publish "$tmp"/krizaka-ui-*.tgz --access public --provenance --loglevel verbose
fi
pnpm changeset publish
pnpm changeset tag
