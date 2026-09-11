import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const mfeDetailUrl = env.VITE_MFE_DETAIL_URL || 'http://localhost:3001';
  const mfeHistoryUrl = env.VITE_MFE_HISTORY_URL || 'http://localhost:3002';

  return {
    plugins: [
      react(),
      (federation as unknown as typeof federation.default)({
        name: 'host',
        filename: 'remoteEntry.js',
        exposes: {
          './store': './src/store/useAppStore.ts',
        },
        remotes: {
          mfe_detail: `${mfeDetailUrl}/assets/remoteEntry.js`,
          mfe_history: `${mfeHistoryUrl}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom', 'zustand', '@tanstack/react-query'],
      }),
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
  };
});