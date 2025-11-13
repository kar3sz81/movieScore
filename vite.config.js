import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: { host: true, port: 80, allowedHosts: true},
  plugins: [react(), tailwindcss()],
});

// Source - https://stackoverflow.com/a
// Posted by ansmonjol, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-13, License - CC BY-SA 4.0

server: {
  allowedHosts: true
}

