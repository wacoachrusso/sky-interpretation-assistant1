import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  publicDir: 'public',
  server: {
    host: "::",
    port: 8080,
    hmr: true
  },
  build: {
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const imgExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];
          if (assetInfo.name && imgExtensions.some(ext => assetInfo.name?.endsWith(ext))) {
            return `assets/[name][extname]`;
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  plugins: [
    react(),
    componentTagger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
});
