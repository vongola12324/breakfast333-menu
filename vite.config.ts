import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // Generate static files for GitHub Pages
    outDir: "dist",
    emptyOutDir: true
  },
  // Base path for GitHub Pages
  // Change this to match your GitHub repository name if needed
  // e.g., if your repo is username.github.io/breakfast-menu, use "/breakfast-menu/"
  base: "/",
  
  // Configure server to properly serve files from public directory
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
});
