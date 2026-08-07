import { createConfig } from "./create-config.js";

/** Plain-CSS preset (no SCSS layer) + property order as warnings. */
export default createConfig({ scss: false, severity: "warning" });
