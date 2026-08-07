import { describe, it } from "node:test";

import { assertClean, assertRuleFires } from "./helpers.js";

/**
 * Every case here goes through `lintFixture`, which never passes `customSyntax`.
 * That is the whole point of this file: picking a parser for .scss, .vue, .svelte
 * and friends is the config's responsibility (it comes from the `customSyntax` set
 * by stylelint-config-recommended-scss and the `overrides` from
 * stylelint-config-html). A test that supplies the parser itself would keep
 * passing even if those were dropped from `extends`.
 */
describe("syntax resolution (no explicit customSyntax)", () => {
  const clean = [
    "valid/base.css",
    "valid/base.scss",
    "valid/base.html",
    "valid/base.vue",
    "valid/base.svelte",
    "valid/base.astro",
    "valid/base.php",
  ];

  for (const fixture of clean) {
    it(`parses and accepts ${fixture}`, async () => {
      await assertClean(fixture);
    });
  }

  it("still reports errors inside a .vue <style> block", async () => {
    await assertRuleFires("invalid/unknown-at-rule.vue", "scss/at-rule-no-unknown", {
      lines: [2],
    });
  });
});
