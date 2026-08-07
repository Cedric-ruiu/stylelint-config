import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createConfig } from "../src/create-config.js";
import css from "../src/css.js";
import cssError from "../src/css-error.js";
import error from "../src/error.js";
import index from "../src/index.js";
import { lintCode } from "./helpers.js";

const MISORDERED = ".bar {\n  color: red;\n  display: block;\n}\n";
const TAILWIND_V4 =
  '@import "tailwindcss";\n@plugin "@tailwindcss/typography";\n@source "../ui";\n';

const PRESETS = [
  { name: ".", config: index, scss: true, severity: "warning" },
  { name: "./error", config: error, scss: true, severity: "error" },
  { name: "./css", config: css, scss: false, severity: "warning" },
  { name: "./css/error", config: cssError, scss: false, severity: "error" },
];

describe("preset matrix", () => {
  for (const { name, config, scss, severity } of PRESETS) {
    describe(name, () => {
      it(`reports property order as ${severity}`, async () => {
        const warnings = await lintCode(MISORDERED, { config });
        const order = warnings.filter((w) => w.rule === "order/properties-order");

        assert.ok(order.length > 0, "expected the order rule to fire");
        for (const w of order) {
          assert.equal(w.severity, severity);
        }
      });

      it(`${scss ? "loads" : "does not load"} the SCSS layer`, () => {
        const base = config.extends[0];

        assert.equal(
          base,
          scss ? "stylelint-config-standard-scss" : "stylelint-config-standard",
        );
        assert.equal("scss/at-mixin-argumentless-call-parentheses" in config.rules, scss);
        assert.equal("scss/at-rule-no-unknown" in config.rules, scss);
        assert.equal("at-rule-no-unknown" in config.rules, !scss);
      });

      it("accepts a Tailwind v4 header without empty-line noise", async () => {
        const warnings = await lintCode(TAILWIND_V4, { config });

        assert.deepEqual(warnings, []);
      });

      it("extends stylelint-config-html for embedded styles", () => {
        assert.ok(config.extends.includes("stylelint-config-html"));
      });
    });
  }

  it("exposes the same rule set regardless of severity", () => {
    assert.deepEqual(Object.keys(index.rules), Object.keys(error.rules));
    assert.deepEqual(Object.keys(css.rules), Object.keys(cssError.rules));
  });

  it("defaults to the SCSS layer and warning severity", () => {
    assert.deepEqual(createConfig(), index);
  });
});
