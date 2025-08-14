import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@lib": "/src/lib",
      "@utils": "/src/utils",
      "@types": "/src/types",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries
          if (id.includes("node_modules")) {
            // CodeMirror packages - large dependency
            if (id.includes("@codemirror") || id.includes("codemirror")) {
              return "codemirror";
            }
            // React packages
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            // Markdown processing
            if (id.includes("marked") || id.includes("dompurify")) {
              return "markdown";
            }
            // PDF functionality (though it's loaded via CDN)
            if (id.includes("html2pdf")) {
              return "pdf";
            }
            // Other vendor packages
            return "vendor";
          }

          // Split app components
          if (id.includes("/src/components/")) {
            return "components";
          }

          // Split utilities
          if (id.includes("/src/utils/") || id.includes("/src/lib/")) {
            return "utils";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
