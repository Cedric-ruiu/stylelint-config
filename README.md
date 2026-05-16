# @cedric-ruiu/stylelint-config

[![npm](https://img.shields.io/npm/v/@cedric-ruiu/stylelint-config.svg)](https://npmjs.com/package/@cedric-ruiu/stylelint-config)
[![CI](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/Cedric-ruiu/stylelint-config/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@cedric-ruiu/stylelint-config.svg)](./LICENSE)

Shareable [Stylelint](https://stylelint.io/) config with sensible defaults — one-liner setup.

- Based on Stylelint v17
- Lint Sass (extends [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss))
- Lint HTML files (extends [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- Lint Vue files including `<style lang="scss">`
- Tailwind / UnoCSS at-rules allowed
- Logical property ordering (extends [stylelint-config-clean-order](https://github.com/kutsan/stylelint-config-clean-order))

> **Requirements:** Stylelint ≥ 17, Node ≥ 22

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

## Custom rules

On top of the extended configs, this package adds:

| Rule | Value | Why |
| --- | --- | --- |
| `selector-pseudo-class-no-unknown` | ignore `:deep`, `:global` | Vue scoped style selectors |
| `selector-pseudo-element-no-unknown` | ignore `::v-deep`, `::v-global`, `::v-slotted` | Legacy Vue 2 / Vue 3 early scoped selectors |
| `scss/at-rule-no-unknown` | ignore `@apply`, `@config`, `@layer`, `@responsive`, `@screen`, `@tailwind`, `@unocss`, `@variants` | Tailwind / UnoCSS at-rules |
| `scss/at-mixin-argumentless-call-parentheses` | `"always"` | Mixin calls always look like functions |

## Override / extend

```json
{
  "extends": "@cedric-ruiu/stylelint-config",
  "rules": {
    "scss/dollar-variable-pattern": null
  }
}
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

## Contributing

Conventional Commits are required — they drive the changelog and the release pipeline.

```bash
yarn install
yarn test     # runs stylelint against test/ fixtures
```
