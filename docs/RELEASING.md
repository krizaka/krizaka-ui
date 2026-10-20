# Releasing Krizaka UI

One session publishes at a time. The method is the **frozen branch**: the version commit is reviewed and merged like any
other change, and the packages are published from that exact merge commit, never from a moving `main`.

Packages are versioned together by [Changesets](https://github.com/changesets/changesets) (`@krizaka/ui`, `tokens`,
`tailwind` share a version; `icons`, `charts`, `email`… move on their own).

## 0. Before you start

- `gh pr list -R krizaka/krizaka-ui`: no other `chore: release …` PR is open. Ignore the bot's `changeset-release/main`
  PR (do not merge it, do not fight it).
- Every PR meant for the release is **merged** and `main` CI is green. While a release PR is open, turn auto-merge
  **off** on the PRs that are not part of it (they would land between the version commit and the publish).
- Each merged PR carries a changeset (`.changeset/*.md`).

## 1. Get the PRs green

CI runs one `Type-check, test, build` at a time, about 20 minutes each: seven open PRs are hours. Keep few PRs open,
never enable auto-merge on `changeset-release/main` (#321) or on other sessions' PRs, and re-run a failed job
(`gh run rerun <id> --failed`, once the whole run has finished) before debugging a flake. Branch protection is not strict:
a PR need not be up to date to merge.

Typical reasons a PR is stuck, and the fix:

| Symptom | Fix |
| :-- | :-- |
| Storybook `% different from snapshot` / missing baseline | Regenerate the **Linux** baselines (below) and push them to the PR branch |
| `Package size limit has exceeded` | Check the cause; if legitimate, raise the entry in `packages/ui/package.json` `size-limit` |
| `add a JSDoc comment on these props` (registry test) | Document the props |
| axe `label-content-name-mismatch` | The visible text must be part of the accessible name (or be drawn by CSS) |
| Flaky timing test | Wait on the condition, never on a short timer |
| Conflicts | Rebase or merge `main`; for `meta.ts` / `AGENTS.md` keep both sides |

### Linux baselines (heavy)

Docker Desktop must be running (`open -a Docker`). A native example needs a story named `Native/<ComponentName>` and its
two baselines (`native-<name>--<example>--{dark,light}.png`); a test of `scripts/registry.test.mjs` checks both.

Screenshots are compared on Linux. Use the heavy lock, build the packages on the host, then run the container with
`--no-build` (building inside the container is killed for lack of memory):

```bash
~/.krizaka-worktrees/tools/heavy-lock.sh acquire <session> 90
pnpm turbo run build --filter='@krizaka/storybook^...'
pnpm --filter storybook test:update:linux --no-build [story-file-prefix …]   # e.g. navigation-railnav primitives-navbar
~/.krizaka-worktrees/tools/heavy-lock.sh release <session>
```

Only the story files you name are rewritten (the prefix is the lower-cased title with `/` as `-`). Commit the
changed or new `apps/storybook/__screenshots__/linux/*.png` to the PR branch. Several PRs can share one run: merge them
in a scratch worktree, run once, then copy each PR's PNGs to its own branch. A run that stops on a story error
(`smoke-test` axe violation, `play-test`) still writes some PNGs: fix the story first and re-run.

## 2. Cut the release branch

```bash
git fetch origin && git checkout -B release/X.Y.Z origin/main
GITHUB_TOKEN=$(gh auth token) pnpm changeset version      # needs a token to read PR links
git add -A && git commit -m "chore: release X.Y.Z"
git push -u origin release/X.Y.Z
gh pr create --title "chore: release X.Y.Z (snapshot)" --body "…what is in, what is not…"
gh pr merge release/X.Y.Z --squash --auto                 # no --delete-branch
```

Check the versions: `@krizaka/ui`, `tokens` and `tailwind` at X.Y.Z; other packages bumped by their own changesets.

## 3. Publish from the merge commit

When the release PR is merged (take the heavy lock for the build):

```bash
git fetch origin --tags && git checkout --detach origin/main   # HEAD is the "chore: release X.Y.Z (#N)" commit
pnpm install --frozen-lockfile && pnpm turbo run build
pnpm changeset publish && git push origin --tags
```

The CI publish job fails (trusted publishing is not configured): this local publish is the way. Then verify, with a
bounded wait (npm can take a few minutes to show a version):

```bash
for i in $(seq 1 50); do npm view @krizaka/ui@X.Y.Z version --prefer-online 2>/dev/null | grep -q . && break; sleep 10; done
npm view @krizaka/ui versions --json | tail -3    # the `version` dist-tag can lag a minute behind
```

## 4. After the release

- Bump the consumers: one small auto-merge PR per repo (`chore(deps): @krizaka/ui, tokens, tailwind X.Y.Z`); list the
  laggards with `node scripts/check-ui-drift.mjs` in `krizaka/.github`.
- Brand marks changed? Re-run `node tools/export-brand.mjs --out <dir> --upload` (credentials from the environment,
  never printed), then purge the pull zone for `brand/*`.
- Append the release and what now waits on it to `company/orchestration/orchestration.md`.

## Rules

- Never merge on red or pending; auto-merge only. Never print secrets.
- A test is fixed, never skipped or weakened. A budget is raised only with a reason in the commit.
- If a PR joins late, it goes in the next release (3.X+1): do not reopen a frozen branch.
