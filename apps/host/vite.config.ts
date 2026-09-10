import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    (federation as unknown as typeof federation.default)({
      name: 'host',
      remotes: {
        mfe_detail: 'http://localhost:3001/assets/remoteEntry.js',
        mfe_history: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
});