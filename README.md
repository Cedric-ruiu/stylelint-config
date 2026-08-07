# @cedric-ruiu/stylelint-config

[![npm](https://img.shields.io/npm/v/@cedric-ruiu/stylelint-config.svg)](https://npmjs.com/package/@cedric-ruiu/stylelint-config)
[![CI](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@cedric-ruiu/stylelint-config.svg)](./LICENSE)

Shareable [Stylelint](https://stylelint.io/) config with sensible defaults — one-liner setup.

- Built on Stylelint v17
- **CSS** and **Sass/SCSS** (extends [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss))
- **Styles embedded in markup** — `.html`, `.vue`, `.svelte`, `.astro`, `.php`, `.xml`, `.svg` and [70+ more extensions](https://github.com/ota-meshi/stylelint-config-html) (extends [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- **Tailwind CSS v4 and v3**, plus **UnoCSS** at-rules
- **Logical property ordering**, autofixable (extends [stylelint-config-clean-order](https://github.com/kutsan/stylelint-config-clean-order))

> **Requirements:** Stylelint ≥ 17, Node `^22.12` or `≥ 24`

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
accepted too.

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

[Biome](https://biomejs.dev/) is very good, and it is faster than Stylelint by an order of
magnitude — not by a little. It lints and formats CSS, JavaScript, TypeScript and JSON
from a single Rust binary with no plugin tree to assemble. **If your project is plain CSS
and you already run Biome, use Biome.** You do not need this package.

The honest differences, as of Biome 2.5.7:

| | Biome 2.5.7 | This package |
| --- | --- | --- |
| Lint Sass/SCSS | Not supported — parsing and formatting are [in progress](https://biomejs.dev/internals/language-support/), linting is not started | 34 `scss/` rules |
| CSS rules available | 35 | 110 enabled (74 core + 34 `scss/` + 2 `order/`) |
| Property ordering | `useSortedProperties`, fixed built-in order, not configurable | Configurable via `stylelint-order`, and you pick the severity |
| Styles in markup | HTML, Vue, Svelte, Astro — behind `html.experimentalFullSupportEnabled` | ~77 extensions, stable, no flag |
| Tailwind v4 at-rules | Yes, via `css.parser.tailwindDirectives` | Yes, by default |
| Baseline browser support | Built in (`useBaseline`) | Not included — needs a third-party plugin |
| Sorting Tailwind classes | Yes (`useSortedClasses`) | No — out of scope for Stylelint |

### Use Biome if

- You write plain CSS, no Sass
- You want one toolchain for JS, TS, JSON and CSS
- Lint speed is a bottleneck for you
- You want Baseline checks or Tailwind class sorting without adding plugins

### Use this if

- You write Sass — this is the deciding factor, and it is the one Biome cannot do yet
- Your styles live in `.vue`, `.svelte`, `.astro`, `.php`, `.twig` or anything else in
  [that list](https://github.com/ota-meshi/stylelint-config-html), and you would rather not
  depend on an experimental flag
- You want to choose your own property order, or make ordering non-blocking
- You want the depth of Stylelint's rule set and its plugin ecosystem

### Or use both

They are not competing for the same job. Biome for JavaScript, TypeScript and JSON;
Stylelint for stylesheets. **That is exactly what this repository does** — `yarn lint`
runs `biome check` over the JavaScript and JSON, and `stylelint` over the CSS fixtures.
Nothing stops you from doing the same.

> **Checked against Biome 2.5.7 (August 2026).** This comparison has a shelf life: SCSS
> support is an explicit goal on [Biome's 2026 roadmap](https://biomejs.dev/blog/roadmap-2026/)
> and was their most requested feature. Re-check both projects before deciding.

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
yarn lint          # stylelint on fixtures + prettier
yarn format
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).
