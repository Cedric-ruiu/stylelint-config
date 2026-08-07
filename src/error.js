import { createConfig } from "./create-config.js";

/** Full preset, with property order reported as errors (fails CI). */
export default createConfig({ scss: true, severity: "error" });
