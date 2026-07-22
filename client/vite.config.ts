import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({
    open: true,
    gzipSize: true,
  }),
  ],
  
  server: {
    port: 3000,
    proxy: {
      "/vfs-actions": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,

        configure(proxy) {
          proxy.on("error", () => {
            console.log(
              "\x1b[35mIf the Vite server is intentionally running solo, disregard the following AggregateError:\x1b[0m"
            );
          });
        }
      },
    },
  }
})
