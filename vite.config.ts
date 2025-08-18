import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: command === 'build' ? '/sc/' : '/',
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
