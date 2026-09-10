import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    (federation as unknown as typeof federation.default)({
      name: 'mfe_detail',
      filename: 'remoteEntry.js',
      exposes: {
        './PokemonDetail': './src/components/PokemonDetail.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
});