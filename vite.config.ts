import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split large, rarely-changing vendor code into its own long-cacheable
    // chunks so an app-code change doesn't bust the whole bundle.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-router")) return "router";
          if (id.includes("framer-motion") || id.includes("motion-dom"))
            return "motion";
          if (id.includes("react")) return "react-vendor";
          return undefined;
        },
      },
    },
    // The split vendor chunks stay under this; keeps the build output clean.
    chunkSizeWarningLimit: 700,
  },
});
