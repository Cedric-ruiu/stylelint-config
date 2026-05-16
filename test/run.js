"use strict";

const path = require("node:path");
const stylelint = require("stylelint");

const config = require("../src/index.js");

const fixtures = [
  { file: "valid.css", expect: "valid" },
  { file: "valid.scss", expect: "valid", customSyntax: "postcss-scss" },
  { file: "valid.html", expect: "valid", customSyntax: "postcss-html" },
  { file: "valid.vue", expect: "valid", customSyntax: "postcss-html" },
  { file: "error.css", expect: "error" },
  { file: "error.scss", expect: "error", customSyntax: "postcss-scss" },
  { file: "error.html", expect: "error", customSyntax: "postcss-html" },
  { file: "error.vue", expect: "error", customSyntax: "postcss-html" },
];

async function run() {
  const failures = [];

  for (const { file, expect, customSyntax } of fixtures) {
    const result = await stylelint.lint({
      files: path.join(__dirname, file),
      config,
      customSyntax,
    });

    const hasErrors = result.results.some((r) => r.warnings.length > 0);

    if (expect === "valid" && hasErrors) {
      const warnings = result.results.flatMap((r) => r.warnings);
      failures.push(`${file}: expected no errors, got:\n${JSON.stringify(warnings, null, 2)}`);
    }

    if (expect === "error" && !hasErrors) {
      failures.push(`${file}: expected errors, got none`);
    }
  }

  if (failures.length > 0) {
    console.error(`✗ ${failures.length} fixture(s) failed:\n`);
    for (const f of failures) console.error(`  - ${f}\n`);
    process.exit(1);
  }

  console.log(`✓ ${fixtures.length} fixtures passed`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
