import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ cache: false })],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        rewrite: (path) => {
          path = path.replace(/^\/api/, "");
          return path;
        },
      },
    },
  },
});
