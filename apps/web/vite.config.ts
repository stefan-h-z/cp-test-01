import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tamaguiPlugin } from '@tamagui/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: './src/tamagui.config.ts',
      components: ['tamagui', '@app/ui'],
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  define: {
    'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
  },
  optimizeDeps: {
    include: ['@app/ui', '@app/shared', '@app/config', '@app/types'],
  },
});
