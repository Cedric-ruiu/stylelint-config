import { createConfig } from "./create-config.js";

/** Full preset: SCSS + HTML/Vue/Svelte/Astro + property order as warnings. */
export default createConfig({ scss: true, severity: "warning" });
