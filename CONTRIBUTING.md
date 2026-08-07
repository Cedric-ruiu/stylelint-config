# Contributing

Thanks for taking the time. This is a small package — issues and PRs are both welcome.

## Getting started

```bash
yarn install
yarn test          # node:test suite
yarn test:watch
yarn lint          # stylelint on the fixtures + biome check
yarn format        # biome check --write
```

Node `^22.12` or `>= 24` is required. The repo ships a `.nvmrc`, so `nvm use` picks the
right one.

## Tooling

[Biome](https://biomejs.dev/) formats and lints the JavaScript, TypeScript and JSON;
Stylelint lints the CSS fixtures with the config this repo publishes. Two tools, no
overlap.

Two things to know about the Biome setup:

**`test/fixtures/` is excluded from Biome**, in `biome.json`. The fixtures are formatted
deliberately — some of them are invalid on purpose — and reformatting one silently
invalidates the assertions that point at its line numbers. If you touch `files.includes`,
re-run `yarn test` and check `git diff test/fixtures/` is empty after `yarn format`.

**Markdown and YAML are not formatted.** Biome doesn't support either yet (both are in
progress on their roadmap), so `.md` and `.yml` files are left to `.editorconfig`, which
covers indentation, line endings, trailing whitespace and the final newline. Wrap
Markdown by hand at a sensible width.

## Layout

```
src/
  create-config.js   factory — all the actual rule logic lives here
  index.js           "."            SCSS + markup + order as warnings
  error.js           "./error"      same, order as errors
  css.js             "./css"        plain CSS (no SCSS layer)
  css-error.js       "./css/error"  same, order as errors
test/
  fixtures/valid/    must lint clean
  fixtures/invalid/  one rule per file, so a failure names the rule
  helpers.js         assertion helpers
  *.test.js
```

The four entry points are thin wrappers around `createConfig({ scss, severity })`. Rule
changes belong in `src/create-config.js`.

## Testing rules

Two conventions matter here, both learned the hard way:

**Assert on the rule, not on the warning count.** An invalid fixture that trips four
rules will stay green when any one of them regresses. Use `assertRuleFires(fixture,
rule)` and give each invalid fixture a single job.

**Never pass `customSyntax` in a test.** Picking a parser for `.scss`, `.vue`, `.svelte`
and friends is the config's responsibility. A test that supplies the parser itself keeps
passing even when `stylelint-config-html` is dropped from `extends` — which is exactly
the kind of breakage that reaches users. `test/syntax.test.js` exists to catch it.

A useful sanity check when adding a guard test: break the config on purpose and confirm
your new test actually fails. If it doesn't, it isn't testing anything.

## Adding an at-rule

Tailwind and UnoCSS directives live in `AT_RULES` in `src/create-config.js`. If the
at-rule is blockless and belongs in a file header, add it to
`AT_RULES_WITHOUT_EMPTY_LINE` too, otherwise it will demand a blank line before it.

Add a case to `test/fixtures/valid/tailwind-v4.css` (or the relevant fixture) and to the
at-rule list in the README.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) are required — they drive
the changelog and the release pipeline. PR titles are linted too.

```
feat: add support for @variant
fix: allow @source in file headers
docs: document the /css preset
chore(deps): bump stylelint
```

Breaking changes need a `BREAKING CHANGE:` footer.

## Releasing

Work lands on `develop`. Merging `develop` into `main` triggers the release workflow,
which bumps the version, writes the changelog, tags, and publishes to npm with
provenance. Nothing to do by hand.
