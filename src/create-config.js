/**
 * At-rules that are not standard CSS but are emitted by Tailwind CSS (v3 and v4)
 * or UnoCSS. They are stripped by the respective PostCSS plugin at build time,
 * so Stylelint must not treat them as unknown.
 *
 * v3: apply, config, layer, responsive, screen, tailwind, variants
 * v4: apply, config, custom-variant, plugin, reference, source, theme, utility, variant
 * UnoCSS: apply, layer, screen, unocss
 */
const AT_RULES = [
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
];

/**
 * At-rules allowed to sit directly against the previous line. Tailwind v4 entry
 * files stack a header of blockless directives (`@import`, `@plugin`, `@source`,
 * `@custom-variant`) that would otherwise each demand a blank line before it.
 * `@use` / `@forward` get the same treatment for Sass module headers.
 */
const AT_RULES_WITHOUT_EMPTY_LINE = [
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
];

/**
 * Builds a Stylelint config.
 *
 * @param {object} [options]
 * @param {boolean} [options.scss] Include the SCSS layer (parser, `scss/*` rules).
 *   Set to `false` for projects that only write plain CSS — a Tailwind v4 codebase,
 *   typically — to avoid loading `stylelint-scss` and the SCSS parser for nothing.
 * @param {"warning" | "error"} [options.severity] Severity of the property-order rules.
 * @returns {import('stylelint').Config}
 */
export function createConfig({ scss = true, severity = "warning" } = {}) {
  const order =
    severity === "error"
      ? "stylelint-config-clean-order/error"
      : "stylelint-config-clean-order";

  return {
    extends: [
      scss ? "stylelint-config-standard-scss" : "stylelint-config-standard",
      "stylelint-config-html",
      order,
    ],
    rules: {
      // Vue scoped-style selectors
      "selector-pseudo-class-no-unknown": [
        true,
        {
          ignorePseudoClasses: ["deep", "global", "slotted"],
        },
      ],
      // Legacy Vue / early Vue 3 scoped selectors
      "selector-pseudo-element-no-unknown": [
        true,
        {
          ignorePseudoElements: ["v-deep", "v-global", "v-slotted"],
        },
      ],
      // Tailwind / UnoCSS at-rules. stylelint-config-standard-scss turns the core
      // rule off in favour of the scss/ variant, so which one to configure depends
      // on whether the SCSS layer is loaded.
      ...(scss
        ? { "scss/at-rule-no-unknown": [true, { ignoreAtRules: AT_RULES }] }
        : { "at-rule-no-unknown": [true, { ignoreAtRules: AT_RULES }] }),
      // Keeps stylelint-config-clean-order's shape — it extends last and wins —
      // and only adds the at-rules that may hug the previous line.
      "at-rule-empty-line-before": [
        "always",
        {
          ignore: [
            "first-nested",
            "blockless-after-same-name-blockless",
            "after-comment",
          ],
          ignoreAtRules: AT_RULES_WITHOUT_EMPTY_LINE,
          severity,
        },
      ],
      // There must always be parentheses in mixin calls, even if no arguments are
      // passed, like functions
      ...(scss ? { "scss/at-mixin-argumentless-call-parentheses": "always" } : {}),
      // Tailwind v4 writes `@import "tailwindcss"`, not `@import url(...)`.
      // stylelint-config-standard-scss already sets this; stylelint-config-standard
      // does not.
      ...(scss ? {} : { "import-notation": "string" }),
      // Tailwind v4 theme functions: --alpha(), --spacing(), and the legacy theme().
      // stylelint-config-recommended-scss disables this rule outright, so it only
      // needs handling on the plain-CSS side.
      ...(scss
        ? {}
        : {
            "declaration-property-value-no-unknown": [
              true,
              { ignoreFunctions: ["/^--/", "theme"] },
            ],
          }),
    },
  };
}

export { AT_RULES, AT_RULES_WITHOUT_EMPTY_LINE };
