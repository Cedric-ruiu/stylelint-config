import type { Config } from "stylelint";

export interface CreateConfigOptions {
  /** Include the SCSS layer (parser, `scss/*` rules). Defaults to `true`. */
  scss?: boolean;
  /** Severity of the property-order rules. Defaults to `"warning"`. */
  severity?: "warning" | "error";
}

export declare function createConfig(options?: CreateConfigOptions): Config;

export declare const AT_RULES: string[];
export declare const AT_RULES_WITHOUT_EMPTY_LINE: string[];
