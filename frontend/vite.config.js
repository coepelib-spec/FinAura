import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly defining the root helps Vercel during Monorepo builds
  root: './',
  build: {
    outDir: 'dist',
  },
});

