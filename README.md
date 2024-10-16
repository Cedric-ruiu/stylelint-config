# @cedric-ruiu/stylelint-config [![npm](https://img.shields.io/npm/v/@cedric-ruiu/stylelint-config.svg)](https://npmjs.com/package/@cedric-ruiu/stylelint-config)

- Based on [Stylelint](https://stylelint.io/) v16
- Support lint Sass language (extend [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss))
- Support lint HTML files (extend [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- Support lint Vue files (including Sass, extend [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- Support Tailwind rules
- Support UnoCSS rules
- Logical sorting properties (extend [stylelint-config-clean-order](https://github.com/kutsan/stylelint-config-clean-order))
- Reasonable defaults, best practices, only one-line of config

> **Requirements**
>
> - [Stylelint](https://stylelint.io/) v16.0.0 and above

## Usage

### Install

```bash
yarn add -D @cedric-ruiu/stylelint-config
```

### Config `.stylelintrc`

```json
{
  "extends": "@cedric-ruiu/stylelint-config"
}
```

### Config VSCode auto fix

Install [Stylelint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and create `.vscode/settings.json`

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
  "stylelint.validate": ["css", "postcss", "scss", "html", "vue"],
}
```
