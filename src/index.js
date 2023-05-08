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
        ignorePseudoClasses: ["deep", "global"],
      },
    ],
    // Support VueJS rules
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep", "v-global", "v-slotted"],
      },
    ],
    // Support Tailwind / UnoCSS rules
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "apply",
          "config",
          "layer",
          "responsive",
          "screen",
          "tailwind",
          "unocss",
          "variants",
        ],
      },
    ],
    // There must always be parentheses in mixin calls, even if no arguments are passed, like functions
    "scss/at-mixin-argumentless-call-parentheses": "always",
  },
};
