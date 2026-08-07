import { createConfig } from "./create-config.js";

/** Plain-CSS preset, with property order reported as errors (fails CI). */
export default createConfig({ scss: false, severity: "error" });
