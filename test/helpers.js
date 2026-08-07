import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import stylelint from "stylelint";

import config from "../src/index.js";

export const FIXTURES = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
);

/**
 * Lints a fixture file through Stylelint the way a consumer would: by pointing at
 * the file and letting the config pick the syntax. Deliberately never passes
 * `customSyntax` — resolving the parser for .scss/.vue/.svelte/.astro is the
 * config's job, and a test that hands it over cannot detect it breaking.
 *
 * @returns {Promise<Array<{rule: string, line: number, severity: string}>>}
 */
export async function lintFixture(relativePath, { config: cfg = config } = {}) {
  const result = await stylelint.lint({
    files: path.join(FIXTURES, relativePath),
    config: cfg,
  });

  const [file] = result.results;

  assert.deepEqual(
    file.parseErrors ?? [],
    [],
    `${relativePath} failed to parse — the config did not resolve a syntax for it`,
  );

  return file.warnings.map(({ rule, line, severity }) => ({
    rule,
    line,
    severity,
  }));
}

/** Lints an inline snippet under an explicit filename. */
export async function lintCode(
  code,
  { filename = "test.css", config: cfg = config } = {},
) {
  const result = await stylelint.lint({ code, config: cfg, codeFilename: filename });

  return result.results[0].warnings.map(({ rule, line, severity }) => ({
    rule,
    line,
    severity,
  }));
}

/** Asserts a fixture produces no warnings at all. */
export async function assertClean(relativePath, options) {
  const warnings = await lintFixture(relativePath, options);

  assert.deepEqual(
    warnings,
    [],
    `expected ${relativePath} to be clean, got:\n${format(warnings)}`,
  );
}

/**
 * Asserts that `rule` fires on `relativePath`, and on the given lines when
 * provided. Checking the rule by name is the point: asserting "some warning
 * happened" cannot tell a working rule from a broken one when a fixture trips
 * several rules at once.
 */
export async function assertRuleFires(relativePath, rule, { lines, options } = {}) {
  const warnings = await lintFixture(relativePath, options);
  const hits = warnings.filter((w) => w.rule === rule);

  assert.ok(
    hits.length > 0,
    `expected ${rule} to fire on ${relativePath}, got:\n${format(warnings)}`,
  );

  if (lines) {
    assert.deepEqual(
      hits.map((w) => w.line).sort((a, b) => a - b),
      [...lines].sort((a, b) => a - b),
      `${rule} fired on the wrong lines in ${relativePath}`,
    );
  }

  return hits;
}

/** Asserts that `rule` does NOT fire on `relativePath`. */
export async function assertRuleSilent(relativePath, rule, options) {
  const warnings = await lintFixture(relativePath, options);
  const hits = warnings.filter((w) => w.rule === rule);

  assert.deepEqual(
    hits,
    [],
    `expected ${rule} to stay silent on ${relativePath}, got:\n${format(hits)}`,
  );
}

function format(warnings) {
  return (
    warnings.map((w) => `  L${w.line} [${w.severity}] ${w.rule}`).join("\n") || "  (none)"
  );
}
