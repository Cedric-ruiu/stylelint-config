import assert from "node:assert/strict";
import { describe, it } from "node:test";

import stylelint from "stylelint";

import config from "../src/index.js";

/**
 * Property ordering only ever manifests through --fix, so the headline feature of
 * this config is invisible to any test that just counts warnings.
 */
describe("--fix", () => {
  const cases = [
    {
      name: "css",
      filename: "app.css",
      input: ".bar {\n  color: red;\n  display: block;\n  position: absolute;\n}\n",
      expected: ".bar {\n  position: absolute;\n  display: block;\n  color: red;\n}\n",
    },
    {
      name: "scss",
      filename: "app.scss",
      input: ".bar {\n  color: red;\n  width: 0;\n  position: absolute;\n}\n",
      expected: ".bar {\n  position: absolute;\n  width: 0;\n  color: red;\n}\n",
    },
    {
      name: "vue",
      filename: "app.vue",
      input: "<style>\n.bar {\n  color: red;\n  display: block;\n}\n</style>\n",
      expected: "<style>\n.bar {\n  display: block;\n  color: red;\n}\n</style>\n",
    },
  ];

  for (const { name, filename, input, expected } of cases) {
    it(`reorders properties in ${name}`, async () => {
      const result = await stylelint.lint({
        code: input,
        config,
        codeFilename: filename,
        fix: true,
      });

      assert.equal(result.code, expected);
    });
  }

  it("leaves already-ordered declarations untouched", async () => {
    const code = ".bar {\n  position: absolute;\n  display: block;\n  color: red;\n}\n";
    const result = await stylelint.lint({
      code,
      config,
      codeFilename: "app.css",
      fix: true,
    });

    assert.equal(result.code, code);
  });
});
