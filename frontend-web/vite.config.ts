import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.webm"],
  server: {
    // listen on all interfaces so that the app can be accessed eg via a phone on the same network
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@common": path.resolve(__dirname, "../common"),
    },
  },
});
