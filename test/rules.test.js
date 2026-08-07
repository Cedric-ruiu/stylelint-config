import { describe, it } from "node:test";

import { assertClean, assertRuleFires, assertRuleSilent } from "./helpers.js";

// The four rules this config adds on top of what it extends. Each gets both a
// passing and a failing case: a rule that never fires in the suite is a rule
// nobody would notice regressing.
describe("custom rules", () => {
  describe("scss/at-rule-no-unknown", () => {
    it("rejects a genuinely unknown at-rule", async () => {
      await assertRuleFires("invalid/unknown-at-rule.css", "scss/at-rule-no-unknown", {
        lines: [1],
      });
    });

    it("allows Tailwind v3 at-rules", async () => {
      await assertClean("valid/tailwind-v3.css");
    });

    it("allows Tailwind v4 at-rules", async () => {
      await assertClean("valid/tailwind-v4.css");
    });

    it("allows UnoCSS at-rules", async () => {
      await assertClean("valid/unocss.css");
    });
  });

  describe("scss/at-mixin-argumentless-call-parentheses", () => {
    it("rejects an argumentless @include without parentheses", async () => {
      await assertRuleFires(
        "invalid/mixin-parentheses.scss",
        "scss/at-mixin-argumentless-call-parentheses",
        { lines: [6] },
      );
    });

    it("accepts an argumentless @include with parentheses", async () => {
      await assertClean("valid/base.scss");
    });
  });

  describe("selector-pseudo-class-no-unknown", () => {
    it("rejects an unknown pseudo-class", async () => {
      await assertRuleFires(
        "invalid/pseudo-class.scss",
        "selector-pseudo-class-no-unknown",
        { lines: [1] },
      );
    });

    it("accepts the Vue scoped pseudo-classes", async () => {
      await assertRuleSilent(
        "valid/vue-selectors.scss",
        "selector-pseudo-class-no-unknown",
      );
    });
  });

  describe("selector-pseudo-element-no-unknown", () => {
    it("rejects an unknown pseudo-element", async () => {
      await assertRuleFires(
        "invalid/pseudo-element.scss",
        "selector-pseudo-element-no-unknown",
        { lines: [1] },
      );
    });

    it("accepts the Vue scoped pseudo-elements", async () => {
      await assertRuleSilent(
        "valid/vue-selectors.scss",
        "selector-pseudo-element-no-unknown",
      );
    });
  });
});

// Rules inherited from the extended configs. Thin coverage on purpose: enough to
// notice if a whole layer stops being applied.
describe("inherited rules", () => {
  it("flags unknown properties", async () => {
    await assertRuleFires("invalid/unknown-property.css", "property-no-unknown");
  });

  it("flags non-kebab-case class selectors", async () => {
    await assertRuleFires("invalid/class-pattern.css", "selector-class-pattern");
  });

  it("flags empty blocks", async () => {
    await assertRuleFires("invalid/empty-block.css", "block-no-empty");
  });

  it("flags misordered properties", async () => {
    await assertRuleFires("invalid/property-order.css", "order/properties-order");
  });
});
