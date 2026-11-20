import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import stylelint from "stylelint";

import config from "../src/index.js";
import { FIXTURES } from "./helpers.js";

const ROOT = path.join(FIXTURES, "..", "..");
const BIOME = createRequire(import.meta.url).resolve("@biomejs/biome/bin/biome");

// Fixtures Biome can parse. tailwind-v3.css (theme() in a media query) and
// vue-selectors.scss (:deep() outside .vue) are known Biome parse failures,
// documented in the README.
const FORMATTABLE = ["base.css", "base.scss", "tailwind-v4.css", "unocss.css"];

// Unformatted and misordered on purpose, so both tools have work to do. `.panel`
// has enough properties for Biome's built-in order (useSortedProperties) to
// disagree with this config's, so enabling it in the README fails the test.
const MESSY = `@use "sass:math";
$gap:4px;
.card{font-size:2px;position:absolute;width:0;display:block;height:2px;margin:$gap;
  &:hover{color:red}
  .title{width:math.div(10px,2);color:blue}
}
.panel{color:red;z-index:2;transition:opacity 1s;font-size:1rem;border:1px solid;margin:0;
  display:flex;position:relative;padding:1rem;width:10px;background:blue;opacity:0.5;
  inset-block-start:0;gap:1rem;cursor:pointer}
`;

/**
 * The README's "Or use both" section promises that Biome's formatter and this
 * config converge. This runs that exact setup — the biome.json is read from the
 * README — so a Biome upgrade that breaks the promise fails CI instead of
 * silently making the docs wrong.
 */
describe("alongside Biome", { concurrency: false }, () => {
  let dir;

  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylelint-config-biome-"));
    fs.writeFileSync(path.join(dir, "biome.json"), readmeBiomeConfig());
    fs.writeFileSync(path.join(dir, "messy.scss"), MESSY);

    for (const fixture of FORMATTABLE) {
      fs.copyFileSync(path.join(FIXTURES, "valid", fixture), path.join(dir, fixture));
    }
  });

  after(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("checks, fixes and checks again without changes", async () => {
    biome(["check", "--write", "."]);

    const fixed = await stylelint.lint({
      files: path.join(dir, "*.{css,scss}"),
      config,
      fix: true,
    });
    const left = fixed.results.flatMap((r) =>
      r.warnings.map((w) => `${path.basename(r.source)}:${w.line} ${w.rule}`),
    );

    assert.deepEqual(left, [], "stylelint --fix should leave nothing behind");

    // Exits non-zero when formatting or an assist action would still change a file.
    biome(["check", "."]);
  });

  function biome(args) {
    try {
      execFileSync(process.execPath, [BIOME, ...args], { cwd: dir, stdio: "pipe" });
    } catch (error) {
      assert.fail(`biome ${args.join(" ")} failed:\n${error.stdout}${error.stderr}`);
    }
  }
});

function readmeBiomeConfig() {
  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  const section = readme.slice(readme.indexOf("### Or use both"));
  const block = section.match(/```json\n([\s\S]*?)```/);

  assert.ok(block, 'no ```json block under "### Or use both" in README.md');

  return block[1];
}
