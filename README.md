# @cedric-ruiu/stylelint-config

[![npm](https://img.shields.io/npm/v/@cedric-ruiu/stylelint-config.svg)](https://npmjs.com/package/@cedric-ruiu/stylelint-config)
[![CI](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@cedric-ruiu/stylelint-config.svg)](./LICENSE)

Shareable [Stylelint](https://stylelint.io/) config with sensible defaults — one-liner setup.

- Built on Stylelint v18
- **CSS** and **Sass/SCSS** (extends [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss))
- **Styles embedded in markup** — `.html`, `.vue`, `.svelte`, `.astro`, `.php`, `.xml`, `.svg` and [70+ more extensions](https://github.com/ota-meshi/stylelint-config-html) (extends [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- **Tailwind CSS v4 and v3**, plus **UnoCSS** at-rules
- **Logical property ordering**, autofixable (extends [stylelint-config-clean-order](https://github.com/kutsan/stylelint-config-clean-order))
- **Works alongside Biome**: Biome formats, this package lints ([how they compare](#what-about-biome))

> **Requirements:** Stylelint 18, Node `^22.22.2`, `^24.15.0` or `≥ 26`

## Install

```bash
yarn add -D @cedric-ruiu/stylelint-config stylelint
```

## Setup

`.stylelintrc.json`:

```json
{
  "extends": "@cedric-ruiu/stylelint-config"
}
```

That's it — the config resolves the right parser per file type on its own. You never need
to pass `--custom-syntax`.

In your `package.json`:

```json
{
  "scripts": {
    "lint:css": "stylelint \"src/**/*.{css,scss,html,vue,svelte,astro}\"",
    "lint:css:fix": "stylelint \"src/**/*.{css,scss,html,vue,svelte,astro}\" --fix"
  }
}
```

Add a `.stylelintignore` for anything generated:

```
dist/
coverage/
*.min.css
```

## Presets

Four entry points, along two axes: whether you write Sass, and whether property order
should fail the build.

| Entry point                               | Sass layer | Property order | Use when                                            |
| ----------------------------------------- | ---------- | -------------- | --------------------------------------------------- |
| `@cedric-ruiu/stylelint-config`           | ✅         | `warning`      | Default. Sass, or a mixed codebase.                 |
| `@cedric-ruiu/stylelint-config/error`     | ✅         | `error`        | Same, but misordered properties fail CI.            |
| `@cedric-ruiu/stylelint-config/css`       | ❌         | `warning`      | Plain CSS only — a Tailwind v4 codebase, typically. |
| `@cedric-ruiu/stylelint-config/css/error` | ❌         | `error`        | Same, but misordered properties fail CI.            |

The `/css` presets skip `stylelint-config-standard-scss`, `stylelint-scss` and the SCSS
parser entirely. If you don't write a line of Sass, that's load you don't need.

### Property order is a warning by default

Worth knowing up front: **misordered properties do not fail your build** with the default
presets. `stylelint-config-clean-order` reports them at `warning` severity, and Stylelint
only exits non-zero on `error`.

That's usually what you want — ordering is entirely autofixable, so it should nudge, not
block. If you'd rather have it enforced:

```json
{
  "extends": "@cedric-ruiu/stylelint-config/error"
}
```

Or keep the warning and make CI strict about it:

```bash
stylelint "src/**/*.css" --max-warnings 0
```

One surprise to expect from `--fix`: once a rule has 5 or more declarations, blank lines
get inserted between property groups.

```css
/* before --fix */
.bar {
  font-size: 2px;
  position: absolute;
  width: 0;
  display: block;
  height: 2px;
}

/* after --fix */
.bar {
  position: absolute;

  display: block;

  width: 0;
  height: 2px;

  font-size: 2px;
}
```

## Tailwind CSS / UnoCSS

Tailwind v4, v3 and UnoCSS at-rules are recognized out of the box — no extra config, no
`stylelint-config-tailwindcss` needed:

`@apply` `@config` `@custom-variant` `@layer` `@plugin` `@reference` `@responsive`
`@screen` `@source` `@tailwind` `@theme` `@unocss` `@utility` `@variant` `@variants`

A typical Tailwind v4 entry file lints clean, header included:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@source "../ui";
@custom-variant midnight (&:where([data-theme="midnight"] *));

@theme {
  --font-display: "Satoshi", sans-serif;
}

@utility tab-4 {
  tab-size: 4;
}

.card {
  margin: --spacing(4);
  color: --alpha(var(--color-lime-300) / 50%);

  @variant dark {
    background: black;
  }
}
```

The v4 theme functions — `--alpha()`, `--spacing()` and the legacy `theme()` — are
accepted too, including `theme()` in media queries, where `var()` is not allowed:

```css
@media (width >= theme(--breakpoint-xl)) {
  /* … */
}
```

In declarations, write `var(--color-brand)` rather than `theme(--color-brand)`, as
Tailwind recommends. When the variable is declared in the same file, `theme(--x)` is
reported by `custom-property-no-missing-var-function`.

## Custom rules

On top of the extended configs, this package adds:

| Rule                                                          | Value                                                                                                                                          | Why                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `selector-pseudo-class-no-unknown`                            | ignore `:deep`, `:global`, `:slotted`                                                                                                          | Vue scoped style selectors                            |
| `selector-pseudo-element-no-unknown`                          | ignore `::v-deep`, `::v-global`, `::v-slotted`                                                                                                 | Legacy Vue / Vue 3 early scoped selectors             |
| `scss/at-rule-no-unknown`<br>(`at-rule-no-unknown` on `/css`) | ignore the Tailwind / UnoCSS at-rules listed above                                                                                             | Stripped by PostCSS at build time                     |
| `at-rule-empty-line-before`                                   | also ignore `@config`, `@custom-variant`, `@forward`, `@import`, `@plugin`, `@reference`, `@source`, `@tailwind`, `@theme`, `@use`, `@utility` | Tailwind v4 and Sass headers stack blockless at-rules |
| `scss/at-mixin-argumentless-call-parentheses`                 | `"always"`                                                                                                                                     | Mixin calls always look like functions                |
| `import-notation` _(`/css` only)_                             | `"string"`                                                                                                                                     | Tailwind v4 writes `@import "tailwindcss"`            |
| `declaration-property-value-no-unknown` _(`/css` only)_       | ignore `--*()` and `theme()`                                                                                                                   | Tailwind v4 theme functions                           |
| `at-rule-prelude-no-invalid` _(`/css` only)_                  | ignore the Tailwind / UnoCSS at-rules listed above                                                                                             | Stylelint reads `@apply` as the CSS Mixins draft      |
| `media-query-no-invalid` _(`/css` only)_                      | ignore `theme()`                                                                                                                               | Tailwind breakpoints in media queries                 |

## Override / extend

```json
{
  "extends": "@cedric-ruiu/stylelint-config",
  "rules": {
    "scss/dollar-variable-pattern": null
  }
}
```

Need a combination the four presets don't cover? Build one:

```js
// stylelint.config.js
import { createConfig } from "@cedric-ruiu/stylelint-config/create-config";

export default createConfig({ scss: false, severity: "error" });
```

## VSCode integration

Install the [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint), then `.vscode/settings.json`:

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit",
    "source.organizeImports": "never"
  },
  "css.validate": false,
  "scss.validate": false,
  "stylelint.enable": true,
  "stylelint.packageManager": "yarn",
  "stylelint.snippet": ["css", "postcss", "scss", "html", "vue"],
  "stylelint.validate": ["css", "postcss", "scss", "html", "vue"]
}
```

## Why this and not `stylelint-config-standard-scss` alone?

`stylelint-config-standard-scss` covers CSS and Sass. This package is the rest of what a
real project needs, wired together and tested as one unit: styles inside `.vue` /
`.svelte` / `.astro` / `.html`, Tailwind and UnoCSS at-rules, Vue's scoped-selector
syntax, and property ordering — with a plain-CSS variant for codebases that dropped Sass.

## What about Biome?

[Biome](https://biomejs.dev/) is excellent, and an order of magnitude faster than
Stylelint. Since 2.6.2 it also parses, formats and lints Sass/SCSS. **If you write plain
CSS or Sass in `.css` / `.scss` files, use Tailwind v4 or nothing, and already run
Biome, its CSS linter may be all you need.**

This package is for what Biome does not cover yet. Measured against Biome 2.6.8:

|                                          | Biome 2.6.8                                                                    | This package                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| CSS rules                                | 51, of which 17 in nursery (unstable)                                          | 110 enabled (74 core + 34 `scss/` + 2 `order/`) |
| Sass-specific rules                      | 2, both in nursery                                                             | 34 `scss/` rules                                |
| `<style>` in `.vue`, `.svelte`, `.astro` | Experimental, behind `html.experimentalFullSupportEnabled`                     | Stable, no flag                                 |
| `<style lang="scss">` in a `.vue` file   | Not linted, even with the flag                                                 | Linted                                          |
| `.php`, `.twig` and other templates      | Not supported                                                                  | ~77 extensions                                  |
| Tailwind v4                              | Behind `css.parser.tailwindDirectives`; `theme()` in a media query is reported | By default                                      |
| Tailwind v3 / UnoCSS at-rules            | Reported as unknown; `theme()` in a media query does not parse                 | By default                                      |
| Vue `:deep()` / `:slotted()` in `.scss`  | Does not parse outside `.vue` files                                            | Accepted                                        |
| Property ordering                        | `useSortedProperties`: fixed order, no options                                 | Configurable, warning or error                  |
| Formatting CSS / SCSS                    | Yes                                                                            | No, Stylelint does not format                   |
| Baseline browser support                 | Built in (`useBaseline`)                                                       | Not included, needs a third-party plugin        |
| Sorting Tailwind classes                 | `useTailwindSortedClasses`, in nursery                                         | No, out of scope for Stylelint                  |

### Use Biome alone if

- Your styles live in `.css` / `.scss` files, not in components
- You use Tailwind v4 or no framework, and no Vue scoped selectors in shared Sass
- The built-in property order suits you
- You want one fast toolchain for JS, TS, JSON and CSS

### Use this package if

- You write Sass and want more than a generic CSS linter running over it
- Your styles live in `.vue` (including `lang="scss"`), `.svelte`, `.astro`, `.php`,
  `.twig` or anything else in [that list](https://github.com/ota-meshi/stylelint-config-html)
- You use Tailwind v3, UnoCSS, or `theme()` in media queries
- You want to choose your property order, or keep it non-blocking

### Or use both

The two tools do different jobs and work well together: **Biome formats, this package
lints.** Turn off Biome's CSS linter and leave its property sorting off (the default),
since its order conflicts with this package's:

```json
{
  "css": {
    "linter": { "enabled": false },
    "parser": { "tailwindDirectives": true }
  }
}
```

Running `biome format`, then `stylelint --fix`, then `biome format` again leaves files
unchanged: the formatter keeps the blank lines this package puts between property
groups. Biome cannot format files it fails to parse, such as Tailwind v3 `theme()` in a
media query or Vue `:deep()` in a `.scss` file; Stylelint still lints them.

This repository runs Biome too: `yarn lint` runs `biome check` over the JavaScript,
JSON, Markdown and YAML, and `stylelint` over the CSS fixtures.

> **Checked against Biome 2.6.8 (November 2026).** Biome moves fast: SCSS landed in
> 2.6.2, and its Vue, Svelte and Astro support is still marked experimental. Re-check
> both projects before deciding.

## Migrating from 2.x

- **Stylelint 18 is now required** (it was `≥ 17`). Upgrade `stylelint` alongside this
  package. Its [migration guide](https://github.com/stylelint/stylelint/blob/main/docs/migration-guide/to-18.md)
  covers the CLI and API changes.
- **Node `^22.22.2`, `^24.15.0` or `≥ 26`** is now required, the floor stylelint 18 sets.
- **New problems may be reported.** The standard config now turns on
  `selector-no-deprecated`, plus `value-no-invalid`, `selector-no-invalid`,
  `selector-no-unmatchable` and `at-charset-rule-no-invalid` on the `/css` presets.
  `declaration-property-value-no-unknown` now resolves `var()` against custom properties
  declared in the file (`/css` presets).
- **`declaration-block-single-line-max-declarations` is gone**, removed from Stylelint
  itself. If you set it in your own config, remove it.

## Migrating from 1.x

- **The package is now ESM.** It exports `export default` instead of `module.exports`.
  Nothing changes if you use `.stylelintrc.json` — Stylelint resolves it either way. If
  you imported the config directly from a CommonJS file, switch to `import`.
- **Node `^22.12` or `≥ 24`** is now required (Node 22.0–22.11 no longer works — that
  floor comes from `stylelint-config-html@2` / `postcss-html@2`).
- **Tailwind v4 at-rules are now recognized.** If you previously silenced them yourself
  via `ignoreAtRules`, you can drop that override.
- **New `/css`, `/error` and `/css/error` entry points** — see [Presets](#presets). The
  default entry point behaves as before.

## Contributing

Conventional Commits are required — they drive the changelog and the release pipeline.

```bash
yarn install
yarn test          # node:test suite
yarn test:watch
yarn lint          # stylelint on fixtures + biome check
yarn format
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).
