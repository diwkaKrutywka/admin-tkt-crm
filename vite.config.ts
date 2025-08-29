import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      ".ngrok-free.app",
      "localhost",
      "127.0.0.1",
    ],
  },
  plugins: [vue(), tailwindcss()],
});
