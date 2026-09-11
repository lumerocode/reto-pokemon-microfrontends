import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    (federation as unknown as typeof federation.default)({
      name: 'mfe_history',
      filename: 'remoteEntry.js',
      exposes: {
        './PokemonHistory': {
          import: './src/components/PokemonHistory.tsx',
          dontAppendStylesToHead: true,
        },
      },
      shared: ['react', 'react-dom', 'zustand', '@tanstack/react-query'],
    }),
  ],
  server: {
    port: 3002,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3002,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});