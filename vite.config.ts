import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        demo: "demo.html",
        opsQueues: "ops-queues.html",
      },
    },
  },
  plugins: [react()],
});
