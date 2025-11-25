import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("./certs/private.key"),
      cert: fs.readFileSync("./certs/certificate.crt"),
    },
    port: 5173,
  },
});
