import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import prismjs from "vite-plugin-prismjs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    prismjs({
      languages: ["javascript"],
      theme: "default",
      css: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
