<!--
The PR title must follow Conventional Commits — it is linted, and it ends up in the
changelog. e.g. "feat: allow @variant in file headers"
-->

## What and why

<!-- One or two sentences. Link the issue if there is one. -->

## Checklist

- [ ] `yarn test` passes
- [ ] `yarn lint` passes
- [ ] Rule changes are covered by a fixture in `test/fixtures/` and an assertion that
      names the rule
- [ ] If this adds an at-rule, it is in `AT_RULES` and in the README list
- [ ] README updated if the behaviour visible to users changed
