module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-html",
    "stylelint-config-clean-order",
  ],
  rules: {
    // Support VueJS rules
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep", "global", "slotted"],
      },
    ],
    // Support VueJS rules
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "v-global", "v-slotted"],
      },
    ],
    // Support Tailwind (v3 and v4) / UnoCSS rules
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "apply",
          "config",
          "custom-variant",
          "layer",
          "plugin",
          "reference",
          "responsive",
          "screen",
          "source",
          "tailwind",
          "theme",
          "unocss",
          "utility",
          "variant",
          "variants",
        ],
      },
    ],
    // Tailwind v4 and Sass headers stack blockless at-rules, which would otherwise
    // each demand a blank line before them. Keeps stylelint-config-clean-order's
    // shape — it extends last and wins — and only adds ignoreAtRules.
    "at-rule-empty-line-before": [
      "always",
      {
        ignore: [
          "first-nested",
          "blockless-after-same-name-blockless",
          "after-comment",
        ],
        ignoreAtRules: [
          "else",
          "config",
          "custom-variant",
          "forward",
          "import",
          "plugin",
          "reference",
          "source",
          "tailwind",
          "theme",
          "use",
          "utility",
        ],
        severity: "warning",
      },
    ],
    // There must always be parentheses in mixin calls, even if no arguments are passed, like functions
    "scss/at-mixin-argumentless-call-parentheses": "always",
  },
};
