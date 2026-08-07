import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Packs the package and consumes it the way a user would — installed under
 * node_modules, referenced by name in `extends`. This is the only test that can
 * catch a broken `files` / `exports` / `types` field: everything else imports
 * from src/ directly and would stay green while the published tarball is unusable.
 */
describe("published package", { concurrency: false }, () => {
  let dir;
  let tarball;

  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylelint-config-smoke-"));

    const packed = execFileSync("npm", ["pack", "--pack-destination", dir], {
      cwd: ROOT,
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .at(-1);

    tarball = path.join(dir, packed);

    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "smoke-test", version: "1.0.0", private: true }, null, 2),
    );

    execFileSync(
      "npm",
      ["install", "--no-audit", "--no-fund", tarball, `stylelint@${stylelintVersion()}`],
      {
        cwd: dir,
        stdio: "pipe",
      },
    );
  });

  after(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const entries = [
    { subpath: "@cedric-ruiu/stylelint-config", severity: "warning" },
    { subpath: "@cedric-ruiu/stylelint-config/error", severity: "error" },
    { subpath: "@cedric-ruiu/stylelint-config/css", severity: "warning" },
    { subpath: "@cedric-ruiu/stylelint-config/css/error", severity: "error" },
  ];

  for (const { subpath, severity } of entries) {
    it(`resolves "${subpath}" from a consumer project`, async () => {
      fs.writeFileSync(
        path.join(dir, ".stylelintrc.json"),
        JSON.stringify({ extends: subpath }),
      );
      fs.writeFileSync(
        path.join(dir, "app.css"),
        ".bar {\n  color: red;\n  display: block;\n}\n",
      );

      const out = execFileSync(
        process.execPath,
        ["--input-type=module", "-e", consumerScript()],
        { cwd: dir, encoding: "utf8" },
      );

      const result = JSON.parse(out.trim().split("\n").at(-1));

      assert.ok(
        result.count > 0,
        "the order rule should fire through the published entry",
      );
      assert.equal(result.severity, severity);
    });
  }

  it("ships only the intended files", () => {
    const listed = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
      .trim()
      .split("\n")
      .map((f) => f.replace(/^package\//, ""))
      .filter(Boolean)
      .sort();

    assert.deepEqual(listed, [
      "CHANGELOG.md",
      "LICENSE",
      "README.md",
      "package.json",
      "src/create-config.d.ts",
      "src/create-config.js",
      "src/css-error.d.ts",
      "src/css-error.js",
      "src/css.d.ts",
      "src/css.js",
      "src/error.d.ts",
      "src/error.js",
      "src/index.d.ts",
      "src/index.js",
    ]);
  });
});

function stylelintVersion() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
    .devDependencies.stylelint;
}

function consumerScript() {
  return `
    import stylelint from "stylelint";
    const r = await stylelint.lint({ files: "app.css" });
    const w = r.results[0].warnings.filter((x) => x.rule === "order/properties-order");
    console.log(JSON.stringify({ count: w.length, severity: w[0]?.severity }));
  `;
}
