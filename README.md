# @cedric-ruiu/stylelint-config [![npm](https://img.shields.io/npm/v/@cedric-ruiu/stylelint-config.svg)](https://npmjs.com/package/@cedric-ruiu/stylelint-config)

- Based on [Stylelint](https://stylelint.io/) v15
- Support lint Sass language (extend [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss))
- Support lint HTML files (extend [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- Support lint Vue files (including Sass, extend [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html))
- Support Tailwind rules
- Support UnoCSS rules
- Logical sorting properties (extend [stylelint-config-clean-order](https://github.com/kutsan/stylelint-config-clean-order))
- Reasonable defaults, best practices, only one-line of config
- Use it with [Prettier](https://prettier.io/)

> **Requirements**
>
> - [Stylelint](https://stylelint.io/) v15.0.0 and above
> - [Prettier](https://prettier.io/)

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
  "prettier.enable": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "scss", "vue", "html"],
  "css.validate": false,
  "scss.validate": false
}
```
