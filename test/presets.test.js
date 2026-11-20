import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { createConfig } from "../src/create-config.js";
import css from "../src/css.js";
import cssError from "../src/css-error.js";
import error from "../src/error.js";
import index from "../src/index.js";
import { assertClean, FIXTURES, lintCode } from "./helpers.js";

const VALID_FIXTURES = fs.readdirSync(path.join(FIXTURES, "valid")).sort();
// Sass fixtures are out of scope for the plain-CSS presets.
const VALID_CSS_FIXTURES = VALID_FIXTURES.filter(
  (f) => !f.endsWith(".scss") && !f.endsWith(".sass"),
);

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

      // `yarn lint` only runs the fixtures through the default preset, so rules the
      // SCSS layer turns off (e.g. at-rule-prelude-no-invalid) would go unchecked.
      if (!scss) {
        it("still validates the prelude of standard at-rules", async () => {
          const warnings = await lintCode('@property foo {\n  syntax: "*";\n}\n', {
            config,
          });

          assert.ok(warnings.some((w) => w.rule === "at-rule-prelude-no-invalid"));
        });

        it("still validates media queries outside theme()", async () => {
          const warnings = await lintCode(
            "@media (width >= var(--bp)) {\n  .a {\n    color: red;\n  }\n}\n",
            { config },
          );

          assert.ok(warnings.some((w) => w.rule === "media-query-no-invalid"));
        });
      }

      for (const fixture of scss ? VALID_FIXTURES : VALID_CSS_FIXTURES) {
        it(`lints valid/${fixture} clean`, async () => {
          await assertClean(`valid/${fixture}`, { config });
        });
      }
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
