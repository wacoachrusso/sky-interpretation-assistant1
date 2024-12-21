import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  publicDir: 'public',
  server: {
    host: "::",
    port: 8080,
    hmr: true,
  },
  build: {
    copyPublicDir: true,
    assetsInclude: ['**/*.png', '**/*.ico'],
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.png') || name.endsWith('.ico')) {
            return `${name}`;
          }
          return 'assets/[name]-[hash][extname]';
        },
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
